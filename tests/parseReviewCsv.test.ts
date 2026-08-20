import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseReviewCsv } from "@/lib/reviews/parseReviewCsv";

describe("parseReviewCsv", () => {
  it("parses a headered CSV with quoted review text", () => {
    const parsed = parseReviewCsv(`reviewer_name,rating,review_text,review_date,source
Monika Wooten,5,"I needed an inspection done, quickly.",2026-08-18,google_manual`);

    assert.equal(parsed.errors.length, 0);
    assert.equal(parsed.rows.length, 1);
    assert.equal(parsed.rows[0]?.reviewerDisplayName, "Monika Wooten");
    assert.equal(parsed.rows[0]?.rating, 5);
    assert.equal(parsed.rows[0]?.reviewSource, "google_manual");
  });

  it("reports row-level validation errors without stopping the file", () => {
    const parsed = parseReviewCsv(`reviewer_name,rating,review_text,review_date
John Smith,5,"Great service",2026-01-01
,5,"Missing name",2026-01-02`);

    assert.equal(parsed.rows.length, 1);
    assert.equal(parsed.errors.length, 1);
    assert.equal(parsed.errors[0]?.lineNumber, 3);
  });
});
