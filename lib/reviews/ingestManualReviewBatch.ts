import { normalizeName } from "@/lib/matching/normalizeName";
import { listReviews } from "@/lib/database/reviews";
import {
  ingestManualGoogleReview,
  type ManualGoogleReviewInput,
} from "@/lib/reviews/ingestManualReview";
import type { ParsedReviewCsvRow } from "@/lib/reviews/parseReviewCsv";
import type { MatchStatus } from "@/lib/types";

export type BatchImportOptions = {
  replacePipelinePlaceholder?: boolean;
  skipDuplicates?: boolean;
};

export type BatchImportRowResult = {
  lineNumber: number;
  reviewerDisplayName: string;
  status: "imported" | "skipped" | "failed";
  matchStatus?: MatchStatus;
  matchConfidence?: number | null;
  candidateCount?: number;
  reviewId?: string;
  message?: string;
};

export type BatchImportResult = {
  totalRows: number;
  imported: number;
  skipped: number;
  failed: number;
  queueCounts: Record<MatchStatus, number>;
  rows: BatchImportRowResult[];
};

function reviewDayKey(name: string, reviewCreatedAt: string): string {
  const day = new Date(reviewCreatedAt).toISOString().slice(0, 10);
  return `${normalizeName(name)}|${day}`;
}

async function buildDuplicateKeys(): Promise<Set<string>> {
  const reviews = await listReviews();
  const keys = new Set<string>();
  for (const review of reviews) {
    if (!review.reviewCreatedAt) {
      continue;
    }
    keys.add(reviewDayKey(review.reviewerDisplayName, review.reviewCreatedAt));
  }
  return keys;
}

export async function ingestManualGoogleReviewBatch(
  rows: ParsedReviewCsvRow[],
  options: BatchImportOptions = {},
): Promise<BatchImportResult> {
  const replacePipelinePlaceholder = options.replacePipelinePlaceholder ?? false;
  const skipDuplicates = options.skipDuplicates ?? true;
  const duplicateKeys = skipDuplicates ? await buildDuplicateKeys() : new Set<string>();

  const result: BatchImportResult = {
    totalRows: rows.length,
    imported: 0,
    skipped: 0,
    failed: 0,
    queueCounts: {
      pending: 0,
      needs_review: 0,
      unmatched: 0,
      matched: 0,
      approved: 0,
      rejected: 0,
    },
    rows: [],
  };

  for (const row of rows) {
    const duplicateKey = reviewDayKey(row.reviewerDisplayName, row.reviewCreatedAt);
    if (skipDuplicates && duplicateKeys.has(duplicateKey)) {
      result.skipped += 1;
      result.rows.push({
        lineNumber: row.lineNumber,
        reviewerDisplayName: row.reviewerDisplayName,
        status: "skipped",
        message: "Already imported for this reviewer and date.",
      });
      continue;
    }

    const input: ManualGoogleReviewInput = {
      reviewerDisplayName: row.reviewerDisplayName,
      rating: row.rating,
      reviewText: row.reviewText,
      reviewCreatedAt: row.reviewCreatedAt,
      googleReviewId: row.googleReviewId,
      replacePipelinePlaceholder,
      reviewSource: row.reviewSource,
      batchImport: true,
    };

    try {
      const imported = await ingestManualGoogleReview(input);

      duplicateKeys.add(duplicateKey);
      result.imported += 1;
      result.queueCounts[imported.matchStatus] += 1;
      result.rows.push({
        lineNumber: row.lineNumber,
        reviewerDisplayName: row.reviewerDisplayName,
        status: "imported",
        matchStatus: imported.matchStatus,
        matchConfidence: imported.bestScore,
        candidateCount: imported.candidateCount,
        reviewId: imported.review.id,
      });
    } catch (error) {
      result.failed += 1;
      result.rows.push({
        lineNumber: row.lineNumber,
        reviewerDisplayName: row.reviewerDisplayName,
        status: "failed",
        message: error instanceof Error ? error.message : "Import failed",
      });
    }
  }

  return result;
}
