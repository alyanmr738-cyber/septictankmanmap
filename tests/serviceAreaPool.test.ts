import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SEPTIC_TANK_MAN_SERVICE_AREAS,
  assignServiceAreaPin,
  pickServiceAreaForReview,
} from "@/lib/serviceAreas/pool";

describe("service area pool", () => {
  it("uses configured southwest Florida coverage areas", () => {
    const cities = SEPTIC_TANK_MAN_SERVICE_AREAS.map((area) => area.city);
    assert.deepEqual(cities, [
      "Sarasota",
      "Bradenton",
      "Port Charlotte",
      "Venice",
      "North Port",
      "Punta Gorda",
    ]);
  });

  it("assigns reviews deterministically to a service area", () => {
    const first = pickServiceAreaForReview("review-abc");
    const second = pickServiceAreaForReview("review-abc");
    assert.equal(first.id, second.id);
  });

  it("offsets pins within the anonymized radius", () => {
    const pin = assignServiceAreaPin("review-xyz");
    assert.notEqual(pin.lat, pin.area.lat);
    assert.notEqual(pin.lng, pin.area.lng);
    assert.equal(pin.city, pin.area.city);
    assert.equal(pin.state, pin.area.state);
  });
});
