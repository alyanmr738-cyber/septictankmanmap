import { getGoogleBusinessConfig, isGoogleConfigured, isMockMode } from "@/lib/env";
import { getGoogleAccessToken, GoogleReviewsNotConfiguredError } from "@/lib/integrations/google-reviews/client";
import type { GoogleListReviewsResponse } from "@/lib/integrations/google-reviews/types";
import type { GoogleReview } from "@/lib/types";
import { logger } from "@/lib/logger";
import { MOCK_GOOGLE_REVIEWS } from "@/lib/seed/mockGoogleReviews";

const STAR_MAP: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

function toRating(value: string | undefined): number {
  return STAR_MAP[value ?? ""] ?? 0;
}

export async function listReviews(): Promise<GoogleReview[]> {
  if (isMockMode()) {
    return MOCK_GOOGLE_REVIEWS;
  }

  if (!isGoogleConfigured()) {
    throw new GoogleReviewsNotConfiguredError();
  }

  const config = getGoogleBusinessConfig();
  if (!config) {
    throw new GoogleReviewsNotConfiguredError();
  }

  const token = await getGoogleAccessToken();
  const reviews: GoogleReview[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(
      `https://mybusiness.googleapis.com/v4/accounts/${config.accountId}/locations/${config.locationId}/reviews`,
    );
    url.searchParams.set("pageSize", "50");
    url.searchParams.set("orderBy", "updateTime desc");
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      logger.error("Google Business reviews request failed", { status: response.status });
      throw new Error(`Google reviews request failed (${response.status})`);
    }

    const data = (await response.json()) as GoogleListReviewsResponse;
    for (const review of data.reviews ?? []) {
      if (!review.reviewId) {
        continue;
      }
      reviews.push({
        reviewId: review.reviewId,
        reviewerDisplayName: review.reviewer?.displayName?.trim() || "Google Reviewer",
        rating: toRating(review.starRating),
        comment: review.comment ?? "",
        createTime: review.createTime ?? null,
        updateTime: review.updateTime ?? null,
      });
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return reviews;
}
