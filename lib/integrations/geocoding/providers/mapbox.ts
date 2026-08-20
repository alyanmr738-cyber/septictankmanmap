import type { GeocodeQuery, GeocodedLocation, GeocodingProvider } from "@/lib/integrations/geocoding/types";
import { logger } from "@/lib/logger";

function formatQuery(query: GeocodeQuery): string {
  return [query.addressLine, query.city, query.state, query.postalCode].filter(Boolean).join(", ");
}

export class MapboxGeocodingProvider implements GeocodingProvider {
  constructor(private readonly apiKey: string) {}

  async geocode(query: GeocodeQuery): Promise<GeocodedLocation | null> {
    const address = formatQuery(query);
    if (!address) {
      return null;
    }

    const url = new URL(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
    );
    url.searchParams.set("access_token", this.apiKey);
    url.searchParams.set("limit", "1");
    url.searchParams.set("country", "US");

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      logger.error("Mapbox geocoding request failed", { status: response.status });
      return null;
    }

    const data = (await response.json()) as {
      features?: Array<{
        center?: [number, number];
        context?: Array<{ id: string; text: string; short_code?: string }>;
        text?: string;
      }>;
    };

    const feature = data.features?.[0];
    if (!feature?.center) {
      return null;
    }

    const region = feature.context?.find((item) => item.id.startsWith("region"));
    const place = feature.context?.find((item) => item.id.startsWith("place"));

    return {
      lng: feature.center[0],
      lat: feature.center[1],
      city: place?.text ?? feature.text,
      state: region?.short_code?.replace(/^us-/, "").toUpperCase() ?? region?.text,
    };
  }
}
