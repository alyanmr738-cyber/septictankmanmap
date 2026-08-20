export type GeocodedLocation = {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  precision?: "street" | "postal" | "city";
};

export type GeocodeQuery = {
  city?: string;
  state?: string;
  postalCode?: string;
  addressLine?: string;
};

export interface GeocodingProvider {
  geocode(query: GeocodeQuery): Promise<GeocodedLocation | null>;
}
