export const MATCH_STATUSES = [
  "pending",
  "matched",
  "needs_review",
  "approved",
  "rejected",
  "unmatched",
] as const;

export type MatchStatus = (typeof MATCH_STATUSES)[number];

export type GoogleStarRating =
  | "STAR_RATING_UNSPECIFIED"
  | "ONE"
  | "TWO"
  | "THREE"
  | "FOUR"
  | "FIVE";

export type GoogleReview = {
  reviewId: string;
  reviewerDisplayName: string;
  rating: number;
  comment: string;
  createTime: string | null;
  updateTime: string | null;
};

export type GhlContact = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  address1?: string;
  lastActivity?: string | null;
  dateAdded?: string | null;
};

export type CustomerActivitySignals = {
  lastCustomerActivity?: string | null;
  serviceCompletedAt?: string | null;
  reviewRequestAt?: string | null;
};

export type GhlContactCandidate = {
  ghlContactId: string;
  displayName: string;
  city?: string;
  state?: string;
  hasAddress: boolean;
  lastCustomerActivity?: string | null;
  serviceCompletedAt?: string | null;
  reviewRequestAt?: string | null;
};

export type MatchReason = {
  code: string;
  label: string;
  points: number;
};

export type MatchResult = {
  score: number;
  confidence: "high" | "review" | "low";
  reasons: MatchReason[];
};

export type MatchCandidate = GhlContactCandidate & {
  score: number;
  confidence: MatchResult["confidence"];
  reasons: MatchReason[];
};

export type MatchMetadata = {
  selectedGhlContactId?: string | null;
  autoMatchLocked?: boolean;
  notes?: string;
};

export type ReviewRecord = {
  id: string;
  googleReviewId: string | null;
  reviewerDisplayName: string;
  publicReviewerName: string;
  rating: number;
  reviewText: string;
  reviewCreatedAt: string | null;
  ghlContactId: string | null;
  matchStatus: MatchStatus;
  matchConfidence: number | null;
  publicCity: string | null;
  publicState: string | null;
  publicLat: number | null;
  publicLng: number | null;
  matchMetadata: MatchMetadata | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  isSeed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReviewMatchCandidateRecord = {
  id: string;
  reviewId: string;
  ghlContactId: string;
  score: number;
  matchReasons: MatchReason[];
  lastCustomerActivity: string | null;
  serviceCompletedAt: string | null;
  reviewRequestAt: string | null;
  displayName: string;
  publicCity: string | null;
  publicState: string | null;
  hasAddress: boolean;
  createdAt: string;
};

export type PublicReviewLocation = {
  id: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  rating: number;
  reviewer: string;
  review: string;
  reviewDate: string;
};

export type PublicMapResponse = {
  locations: PublicReviewLocation[];
  reviewCount: number;
  averageRating: number | null;
};

export type AdminReviewCard = {
  id: string;
  googleReviewId: string | null;
  reviewerDisplayName: string;
  publicReviewerName: string;
  rating: number;
  reviewText: string;
  reviewCreatedAt: string | null;
  matchStatus: MatchStatus;
  matchConfidence: number | null;
  publicCity: string | null;
  publicState: string | null;
  isSeed: boolean;
  approvedAt: string | null;
  rejectedAt: string | null;
  selectedCandidateId: string | null;
  candidates: MatchCandidate[];
};
