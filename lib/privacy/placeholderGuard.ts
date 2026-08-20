import { isMockMode } from "@/lib/env";
import type { ReviewRecord } from "@/lib/types";

const PLACEHOLDER_MARKERS = [
  "pipeline verification",
  "replace with verified google review text",
] as const;

export function isPipelinePlaceholderReview(record: Pick<ReviewRecord, "reviewText" | "matchMetadata">): boolean {
  if (record.matchMetadata?.pipelineTest === true) {
    return true;
  }
  const text = record.reviewText.toLowerCase();
  return PLACEHOLDER_MARKERS.some((marker) => text.includes(marker));
}

export function assertReviewPublishable(record: ReviewRecord): void {
  if (isMockMode()) {
    return;
  }
  if (record.isSeed) {
    return;
  }
  if (isPipelinePlaceholderReview(record)) {
    throw new Error("Pipeline placeholder reviews cannot be published when MOCK_MODE=false");
  }
}
