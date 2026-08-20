import { SEED_CANDIDATES, SEED_REVIEWS } from "@/lib/seed/reviews";
import type { MatchCandidate, MatchStatus, ReviewMatchCandidateRecord, ReviewRecord } from "@/lib/types";

function cloneReview(review: ReviewRecord): ReviewRecord {
  return {
    ...review,
    matchMetadata: review.matchMetadata ? { ...review.matchMetadata } : null,
  };
}

function cloneCandidate(candidate: ReviewMatchCandidateRecord): ReviewMatchCandidateRecord {
  return {
    ...candidate,
    matchReasons: candidate.matchReasons.map((reason) => ({ ...reason })),
  };
}

const reviews = new Map<string, ReviewRecord>(SEED_REVIEWS.map((review) => [review.id, cloneReview(review)]));
const candidates = new Map<string, ReviewMatchCandidateRecord[]>(
  SEED_REVIEWS.map((review) => [
    review.id,
    SEED_CANDIDATES.filter((candidate) => candidate.reviewId === review.id).map(cloneCandidate),
  ]),
);

export const memoryStore = {
  listReviews(status?: MatchStatus): ReviewRecord[] {
    const all = [...reviews.values()].map(cloneReview);
    const filtered = status ? all.filter((review) => review.matchStatus === status) : all;
    return filtered.sort((a, b) => (b.reviewCreatedAt ?? "").localeCompare(a.reviewCreatedAt ?? ""));
  },
  getReview(id: string): ReviewRecord | null {
    const review = reviews.get(id);
    return review ? cloneReview(review) : null;
  },
  getReviewByGoogleId(googleReviewId: string): ReviewRecord | null {
    const review = [...reviews.values()].find((item) => item.googleReviewId === googleReviewId);
    return review ? cloneReview(review) : null;
  },
  upsertReview(review: ReviewRecord): ReviewRecord {
    reviews.set(review.id, cloneReview(review));
    if (!candidates.has(review.id)) {
      candidates.set(review.id, []);
    }
    return cloneReview(review);
  },
  listCandidates(reviewId: string): ReviewMatchCandidateRecord[] {
    return (candidates.get(reviewId) ?? []).map(cloneCandidate);
  },
  replaceCandidates(reviewId: string, next: ReviewMatchCandidateRecord[]) {
    candidates.set(reviewId, next.map(cloneCandidate));
  },
  toMatchCandidates(reviewId: string): MatchCandidate[] {
    return this.listCandidates(reviewId).map((candidate) => ({
      ghlContactId: candidate.ghlContactId,
      displayName: candidate.displayName,
      city: candidate.publicCity ?? undefined,
      state: candidate.publicState ?? undefined,
      hasAddress: candidate.hasAddress,
      lastCustomerActivity: candidate.lastCustomerActivity,
      serviceCompletedAt: candidate.serviceCompletedAt,
      reviewRequestAt: candidate.reviewRequestAt,
      score: candidate.score,
      confidence: candidate.score >= 90 ? "high" : candidate.score >= 70 ? "review" : "low",
      reasons: candidate.matchReasons,
    }));
  },
  deleteReview(id: string) {
    candidates.delete(id);
    reviews.delete(id);
  },
};
