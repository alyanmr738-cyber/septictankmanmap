import { anonymizeCoordinates } from "@/lib/privacy/anonymizeCoordinates";

export type ServiceArea = {
  id: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
};

/** Approximate centers for Septic Tank Man service coverage — not customer homes. */
export const SEPTIC_TANK_MAN_SERVICE_AREAS: ServiceArea[] = [
  { id: "sarasota", city: "Sarasota", state: "FL", lat: 27.3364, lng: -82.5307 },
  { id: "bradenton", city: "Bradenton", state: "FL", lat: 27.4989, lng: -82.5748 },
  { id: "port-charlotte", city: "Port Charlotte", state: "FL", lat: 26.9762, lng: -82.0906 },
  { id: "venice", city: "Venice", state: "FL", lat: 27.0998, lng: -82.4543 },
  { id: "north-port", city: "North Port", state: "FL", lat: 27.0442, lng: -82.2359 },
  { id: "punta-gorda", city: "Punta Gorda", state: "FL", lat: 26.9298, lng: -82.0454 },
];

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function pickServiceAreaForReview(stableId: string): ServiceArea {
  const index = hashString(stableId) % SEPTIC_TANK_MAN_SERVICE_AREAS.length;
  return SEPTIC_TANK_MAN_SERVICE_AREAS[index]!;
}

export function assignServiceAreaPin(stableId: string, area?: ServiceArea) {
  const selected = area ?? pickServiceAreaForReview(stableId);
  const approximate = anonymizeCoordinates(selected.lat, selected.lng, stableId);
  return {
    area: selected,
    lat: approximate.lat,
    lng: approximate.lng,
    city: selected.city,
    state: selected.state,
  };
}
