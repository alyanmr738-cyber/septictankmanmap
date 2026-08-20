import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertPublicLocationSafe,
  jsonContainsForbiddenPublicFields,
  sanitizePublicLocations,
  toPublicReviewLocation,
} from "@/lib/privacy/sanitizePublicReview";
import type { ReviewRecord } from "@/lib/types";

const approved: ReviewRecord = {
  id: "abc123",
  googleReviewId: "google-1",
  reviewerDisplayName: "John Smith",
  publicReviewerName: "John S.",
  rating: 5,
  reviewText: "Excellent service.",
  reviewCreatedAt: "2026-08-17T20:17:00.000Z",
  ghlContactId: "ghl_private_id",
  matchStatus: "approved",
  matchConfidence: 96,
  publicCity: "Bradenton",
  publicState: "FL",
  publicLat: 27.49,
  publicLng: -82.57,
  matchMetadata: { selectedGhlContactId: "ghl_private_id" },
  approvedAt: "2026-08-20T00:00:00.000Z",
  rejectedAt: null,
  isSeed: true,
  createdAt: "2026-08-20T00:00:00.000Z",
  updatedAt: "2026-08-20T00:00:00.000Z",
};

describe("public API sanitization", () => {
  it("publishes only safe map fields", () => {
    const location = toPublicReviewLocation(approved);
    assert.deepEqual(location, {
      id: "abc123",
      lat: 27.49,
      lng: -82.57,
      city: "Bradenton",
      state: "FL",
      rating: 5,
      reviewer: "John S.",
      review: "Excellent service.",
      reviewDate: "2026-08-17",
    });
    assert.equal(Object.prototype.hasOwnProperty.call(location, "ghlContactId"), false);
    assert.equal(jsonContainsForbiddenPublicFields(location).length, 0);
  });

  it("does not publish pending reviews or private coordinates", () => {
    const unpublished = sanitizePublicLocations([
      { ...approved, matchStatus: "matched", publicLat: 27.4989, publicLng: -82.5748 },
    ]);
    assert.deepEqual(unpublished, []);
  });

  it("rejects unexpected keys before a payload can leak", () => {
    assert.throws(
      () =>
        assertPublicLocationSafe({
          id: "abc123",
          lat: 27.49,
          lng: -82.57,
          city: "Bradenton",
          state: "FL",
          rating: 5,
          reviewer: "John S.",
          review: "Excellent service.",
          reviewDate: "2026-08-17",
          ghlContactId: "should-not-appear",
        } as never),
      /unexpected map field/i,
    );
  });

  it("detects private CRM fields in a raw object", () => {
    assert.deepEqual(
      jsonContainsForbiddenPublicFields({
        locations: [{ id: "1", email: "hidden@example.com", phone: "9415550100" }],
      }),
      ["email", "phone"],
    );
  });
});
