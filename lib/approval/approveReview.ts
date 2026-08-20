import { NextResponse } from "next/server";
import { revalidateMapPaths } from "@/lib/cache/revalidateMap";
import { getGeocodingConfig } from "@/lib/env";
import { getContact } from "@/lib/integrations/ghl/getContact";
import { geocodeCustomerLocation } from "@/lib/integrations/geocoding/client";
import { anonymizeCoordinates } from "@/lib/privacy/anonymizeCoordinates";
import {
  createGeocodePrivacyReport,
  formatGeocodePrivacyLog,
} from "@/lib/privacy/geocodePrivacyReport";
import { assertReviewPublishable } from "@/lib/privacy/placeholderGuard";
import { toPublicReviewerName } from "@/lib/privacy/publicReviewerName";
import { getReviewById, listCandidates, upsertReview } from "@/lib/database/reviews";
import { logger } from "@/lib/logger";

export async function approveReview(reviewId: string, ghlContactId?: string) {
  const review = await getReviewById(reviewId);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const selectedId = ghlContactId ?? review.ghlContactId;
  if (!selectedId) {
    return NextResponse.json({ error: "A customer match is required before approval" }, { status: 400 });
  }

  try {
    assertReviewPublishable(review);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Review cannot be published" },
      { status: 400 },
    );
  }

  const contact = await getContact(selectedId);
  if (!contact) {
    return NextResponse.json({ error: "Matched customer could not be loaded" }, { status: 400 });
  }

  const city = contact.city?.trim();
  const state = contact.state?.trim() || "FL";
  if (!city) {
    return NextResponse.json(
      { error: "Matched customer does not have a usable city for mapping" },
      { status: 400 },
    );
  }

  const geocoded = await geocodeCustomerLocation({
    city,
    state,
    postalCode: contact.postalCode,
    addressLine: contact.address1,
  });

  if (!geocoded) {
    return NextResponse.json({ error: "Unable to geocode the matched customer location" }, { status: 400 });
  }

  const approximate = anonymizeCoordinates(geocoded.lat, geocoded.lng, review.id);
  const privacyReport = createGeocodePrivacyReport({
    geocoded,
    approximate,
    publicCity: geocoded.city ?? city,
    publicState: geocoded.state ?? state,
  });
  const geocodingConfig = getGeocodingConfig();
  const now = new Date().toISOString();

  await upsertReview({
    ...review,
    ghlContactId: selectedId,
    publicReviewerName: toPublicReviewerName(review.reviewerDisplayName),
    publicCity: geocoded.city ?? city,
    publicState: geocoded.state ?? state,
    publicLat: approximate.lat,
    publicLng: approximate.lng,
    matchStatus: "approved",
    approvedAt: now,
    rejectedAt: null,
    matchMetadata: {
      ...(review.matchMetadata ?? {}),
      selectedGhlContactId: selectedId,
      autoMatchLocked: true,
      locationSource: "ghl_verified",
      geocodingProvider: geocodingConfig.provider,
      geocodePrecision: geocoded.precision ?? "city",
      privacyDisplacementMeters: privacyReport.displacementMeters,
    },
    updatedAt: now,
  });

  logger.info("Review approved for public map", {
    reviewId: review.id,
    ...formatGeocodePrivacyLog(privacyReport),
  });

  revalidateMapPaths();

  return NextResponse.json({ ok: true, privacy: formatGeocodePrivacyLog(privacyReport) });
}

export async function rejectReview(reviewId: string) {
  const review = await getReviewById(reviewId);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  await upsertReview({
    ...review,
    matchStatus: "rejected",
    rejectedAt: now,
    approvedAt: null,
    publicLat: null,
    publicLng: null,
    updatedAt: now,
  });

  revalidateMapPaths();
  return NextResponse.json({ ok: true });
}

export async function assignMatch(reviewId: string, ghlContactId: string) {
  const review = await getReviewById(reviewId);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const candidates = await listCandidates(reviewId);
  const selected = candidates.find((candidate) => candidate.ghlContactId === ghlContactId);
  const now = new Date().toISOString();

  await upsertReview({
    ...review,
    ghlContactId,
    matchStatus: "needs_review",
    matchConfidence: selected?.score ?? review.matchConfidence,
    matchMetadata: {
      ...(review.matchMetadata ?? {}),
      selectedGhlContactId: ghlContactId,
      autoMatchLocked: true,
    },
    updatedAt: now,
  });

  return NextResponse.json({ ok: true });
}
