import type { GeocodePrecision } from "@/lib/integrations/geocoding/precision";
import { getGeocodingConfig } from "@/lib/env";
import { GoogleGeocodingProvider } from "@/lib/integrations/geocoding/providers/google";
import { MapboxGeocodingProvider } from "@/lib/integrations/geocoding/providers/mapbox";
import { MockGeocodingProvider } from "@/lib/integrations/geocoding/providers/mock";
import { NominatimGeocodingProvider } from "@/lib/integrations/geocoding/providers/nominatim";
import type { GeocodeQuery, GeocodedLocation, GeocodingProvider } from "@/lib/integrations/geocoding/types";
import { logger } from "@/lib/logger";

let cachedProvider: GeocodingProvider | null = null;

export function getGeocodingProvider(): GeocodingProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const config = getGeocodingConfig();
  if (config.provider === "google") {
    if (!config.apiKey) {
      throw new Error("GEOCODING_API_KEY is required for the Google geocoding provider");
    }
    cachedProvider = new GoogleGeocodingProvider(config.apiKey);
  } else if (config.provider === "mapbox") {
    if (!config.apiKey) {
      throw new Error("GEOCODING_API_KEY is required for the Mapbox geocoding provider");
    }
    cachedProvider = new MapboxGeocodingProvider(config.apiKey);
  } else if (config.provider === "nominatim") {
    cachedProvider = new NominatimGeocodingProvider();
  } else {
    cachedProvider = new MockGeocodingProvider();
  }

  return cachedProvider;
}

export async function geocodeCustomerLocation(query: GeocodeQuery): Promise<GeocodedLocation | null> {
  const provider = getGeocodingProvider();
  const attempts: Array<{ fallbackPrecision: GeocodePrecision; query: GeocodeQuery }> = [
    { fallbackPrecision: "street", query },
    {
      fallbackPrecision: "postal",
      query: { city: query.city, state: query.state, postalCode: query.postalCode },
    },
    { fallbackPrecision: "city", query: { city: query.city, state: query.state } },
  ];

  for (const attempt of attempts) {
    const hasInput = Object.values(attempt.query).some(Boolean);
    if (!hasInput) {
      continue;
    }
    try {
      const result = await provider.geocode(attempt.query);
      if (result) {
        return {
          ...result,
          precision:
            result.precision && result.precision !== "unknown"
              ? result.precision
              : attempt.fallbackPrecision,
        };
      }
    } catch (error) {
      logger.error("Geocoding attempt failed", {
        provider: getGeocodingConfig().provider,
        precision: attempt.fallbackPrecision,
        error: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  return null;
}
