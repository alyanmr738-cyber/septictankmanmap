import { findCandidates } from "@/lib/matching/findCandidates";
import { normalizeName } from "@/lib/matching/normalizeName";
import { toPublicReviewerName } from "@/lib/privacy/publicReviewerName";
import {
  createReviewId,
  deleteReviewById,
  getReviewByGoogleId,
  listReviews,
  replaceCandidates,
  upsertReview,
} from "@/lib/database/reviews";
import {
  resolveImportedReviewStatus,
  runReviewMatching,
} from "@/lib/reviews/runReviewMatching";
import type { GoogleReview, ReviewRecord } from "@/lib/types";

export type ManualGoogleReviewInput = {
  reviewerDisplayName: string;
  rating: number;
  reviewText: string;
  reviewCreatedAt: string;
  googleReviewId?: string | null;
  replacePipelinePlaceholder?: boolean;
  reviewSource?: string;
  batchImport?: boolean;
};

export type ManualGoogleReviewResult = {
  review: ReviewRecord;
  matchStatus: ReviewRecord["matchStatus"];
  candidateCount: number;
  removedPipelinePlaceholders: number;
  bestScore: number | null;
};

function validateManualReviewInput(input: ManualGoogleReviewInput): void {
  const name = input.reviewerDisplayName.trim();
  if (name.length < 3) {
    throw new Error("Reviewer display name is required.");
  }
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }
  if (!input.reviewText.trim()) {
    throw new Error("Review text is required.");
  }
  if (!input.reviewCreatedAt.trim() || Number.isNaN(Date.parse(input.reviewCreatedAt))) {
    throw new Error("A valid review date is required.");
  }
  if (input.reviewText.toLowerCase().includes("pipeline verification")) {
    throw new Error("Placeholder review text cannot be imported.");
  }
}

async function removePipelinePlaceholders(displayName: string): Promise<number> {
  const target = normalizeName(displayName);
  const reviews = await listReviews();
  let removed = 0;

  for (const review of reviews) {
    const isPipeline =
      review.matchMetadata?.pipelineTest === true ||
      review.reviewText.toLowerCase().includes("pipeline verification");
    if (!isPipeline) {
      continue;
    }
    if (normalizeName(review.reviewerDisplayName) !== target) {
      continue;
    }
    await deleteReviewById(review.id);
    removed += 1;
  }

  return removed;
}

export async function ingestManualGoogleReview(
  input: ManualGoogleReviewInput,
): Promise<ManualGoogleReviewResult> {
  validateManualReviewInput(input);

  const googleReviewId = input.googleReviewId?.trim() || null;
  if (googleReviewId) {
    const existing = await getReviewByGoogleId(googleReviewId);
    if (existing) {
      throw new Error("A review with this Google review ID already exists.");
    }
  }

  const removedPipelinePlaceholders = input.replacePipelinePlaceholder
    ? await removePipelinePlaceholders(input.reviewerDisplayName)
    : 0;

  const googleReview: GoogleReview = {
    reviewId: googleReviewId ?? `manual-${createReviewId()}`,
    reviewerDisplayName: input.reviewerDisplayName.trim(),
    rating: input.rating,
    comment: input.reviewText.trim(),
    createTime: new Date(input.reviewCreatedAt).toISOString(),
    updateTime: null,
  };

  const match = await runReviewMatching(googleReview);
  const topCandidate = match.candidates[0] ?? null;
  const now = new Date().toISOString();

  const review: ReviewRecord = {
    id: createReviewId(),
    googleReviewId,
    reviewerDisplayName: googleReview.reviewerDisplayName,
    publicReviewerName: toPublicReviewerName(googleReview.reviewerDisplayName),
    rating: googleReview.rating,
    reviewText: googleReview.comment,
    reviewCreatedAt: googleReview.createTime,
    ghlContactId: topCandidate?.ghlContactId ?? null,
    matchStatus: resolveImportedReviewStatus(match),
    matchConfidence: match.bestScore,
    publicCity: topCandidate?.city ?? null,
    publicState: topCandidate?.state ?? null,
    publicLat: null,
    publicLng: null,
    matchMetadata: {
      manualImport: true,
      reviewSource: input.reviewSource?.trim() || "manual_google_verification",
      autoMatchLocked: false,
      batchImport: input.batchImport ?? false,
      discoveryDiagnostics: match.diagnostics,
    },
    approvedAt: null,
    rejectedAt: null,
    isSeed: false,
    createdAt: now,
    updatedAt: now,
  };

  await upsertReview(review);
  await replaceCandidates(review.id, match.candidates);

  return {
    review,
    matchStatus: review.matchStatus,
    candidateCount: match.candidates.length,
    removedPipelinePlaceholders,
    bestScore: match.bestScore,
  };
}
