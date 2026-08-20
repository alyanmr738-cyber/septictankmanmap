import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toPublicReviewerName } from "@/lib/privacy/publicReviewerName";

describe("toPublicReviewerName", () => {
  it("abbreviates a standard first and last name", () => {
    assert.equal(toPublicReviewerName("John Smith"), "John S.");
    assert.equal(toPublicReviewerName("Maria Gonzalez"), "Maria G.");
  });

  it("keeps a single given name", () => {
    assert.equal(toPublicReviewerName("David"), "David");
  });

  it("uses a generic label for anonymous Google reviewers", () => {
    assert.equal(toPublicReviewerName("A Google User"), "Google Reviewer");
    assert.equal(toPublicReviewerName(""), "Google Reviewer");
    assert.equal(toPublicReviewerName(null), "Google Reviewer");
  });

  it("ignores generational suffixes when choosing the last initial", () => {
    assert.equal(toPublicReviewerName("John Smith Jr"), "John S.");
  });
});
