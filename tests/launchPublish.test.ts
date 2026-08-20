import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { publishLaunchReview } from "@/lib/reviews/publishLaunchReview";
import { ingestLaunchReviewBatch } from "@/lib/reviews/ingestLaunchReviewBatch";
import { listReviews } from "@/lib/database/reviews";
import type { ParsedReviewCsvRow } from "@/lib/reviews/parseReviewCsv";

describe("launch publish pipeline", () => {
  it("rejects reviews below the launch rating threshold", async () => {
    await assert.rejects(
      () =>
        publishLaunchReview({
          reviewerDisplayName: "Test User",
          rating: 3,
          reviewText: "Okay service",
          reviewCreatedAt: "2026-01-01",
        }),
      /Only reviews rated 4 stars or higher/,
    );
  });

  it("publishes approved reviews with service area estimate locations", async () => {
    const result = await publishLaunchReview({
      reviewerDisplayName: "Launch Tester",
      rating: 5,
      reviewText: "Excellent septic service in our area.",
      reviewCreatedAt: "2026-08-01",
    });

    assert.equal(result.review.matchStatus, "approved");
    assert.equal(result.locationSource, "service_area_estimate");
    assert.equal(result.review.matchMetadata?.locationSource, "service_area_estimate");
    assert.equal(result.review.matchMetadata?.launchPublish, true);
    assert.ok(result.review.publicCity);
    assert.ok(result.review.publicLat);
    assert.ok(result.review.publicLng);
    assert.equal(result.review.ghlContactId, null);
  });

  it("batch import publishes 4★ and 5★ rows without GHL matching", async () => {
    const beforeCount = (await listReviews()).length;
    const rows: ParsedReviewCsvRow[] = [
      {
        lineNumber: 2,
        reviewerDisplayName: "Batch Launch A",
        rating: 5,
        reviewText: "Five star launch review.",
        reviewCreatedAt: "2026-07-01",
        reviewSource: "google_manual",
        googleReviewId: null,
      },
      {
        lineNumber: 3,
        reviewerDisplayName: "Batch Launch B",
        rating: 4,
        reviewText: "Four star launch review.",
        reviewCreatedAt: "2026-06-01",
        reviewSource: "google_manual",
        googleReviewId: null,
      },
      {
        lineNumber: 4,
        reviewerDisplayName: "Batch Launch C",
        rating: 3,
        reviewText: "Should be skipped.",
        reviewCreatedAt: "2026-05-01",
        reviewSource: "google_manual",
        googleReviewId: null,
      },
    ];

    const result = await ingestLaunchReviewBatch(rows, { minRating: 4, skipDuplicates: false });
    const afterCount = (await listReviews()).length;

    assert.equal(result.published, 2);
    assert.equal(result.skipped, 1);
    assert.equal(result.failed, 0);
    assert.equal(result.serviceAreaEstimate, 2);
    assert.equal(afterCount - beforeCount, 2);
  });
});
