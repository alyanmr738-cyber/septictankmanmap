import type { GeocodeQuery, GeocodedLocation, GeocodingProvider } from "@/lib/integrations/geocoding/types";
import { logger } from "@/lib/logger";

function formatQuery(query: GeocodeQuery): string {
  const state = query.state === "FL" ? "Florida" : query.state;
  return [query.addressLine, query.city, state, query.postalCode, "USA"].filter(Boolean).join(", ");
}

export class NominatimGeocodingProvider implements GeocodingProvider {
  async geocode(query: GeocodeQuery): Promise<GeocodedLocation | null> {
    const address = formatQuery(query);
    if (!address) {
      return null;
    }

    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", address);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    url.searchParams.set("addressdetails", "1");

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "SepticTankManReviewMap/1.0 (contact: septictankmanstaff@gmail.com)",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      logger.error("Nominatim geocoding request failed", { status: response.status });
      return null;
    }

    const data = (await response.json()) as Array<{
      lat: string;
      lon: string;
      address?: { city?: string; town?: string; village?: string; state?: string };
    }>;

    const result = data[0];
    if (!result) {
      return null;
    }

    return {
      lat: Number(result.lat),
      lng: Number(result.lon),
      city: result.address?.city ?? result.address?.town ?? result.address?.village,
      state: result.address?.state === "Florida" ? "FL" : result.address?.state,
    };
  }
}
