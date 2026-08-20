export type GoogleBusinessReview = {
  reviewId?: string;
  reviewer?: {
    displayName?: string;
    profilePhotoUrl?: string;
    isAnonymous?: boolean;
  };
  starRating?: "STAR_RATING_UNSPECIFIED" | "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  comment?: string;
  createTime?: string;
  updateTime?: string;
};

export type GoogleListReviewsResponse = {
  reviews?: GoogleBusinessReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
};
