import type { GeocodeQuery, GeocodedLocation, GeocodingProvider } from "@/lib/integrations/geocoding/types";
import { logger } from "@/lib/logger";

function formatQuery(query: GeocodeQuery): string {
  return [query.addressLine, query.city, query.state, query.postalCode].filter(Boolean).join(", ");
}

export class GoogleGeocodingProvider implements GeocodingProvider {
  constructor(private readonly apiKey: string) {}

  async geocode(query: GeocodeQuery): Promise<GeocodedLocation | null> {
    const address = formatQuery(query);
    if (!address) {
      return null;
    }

    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.set("address", address);
    url.searchParams.set("key", this.apiKey);

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      logger.error("Google geocoding request failed", { status: response.status });
      return null;
    }

    const data = (await response.json()) as {
      status: string;
      results?: Array<{
        geometry?: { location?: { lat: number; lng: number } };
        address_components?: Array<{ long_name: string; short_name: string; types: string[] }>;
      }>;
    };

    if (data.status !== "OK" || !data.results?.[0]?.geometry?.location) {
      logger.warn("Google geocoding returned no result", { status: data.status });
      return null;
    }

    const result = data.results[0];
    const cityComponent = result.address_components?.find((component) =>
      component.types.includes("locality"),
    );
    const stateComponent = result.address_components?.find((component) =>
      component.types.includes("administrative_area_level_1"),
    );

    return {
      lat: result.geometry!.location!.lat,
      lng: result.geometry!.location!.lng,
      city: cityComponent?.long_name,
      state: stateComponent?.short_name,
    };
  }
}
