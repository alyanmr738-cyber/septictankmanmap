import { listApprovedReviews } from "@/lib/database/reviews";
import { assertPublicLocationSafe, sanitizePublicLocations } from "@/lib/privacy/sanitizePublicReview";
import type { PublicMapResponse } from "@/lib/types";
import { hasDatabase, isMockMode, isProduction } from "@/lib/env";

export async function getPublicMapData(): Promise<PublicMapResponse> {
  if (!hasDatabase() && !isMockMode()) {
    if (isProduction()) {
      return { locations: [], reviewCount: 0, averageRating: null };
    }
  }

  const records = await listApprovedReviews();
  const locations = sanitizePublicLocations(records).map(assertPublicLocationSafe);
  const reviewCount = locations.length;
  const averageRating =
    reviewCount === 0
      ? null
      : Math.round((locations.reduce((sum, location) => sum + location.rating, 0) / reviewCount) * 10) / 10;

  return { locations, reviewCount, averageRating };
}
