import { lookupCityCentroid } from "@/lib/integrations/geocoding/cityCentroids";
import type { GeocodeQuery, GeocodedLocation, GeocodingProvider } from "@/lib/integrations/geocoding/types";

export class MockGeocodingProvider implements GeocodingProvider {
  async geocode(query: GeocodeQuery): Promise<GeocodedLocation | null> {
    const match = lookupCityCentroid(query.city);
    if (!match) {
      return null;
    }
    return {
      lat: match.lat,
      lng: match.lng,
      city: match.city,
      state: match.state,
      precision: "city",
    };
  }
}
