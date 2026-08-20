import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  anonymizeCoordinates,
  coordinatesAreEqual,
} from "@/lib/privacy/anonymizeCoordinates";

describe("anonymizeCoordinates", () => {
  const bradenton = { lat: 27.4989, lng: -82.5748 };

  it("returns a stable result for the same record id", () => {
    const first = anonymizeCoordinates(bradenton.lat, bradenton.lng, "review-123");
    const second = anonymizeCoordinates(bradenton.lat, bradenton.lng, "review-123");
    assert.deepEqual(first, second);
  });

  it("does not publish the exact coordinates", () => {
    const approximate = anonymizeCoordinates(bradenton.lat, bradenton.lng, "review-123");
    assert.equal(coordinatesAreEqual(approximate, bradenton), false);
  });

  it("keeps the pin in the same general area", () => {
    const approximate = anonymizeCoordinates(bradenton.lat, bradenton.lng, "review-123");
    assert.ok(Math.abs(approximate.lat - bradenton.lat) < 0.03);
    assert.ok(Math.abs(approximate.lng - bradenton.lng) < 0.03);
  });

  it("varies pins by record id so neighbors do not stack exactly", () => {
    const a = anonymizeCoordinates(bradenton.lat, bradenton.lng, "review-a");
    const b = anonymizeCoordinates(bradenton.lat, bradenton.lng, "review-b");
    assert.notDeepEqual(a, b);
  });
});
