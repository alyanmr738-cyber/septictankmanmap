import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createGeocodePrivacyReport,
  formatGeocodePrivacyLog,
} from "@/lib/privacy/geocodePrivacyReport";

describe("geocodePrivacyReport", () => {
  it("labels postal geocodes accurately and omits exact coordinates from logs", () => {
    const report = createGeocodePrivacyReport({
      geocoded: { lat: 27.1813609, lng: -82.3609195, precision: "postal" },
      approximate: { lat: 27.179817, lng: -82.357955 },
      publicCity: "Sarasota",
      publicState: "FL",
    });

    assert.equal(report.geocoderResultLabel, "postal-area geocode");
    assert.equal(report.geocoderPrecision, "postal");
    assert.equal(report.displacementMeters, 340);
    assert.equal(typeof report.meetsMinimumDisplacement, "boolean");

    const log = formatGeocodePrivacyLog(report);
    assert.equal(log.geocoderPrecision, "postal");
    assert.equal(log.publicCity, "Sarasota");
    assert.equal("lat" in log, false);
    assert.equal("lng" in log, false);
  });
});
