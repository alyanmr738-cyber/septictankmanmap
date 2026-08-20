import type { GeocodedLocation } from "@/lib/integrations/geocoding/types";
import type { Coordinates } from "@/lib/privacy/anonymizeCoordinates";

export type GeocodePrecision = NonNullable<GeocodedLocation["precision"]>;

const MINIMUM_DISPLACEMENT_METERS: Record<GeocodePrecision, number> = {
  street: 1000,
  postal: 800,
  city: 1500,
};

const RESULT_LABELS: Record<GeocodePrecision, string> = {
  street: "street-level geocode",
  postal: "postal-area geocode",
  city: "city-centroid geocode",
};

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6_371_000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type GeocodePrivacyReport = {
  geocoderPrecision: GeocodePrecision;
  geocoderResultLabel: string;
  displacementMeters: number;
  minimumDisplacementMeters: number;
  meetsMinimumDisplacement: boolean;
  publicCity: string;
  publicState: string;
};

export function createGeocodePrivacyReport(input: {
  geocoded: GeocodedLocation;
  approximate: Coordinates;
  publicCity: string;
  publicState: string;
}): GeocodePrivacyReport {
  const precision = input.geocoded.precision ?? "city";
  const displacementMeters = Math.round(
    haversineMeters(
      input.geocoded.lat,
      input.geocoded.lng,
      input.approximate.lat,
      input.approximate.lng,
    ),
  );
  const minimumDisplacementMeters = MINIMUM_DISPLACEMENT_METERS[precision];

  return {
    geocoderPrecision: precision,
    geocoderResultLabel: RESULT_LABELS[precision],
    displacementMeters,
    minimumDisplacementMeters,
    meetsMinimumDisplacement: displacementMeters >= minimumDisplacementMeters,
    publicCity: input.publicCity,
    publicState: input.publicState,
  };
}

export function formatGeocodePrivacyLog(report: GeocodePrivacyReport): Record<string, unknown> {
  return {
    geocoderPrecision: report.geocoderPrecision,
    geocoderResultLabel: report.geocoderResultLabel,
    displacementMeters: report.displacementMeters,
    minimumDisplacementMeters: report.minimumDisplacementMeters,
    meetsMinimumDisplacement: report.meetsMinimumDisplacement,
    publicCity: report.publicCity,
    publicState: report.publicState,
  };
}
