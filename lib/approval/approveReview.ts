import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getContact } from "@/lib/integrations/ghl/getContact";
import { geocodeCustomerLocation } from "@/lib/integrations/geocoding/client";
import { anonymizeCoordinates } from "@/lib/privacy/anonymizeCoordinates";
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
      geocodePrecision: geocoded.precision,
    },
    updatedAt: now,
  });

  logger.info("Review approved for public map", {
    reviewId: review.id,
    city: geocoded.city ?? city,
  });

  revalidatePath("/map");
  revalidatePath("/api/map");

  return NextResponse.json({ ok: true });
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

  revalidatePath("/map");
  revalidatePath("/api/map");
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
    matchStatus: "matched",
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
