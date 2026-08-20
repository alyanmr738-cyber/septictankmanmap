import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { scoreMatch } from "@/lib/matching/scoreMatch";
import { findCandidates } from "@/lib/matching/findCandidates";

describe("scoreMatch", () => {
  it("scores a unique exact name with recent service highly", () => {
    const result = scoreMatch({
      googleDisplayName: "John Smith",
      reviewCreatedAt: "2026-08-17T20:17:00.000Z",
      candidateName: "John Smith",
      candidateCountWithSameName: 1,
      hasValidAddress: true,
      signals: {
        serviceCompletedAt: "2026-08-14T15:00:00.000Z",
        reviewRequestAt: "2026-08-16T18:43:00.000Z",
      },
    });

    assert.ok(result.score >= 90);
    assert.equal(result.confidence, "high");
    assert.ok(result.reasons.some((reason) => reason.code === "exact_name"));
    assert.ok(result.reasons.some((reason) => reason.code === "unique_name"));
  });

  it("penalizes duplicate identical names", () => {
    const result = scoreMatch({
      googleDisplayName: "Mike Johnson",
      reviewCreatedAt: "2026-08-11T16:04:00.000Z",
      candidateName: "Mike Johnson",
      candidateCountWithSameName: 3,
      hasValidAddress: true,
    });

    assert.ok(result.reasons.some((reason) => reason.code === "duplicate_name"));
    assert.ok(result.score < 90);
  });

  it("does not treat a first-name-only reviewer as a high-confidence match", () => {
    const result = scoreMatch({
      googleDisplayName: "David",
      candidateName: "David Nguyen",
      candidateCountWithSameName: 8,
      hasValidAddress: true,
    });

    assert.ok(result.score < 70);
    assert.ok(result.reasons.some((reason) => reason.code === "first_name_only"));
  });

  it("scores first name and last initial below exact full name but above first name only", () => {
    const exact = scoreMatch({
      googleDisplayName: "John Smith",
      candidateName: "John Smith",
      candidateCountWithSameName: 1,
      hasValidAddress: true,
    });
    const firstInitial = scoreMatch({
      googleDisplayName: "Timothy H.",
      candidateName: "Timothy Harrison",
      candidateCountWithSameName: 1,
      candidateCountWithSameAbbreviatedPattern: 1,
      hasValidAddress: true,
    });
    const firstOnly = scoreMatch({
      googleDisplayName: "David",
      candidateName: "David Nguyen",
      candidateCountWithSameName: 8,
      hasValidAddress: true,
    });

    assert.ok(exact.score > firstInitial.score);
    assert.ok(firstInitial.score > firstOnly.score);
    assert.ok(firstInitial.reasons.some((reason) => reason.code === "first_initial_name"));
  });
});

describe("findCandidates", () => {
  it("marks ambiguous identical names as needs_review instead of picking the first record", () => {
    const result = findCandidates({
      review: {
        reviewerDisplayName: "Mike Johnson",
        createTime: "2026-08-11T16:04:00.000Z",
      },
      contacts: [
        { id: "1", firstName: "Mike", lastName: "Johnson", name: "Mike Johnson", city: "Bradenton", address1: "x" },
        { id: "2", firstName: "Mike", lastName: "Johnson", name: "Mike Johnson", city: "Sarasota", address1: "x" },
        { id: "3", firstName: "Michael", lastName: "Johnson", name: "Michael Johnson", city: "Venice", address1: "x" },
      ],
    });

    assert.equal(result.status, "needs_review");
    assert.equal(result.candidates.length, 3);
  });

  it("leaves a first-name-only reviewer in needs_review when weak candidates exist", () => {
    const result = findCandidates({
      review: { reviewerDisplayName: "David", createTime: "2026-08-09T13:22:00.000Z" },
      contacts: [
        { id: "1", name: "David Nguyen", city: "Sarasota" },
        { id: "2", name: "David Patel", city: "Port Charlotte" },
      ],
    });

    assert.equal(result.status, "needs_review");
    assert.ok((result.bestScore ?? 0) < 70);
  });

  it("routes ambiguous first-name-and-initial matches to needs_review", () => {
    const result = findCandidates({
      review: {
        reviewerDisplayName: "Timothy H.",
        createTime: "2026-08-11T16:04:00.000Z",
      },
      contacts: [
        { id: "1", firstName: "Timothy", lastName: "Harris", name: "Timothy Harris", city: "Sarasota", address1: "x" },
        { id: "2", firstName: "Timothy", lastName: "Hill", name: "Timothy Hill", city: "Venice", address1: "x" },
        { id: "3", firstName: "Timothy", lastName: "Hernandez", name: "Timothy Hernandez", city: "Bradenton", address1: "x" },
      ],
    });

    assert.equal(result.status, "needs_review");
    assert.equal(result.candidates.length, 3);
  });

  it("matches a unique first-name-and-initial reviewer", () => {
    const result = findCandidates({
      review: {
        reviewerDisplayName: "Timothy H.",
        createTime: "2026-08-11T16:04:00.000Z",
      },
      contacts: [
        { id: "1", firstName: "Timothy", lastName: "Harrison", name: "Timothy Harrison", city: "Sarasota", address1: "x" },
        { id: "2", firstName: "Tom", lastName: "Hardy", name: "Tom Hardy", city: "Venice", address1: "x" },
      ],
      signalsByContactId: {
        "1": {
          reviewRequestAt: "2026-08-10T12:00:00.000Z",
        },
      },
    });

    assert.equal(result.status, "matched");
    assert.equal(result.candidates[0]?.displayName, "Timothy Harrison");
    assert.ok((result.bestScore ?? 0) >= 90);
  });
});
