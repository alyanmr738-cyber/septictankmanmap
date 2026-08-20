import { findCandidates } from "@/lib/matching/findCandidates";
import { normalizeName } from "@/lib/matching/normalizeName";
import { searchContacts } from "@/lib/integrations/ghl/searchContacts";
import { getCustomerActivitySignals } from "@/lib/integrations/ghl/activitySignals";
import { toPublicReviewerName } from "@/lib/privacy/publicReviewerName";
import {
  createReviewId,
  deleteReviewById,
  getReviewByGoogleId,
  listReviews,
  replaceCandidates,
  upsertReview,
} from "@/lib/database/reviews";
import type { GoogleReview, MatchStatus, ReviewRecord } from "@/lib/types";

export type ManualGoogleReviewInput = {
  reviewerDisplayName: string;
  rating: number;
  reviewText: string;
  reviewCreatedAt: string;
  googleReviewId?: string | null;
  replacePipelinePlaceholder?: boolean;
};

export type ManualGoogleReviewResult = {
  review: ReviewRecord;
  matchStatus: MatchStatus;
  candidateCount: number;
  removedPipelinePlaceholders: number;
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

  const contacts = await searchContacts(googleReview.reviewerDisplayName);
  const signalsByContactId: Record<string, Awaited<ReturnType<typeof getCustomerActivitySignals>>> = {};
  for (const contact of contacts) {
    signalsByContactId[contact.id] = await getCustomerActivitySignals(contact.id);
  }

  const match = findCandidates({
    review: googleReview,
    contacts,
    signalsByContactId,
  });

  const now = new Date().toISOString();
  const review: ReviewRecord = {
    id: createReviewId(),
    googleReviewId,
    reviewerDisplayName: googleReview.reviewerDisplayName,
    publicReviewerName: toPublicReviewerName(googleReview.reviewerDisplayName),
    rating: googleReview.rating,
    reviewText: googleReview.comment,
    reviewCreatedAt: googleReview.createTime,
    ghlContactId: match.candidates[0]?.ghlContactId ?? null,
    matchStatus: match.status === "matched" ? "matched" : match.status,
    matchConfidence: match.bestScore,
    publicCity: match.candidates[0]?.city ?? null,
    publicState: match.candidates[0]?.state ?? null,
    publicLat: null,
    publicLng: null,
    matchMetadata: {
      manualImport: true,
      autoMatchLocked: false,
    },
    approvedAt: null,
    rejectedAt: null,
    isSeed: false,
    createdAt: now,
    updatedAt: now,
  };

  if (match.status === "matched" && match.candidates[0]) {
    review.ghlContactId = match.candidates[0].ghlContactId;
  }

  await upsertReview(review);
  await replaceCandidates(review.id, match.candidates);

  return {
    review,
    matchStatus: review.matchStatus,
    candidateCount: match.candidates.length,
    removedPipelinePlaceholders,
  };
}
