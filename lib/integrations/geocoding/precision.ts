export type GeocodePrecision =
  | "rooftop"
  | "street"
  | "interpolated"
  | "postal"
  | "city"
  | "region"
  | "unknown";

export const GEOCODE_PRECISION_LABELS: Record<GeocodePrecision, string> = {
  rooftop: "Rooftop-level geocode",
  street: "Street-level geocode",
  interpolated: "Interpolated street geocode",
  postal: "Postal-level geocode",
  city: "City-centroid geocode",
  region: "Regional geocode",
  unknown: "Unknown geocode precision",
};

export function mapGoogleLocationType(value: string | undefined): GeocodePrecision {
  switch (value) {
    case "ROOFTOP":
      return "rooftop";
    case "RANGE_INTERPOLATED":
      return "interpolated";
    case "GEOMETRIC_CENTER":
      return "street";
    case "APPROXIMATE":
      return "postal";
    default:
      return "unknown";
  }
}

export function mapNominatimPrecision(input: {
  addresstype?: string;
  category?: string;
  type?: string;
  hasStreetLine?: boolean;
}): GeocodePrecision {
  const addresstype = input.addresstype?.toLowerCase() ?? "";
  if (["house", "building", "residential", "address"].includes(addresstype)) {
    return "rooftop";
  }
  if (["road", "street", "pedestrian", "highway"].includes(addresstype)) {
    return "street";
  }
  if (["postcode", "postal_code"].includes(addresstype)) {
    return "postal";
  }
  if (["city", "town", "village", "hamlet", "suburb"].includes(addresstype)) {
    return "city";
  }
  if (["county", "state", "region"].includes(addresstype)) {
    return "region";
  }
  if (input.hasStreetLine) {
    return "street";
  }
  return "unknown";
}
