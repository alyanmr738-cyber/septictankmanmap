import { getGeocodingConfig } from "@/lib/env";
import { revalidateMapPaths } from "@/lib/cache/revalidateMap";
import { createReviewId, getReviewByGoogleId, listReviews, upsertReview } from "@/lib/database/reviews";
import { normalizeName } from "@/lib/matching/normalizeName";
import { getContact } from "@/lib/integrations/ghl/getContact";
import { geocodeCustomerLocation } from "@/lib/integrations/geocoding/client";
import { anonymizeCoordinates } from "@/lib/privacy/anonymizeCoordinates";
import { assertReviewPublishable } from "@/lib/privacy/placeholderGuard";
import { toPublicReviewerName } from "@/lib/privacy/publicReviewerName";
import { runReviewMatching } from "@/lib/reviews/runReviewMatching";
import { assignServiceAreaPin } from "@/lib/serviceAreas/pool";
import type { LocationSource, ReviewRecord } from "@/lib/types";

export type LaunchReviewInput = {
  reviewerDisplayName: string;
  rating: number;
  reviewText: string;
  reviewCreatedAt: string;
  googleReviewId?: string | null;
  minRating?: number;
  tryGhlEnrichment?: boolean;
};

export type LaunchPublishResult = {
  review: ReviewRecord;
  locationSource: LocationSource;
  ghlEnriched: boolean;
};

const DEFAULT_MIN_RATING = 4;

function reviewDayKey(name: string, reviewCreatedAt: string): string {
  const day = new Date(reviewCreatedAt).toISOString().slice(0, 10);
  return `${normalizeName(name)}|${day}`;
}

async function findExistingLaunchReview(input: LaunchReviewInput): Promise<ReviewRecord | null> {
  const googleReviewId = input.googleReviewId?.trim();
  if (googleReviewId) {
    const byGoogleId = await getReviewByGoogleId(googleReviewId);
    if (byGoogleId) return byGoogleId;
  }

  const key = reviewDayKey(input.reviewerDisplayName.trim(), input.reviewCreatedAt);
  const reviews = await listReviews();
  return (
    reviews.find(
      (review) =>
        review.reviewCreatedAt &&
        reviewDayKey(review.reviewerDisplayName, review.reviewCreatedAt) === key,
    ) ?? null
  );
}

function validateLaunchInput(input: LaunchReviewInput): void {
  const minRating = input.minRating ?? DEFAULT_MIN_RATING;
  if (!Number.isInteger(input.rating) || input.rating < minRating || input.rating > 5) {
    throw new Error(`Only reviews rated ${minRating} stars or higher can be published at launch.`);
  }
  if (!input.reviewerDisplayName.trim()) {
    throw new Error("Reviewer display name is required.");
  }
  if (!input.reviewText.trim()) {
    throw new Error("Review text is required.");
  }
  if (!input.reviewCreatedAt.trim() || Number.isNaN(Date.parse(input.reviewCreatedAt))) {
    throw new Error("A valid review date is required.");
  }
}

async function tryGhlVerifiedLocation(
  reviewId: string,
  reviewerDisplayName: string,
  reviewCreatedAt: string,
): Promise<{
  locationSource: LocationSource;
  ghlContactId: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  matchConfidence: number;
} | null> {
  const match = await runReviewMatching({
    reviewerDisplayName,
    createTime: reviewCreatedAt,
  });

  const top = match.candidates[0];
  if (!top || (top.score ?? 0) < 90 || !top.city) {
    return null;
  }

  const contact = await getContact(top.ghlContactId);
  if (!contact?.city?.trim()) {
    return null;
  }

  const city = contact.city.trim();
  const state = contact.state?.trim() || "FL";
  const geocoded = await geocodeCustomerLocation({
    city,
    state,
    postalCode: contact.postalCode,
  });

  if (!geocoded) {
    return null;
  }

  const approximate = anonymizeCoordinates(geocoded.lat, geocoded.lng, reviewId);
  return {
    locationSource: "ghl_verified",
    ghlContactId: top.ghlContactId,
    city: geocoded.city ?? city,
    state: geocoded.state ?? state,
    lat: approximate.lat,
    lng: approximate.lng,
    matchConfidence: top.score,
  };
}

export async function publishLaunchReview(input: LaunchReviewInput): Promise<LaunchPublishResult> {
  validateLaunchInput(input);

  const existing = await findExistingLaunchReview(input);
  if (existing?.matchStatus === "approved") {
    throw new Error("This Google review is already published on the map.");
  }

  const googleReviewId = input.googleReviewId?.trim() || existing?.googleReviewId || null;
  if (googleReviewId && existing?.googleReviewId !== googleReviewId) {
    const byGoogleId = await getReviewByGoogleId(googleReviewId);
    if (byGoogleId?.matchStatus === "approved" && byGoogleId.id !== existing?.id) {
      throw new Error("This Google review is already published on the map.");
    }
  }

  const reviewId = existing?.id ?? createReviewId();
  const now = new Date().toISOString();
  const createdAt = existing?.createdAt ?? now;
  let locationSource: LocationSource = "service_area_estimate";
  let ghlContactId: string | null = null;
  let matchConfidence: number | null = null;
  let publicCity: string;
  let publicState: string;
  let publicLat: number;
  let publicLng: number;
  let ghlEnriched = false;
  let serviceAreaId: string | undefined;

  if (input.tryGhlEnrichment) {
    const ghl = await tryGhlVerifiedLocation(
      reviewId,
      input.reviewerDisplayName.trim(),
      new Date(input.reviewCreatedAt).toISOString(),
    );
    if (ghl) {
      locationSource = ghl.locationSource;
      ghlContactId = ghl.ghlContactId;
      matchConfidence = ghl.matchConfidence;
      publicCity = ghl.city;
      publicState = ghl.state;
      publicLat = ghl.lat;
      publicLng = ghl.lng;
      ghlEnriched = true;
    } else {
      const areaPin = assignServiceAreaPin(reviewId);
      publicCity = areaPin.city;
      publicState = areaPin.state;
      publicLat = areaPin.lat;
      publicLng = areaPin.lng;
      serviceAreaId = areaPin.area.id;
    }
  } else {
    const areaPin = assignServiceAreaPin(reviewId);
    publicCity = areaPin.city;
    publicState = areaPin.state;
    publicLat = areaPin.lat;
    publicLng = areaPin.lng;
    serviceAreaId = areaPin.area.id;
  }

  const review: ReviewRecord = {
    id: reviewId,
    googleReviewId,
    reviewerDisplayName: input.reviewerDisplayName.trim(),
    publicReviewerName: toPublicReviewerName(input.reviewerDisplayName.trim()),
    rating: input.rating,
    reviewText: input.reviewText.trim(),
    reviewCreatedAt: new Date(input.reviewCreatedAt).toISOString(),
    ghlContactId,
    matchStatus: "approved",
    matchConfidence,
    publicCity,
    publicState,
    publicLat,
    publicLng,
    matchMetadata: {
      manualImport: true,
      reviewSource: "google_manual",
      launchPublish: true,
      locationSource,
      serviceAreaId,
      geocodingProvider: getGeocodingConfig().provider,
      geocodePrecision: ghlEnriched ? "city" : "service_area",
    },
    approvedAt: now,
    rejectedAt: null,
    isSeed: false,
    createdAt,
    updatedAt: now,
  };

  assertReviewPublishable(review);
  await upsertReview(review);

  revalidateMapPaths();

  return { review, locationSource, ghlEnriched };
}
