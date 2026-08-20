import { getReviewById, listCandidates, listReviews } from "@/lib/database/reviews";
import type { AdminReviewCard, MatchStatus } from "@/lib/types";

const PENDING_STATUSES: MatchStatus[] = ["pending", "matched"];

export async function getAdminReviewCards(status: string | null): Promise<AdminReviewCard[]> {
  const reviews =
    !status || status === "pending"
      ? (await listReviews()).filter((review) => PENDING_STATUSES.includes(review.matchStatus))
      : await listReviews(status as MatchStatus);

  const cards: AdminReviewCard[] = [];
  for (const review of reviews) {
    const candidates = await listCandidates(review.id);
    cards.push({
      id: review.id,
      googleReviewId: review.googleReviewId,
      reviewerDisplayName: review.reviewerDisplayName,
      publicReviewerName: review.publicReviewerName,
      rating: review.rating,
      reviewText: review.reviewText,
      reviewCreatedAt: review.reviewCreatedAt,
      matchStatus: review.matchStatus,
      matchConfidence: review.matchConfidence,
      publicCity: review.publicCity,
      publicState: review.publicState,
      isSeed: review.isSeed,
      approvedAt: review.approvedAt,
      rejectedAt: review.rejectedAt,
      selectedCandidateId: review.ghlContactId,
      candidates,
    });
  }
  return cards;
}

export async function getAdminReviewCard(id: string): Promise<AdminReviewCard | null> {
  const review = await getReviewById(id);
  if (!review) return null;
  const candidates = await listCandidates(review.id);
  return {
    id: review.id,
    googleReviewId: review.googleReviewId,
    reviewerDisplayName: review.reviewerDisplayName,
    publicReviewerName: review.publicReviewerName,
    rating: review.rating,
    reviewText: review.reviewText,
    reviewCreatedAt: review.reviewCreatedAt,
    matchStatus: review.matchStatus,
    matchConfidence: review.matchConfidence,
    publicCity: review.publicCity,
    publicState: review.publicState,
    isSeed: review.isSeed,
    approvedAt: review.approvedAt,
    rejectedAt: review.rejectedAt,
    selectedCandidateId: review.ghlContactId,
    candidates,
  };
}
