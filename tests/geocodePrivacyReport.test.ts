import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createGeocodePrivacyReport,
  formatGeocodePrivacyLog,
} from "@/lib/privacy/geocodePrivacyReport";

describe("geocodePrivacyReport", () => {
  it("labels postal geocodes accurately and omits exact coordinates from logs", () => {
    process.env.PUBLIC_LOCATION_MIN_OFFSET_METERS = "250";
    const report = createGeocodePrivacyReport({
      geocoded: { lat: 27.1813609, lng: -82.3609195, precision: "postal" },
      approximate: { lat: 27.179817, lng: -82.357955 },
      publicCity: "Sarasota",
      publicState: "FL",
    });

    assert.equal(report.geocoderResultLabel, "Postal-level geocode");
    assert.equal(report.geocoderPrecision, "postal");
    assert.equal(report.privatePointStored, false);
    assert.equal(report.minimumDisplacementMeters, 250);

    const log = formatGeocodePrivacyLog(report);
    assert.equal(log.geocoderResultLabel, "Postal-level geocode");
    assert.equal("lat" in log, false);
    assert.equal("lng" in log, false);
    delete process.env.PUBLIC_LOCATION_MIN_OFFSET_METERS;
  });
});
