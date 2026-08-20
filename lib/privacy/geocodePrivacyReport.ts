import type { GeocodePrecision } from "@/lib/integrations/geocoding/precision";
import { GEOCODE_PRECISION_LABELS } from "@/lib/integrations/geocoding/precision";
import type { GeocodedLocation } from "@/lib/integrations/geocoding/types";
import {
  anonymizeCoordinates,
  displacementMeters,
  getPublicLocationMinOffsetMeters,
  type Coordinates,
} from "@/lib/privacy/anonymizeCoordinates";

export type GeocodePrivacyReport = {
  geocoderPrecision: GeocodePrecision;
  geocoderResultLabel: string;
  displacementMeters: number;
  minimumDisplacementMeters: number;
  meetsMinimumDisplacement: boolean;
  publicCity: string;
  publicState: string;
  publicPointStored: boolean;
  privatePointStored: boolean;
};

export function createGeocodePrivacyReport(input: {
  geocoded: GeocodedLocation;
  approximate: Coordinates;
  publicCity: string;
  publicState: string;
  publicPointStored?: boolean;
}): GeocodePrivacyReport {
  const precision = input.geocoded.precision ?? "unknown";
  const displacement = Math.round(
    displacementMeters(
      { lat: input.geocoded.lat, lng: input.geocoded.lng },
      input.approximate,
    ),
  );
  const minimumDisplacementMeters = getPublicLocationMinOffsetMeters();

  return {
    geocoderPrecision: precision,
    geocoderResultLabel: GEOCODE_PRECISION_LABELS[precision],
    displacementMeters: displacement,
    minimumDisplacementMeters,
    meetsMinimumDisplacement: displacement >= minimumDisplacementMeters,
    publicCity: input.publicCity,
    publicState: input.publicState,
    publicPointStored: input.publicPointStored ?? true,
    privatePointStored: false,
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
    publicPointStored: report.publicPointStored,
    privatePointStored: report.privatePointStored,
  };
}
