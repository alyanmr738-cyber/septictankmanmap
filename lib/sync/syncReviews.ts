import { listReviews as listGoogleReviews } from "@/lib/integrations/google-reviews/listReviews";
import { toPublicReviewerName } from "@/lib/privacy/publicReviewerName";
import { runReviewMatching } from "@/lib/reviews/runReviewMatching";
import {
  createReviewId,
  getReviewByGoogleId,
  replaceCandidates,
  upsertReview,
} from "@/lib/database/reviews";
import { logger } from "@/lib/logger";
import { isMockMode } from "@/lib/env";
import type { ReviewRecord } from "@/lib/types";

export async function syncReviews(): Promise<{
  fetched: number;
  created: number;
  updated: number;
  skipped: number;
}> {
  const googleReviews = await listGoogleReviews();
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const googleReview of googleReviews) {
    const existing = await getReviewByGoogleId(googleReview.reviewId);
    const now = new Date().toISOString();

    if (existing?.matchStatus === "approved" || existing?.matchMetadata?.autoMatchLocked) {
      if (
        existing.reviewText !== googleReview.comment ||
        existing.rating !== googleReview.rating ||
        existing.reviewerDisplayName !== googleReview.reviewerDisplayName
      ) {
        await upsertReview({
          ...existing,
          reviewerDisplayName: googleReview.reviewerDisplayName,
          publicReviewerName: existing.publicReviewerName || toPublicReviewerName(googleReview.reviewerDisplayName),
          rating: googleReview.rating,
          reviewText: googleReview.comment,
          updatedAt: now,
        });
        updated += 1;
      } else {
        skipped += 1;
      }
      continue;
    }

    const match = await runReviewMatching(googleReview);

    const review: ReviewRecord = {
      id: existing?.id ?? createReviewId(),
      googleReviewId: googleReview.reviewId,
      reviewerDisplayName: googleReview.reviewerDisplayName,
      publicReviewerName: toPublicReviewerName(googleReview.reviewerDisplayName),
      rating: googleReview.rating,
      reviewText: googleReview.comment,
      reviewCreatedAt: googleReview.createTime,
      ghlContactId: existing?.ghlContactId ?? match.candidates[0]?.ghlContactId ?? null,
      matchStatus: match.status === "matched" ? "matched" : match.status,
      matchConfidence: match.bestScore,
      publicCity: match.candidates[0]?.city ?? null,
      publicState: match.candidates[0]?.state ?? null,
      publicLat: existing?.publicLat ?? null,
      publicLng: existing?.publicLng ?? null,
      matchMetadata: existing?.matchMetadata ?? { autoMatchLocked: false },
      approvedAt: existing?.approvedAt ?? null,
      rejectedAt: existing?.rejectedAt ?? null,
      isSeed: existing?.isSeed ?? isMockMode(),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    if (match.status === "matched" && match.candidates[0]) {
      review.ghlContactId = match.candidates[0].ghlContactId;
    }

    await upsertReview(review);
    await replaceCandidates(review.id, match.candidates);

    if (existing) {
      updated += 1;
    } else {
      created += 1;
    }
  }

  logger.info("Review sync completed", {
    fetched: googleReviews.length,
    created,
    updated,
    skipped,
  });

  return { fetched: googleReviews.length, created, updated, skipped };
}
