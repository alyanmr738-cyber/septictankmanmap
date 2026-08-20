import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertReviewPublishable,
  isPipelinePlaceholderReview,
} from "@/lib/privacy/placeholderGuard";
import { toPublicReviewLocation } from "@/lib/privacy/sanitizePublicReview";
import type { ReviewRecord } from "@/lib/types";
import { resolveImportedReviewStatus } from "@/lib/reviews/runReviewMatching";

describe("manual review workflow", () => {
  it("enters pending for a single high-confidence candidate", () => {
    assert.equal(resolveImportedReviewStatus({ status: "matched" }), "pending");
  });

  it("enters needs_review for ambiguous candidates", () => {
    assert.equal(resolveImportedReviewStatus({ status: "needs_review" }), "needs_review");
  });

  it("blocks pipeline placeholder publication when mock mode is off", () => {
    const previous = process.env.MOCK_MODE;
    process.env.MOCK_MODE = "false";

    const review: ReviewRecord = {
      id: "review-1",
      googleReviewId: null,
      reviewerDisplayName: "John Drier",
      publicReviewerName: "John D.",
      rating: 5,
      reviewText: "Pipeline verification record - replace with verified Google review text before public launch.",
      reviewCreatedAt: "2026-08-01T00:00:00.000Z",
      ghlContactId: "ghl-1",
      matchStatus: "approved",
      matchConfidence: 96,
      publicCity: "Sarasota",
      publicState: "FL",
      publicLat: 27.1,
      publicLng: -82.4,
      matchMetadata: { pipelineTest: true },
      approvedAt: "2026-08-02T00:00:00.000Z",
      rejectedAt: null,
      isSeed: false,
      createdAt: "2026-08-01T00:00:00.000Z",
      updatedAt: "2026-08-02T00:00:00.000Z",
    };

    assert.equal(isPipelinePlaceholderReview(review), true);
    assert.throws(() => assertReviewPublishable(review));
    assert.equal(toPublicReviewLocation(review), null);

    process.env.MOCK_MODE = previous;
  });
});
