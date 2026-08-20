import { normalizeName } from "@/lib/matching/normalizeName";
import { listReviews } from "@/lib/database/reviews";
import {
  publishLaunchReview,
  type LaunchReviewInput,
} from "@/lib/reviews/publishLaunchReview";
import type { ParsedReviewCsvRow } from "@/lib/reviews/parseReviewCsv";
import type { LocationSource } from "@/lib/types";

export type LaunchBatchOptions = {
  minRating?: number;
  tryGhlEnrichment?: boolean;
  skipDuplicates?: boolean;
};

export type LaunchBatchRowResult = {
  lineNumber: number;
  reviewerDisplayName: string;
  status: "published" | "skipped" | "failed";
  locationSource?: LocationSource;
  reviewId?: string;
  message?: string;
};

export type LaunchBatchResult = {
  totalRows: number;
  published: number;
  skipped: number;
  failed: number;
  ghlVerified: number;
  serviceAreaEstimate: number;
  rows: LaunchBatchRowResult[];
};

function reviewDayKey(name: string, reviewCreatedAt: string): string {
  const day = new Date(reviewCreatedAt).toISOString().slice(0, 10);
  return `${normalizeName(name)}|${day}`;
}

async function buildDuplicateKeys(): Promise<Set<string>> {
  const reviews = await listReviews();
  const keys = new Set<string>();
  for (const review of reviews) {
    if (!review.reviewCreatedAt || review.matchStatus !== "approved") continue;
    keys.add(reviewDayKey(review.reviewerDisplayName, review.reviewCreatedAt));
  }
  return keys;
}

export async function ingestLaunchReviewBatch(
  rows: ParsedReviewCsvRow[],
  options: LaunchBatchOptions = {},
): Promise<LaunchBatchResult> {
  const minRating = options.minRating ?? 4;
  const tryGhlEnrichment = options.tryGhlEnrichment ?? false;
  const skipDuplicates = options.skipDuplicates ?? true;
  const duplicateKeys = skipDuplicates ? await buildDuplicateKeys() : new Set<string>();

  const result: LaunchBatchResult = {
    totalRows: rows.length,
    published: 0,
    skipped: 0,
    failed: 0,
    ghlVerified: 0,
    serviceAreaEstimate: 0,
    rows: [],
  };

  for (const row of rows) {
    if (row.rating < minRating) {
      result.skipped += 1;
      result.rows.push({
        lineNumber: row.lineNumber,
        reviewerDisplayName: row.reviewerDisplayName,
        status: "skipped",
        message: `Rating ${row.rating} is below launch minimum (${minRating}).`,
      });
      continue;
    }

    const duplicateKey = reviewDayKey(row.reviewerDisplayName, row.reviewCreatedAt);
    if (skipDuplicates && duplicateKeys.has(duplicateKey)) {
      result.skipped += 1;
      result.rows.push({
        lineNumber: row.lineNumber,
        reviewerDisplayName: row.reviewerDisplayName,
        status: "skipped",
        message: "Already published for this reviewer and date.",
      });
      continue;
    }

    const input: LaunchReviewInput = {
      reviewerDisplayName: row.reviewerDisplayName,
      rating: row.rating,
      reviewText: row.reviewText,
      reviewCreatedAt: row.reviewCreatedAt,
      googleReviewId: row.googleReviewId,
      minRating,
      tryGhlEnrichment,
    };

    try {
      const published = await publishLaunchReview(input);
      duplicateKeys.add(duplicateKey);
      result.published += 1;
      if (published.locationSource === "ghl_verified") {
        result.ghlVerified += 1;
      } else {
        result.serviceAreaEstimate += 1;
      }
      result.rows.push({
        lineNumber: row.lineNumber,
        reviewerDisplayName: row.reviewerDisplayName,
        status: "published",
        locationSource: published.locationSource,
        reviewId: published.review.id,
      });
    } catch (error) {
      result.failed += 1;
      result.rows.push({
        lineNumber: row.lineNumber,
        reviewerDisplayName: row.reviewerDisplayName,
        status: "failed",
        message: error instanceof Error ? error.message : "Launch publish failed",
      });
    }
  }

  return result;
}
