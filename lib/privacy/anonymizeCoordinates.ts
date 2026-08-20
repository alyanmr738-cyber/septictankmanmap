export type Coordinates = {
  lat: number;
  lng: number;
};

const KM_PER_DEGREE_LAT = 111.32;

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function clampLatitude(lat: number): number {
  return Math.max(-90, Math.min(90, lat));
}

function wrapLongitude(lng: number): number {
  const wrapped = ((((lng + 180) % 360) + 360) % 360) - 180;
  return wrapped;
}

function round6(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

const DEFAULT_MIN_OFFSET_METERS = 250;
const DEFAULT_MAX_OFFSET_METERS = 300;

export function getPublicLocationMinOffsetMeters(): number {
  const raw = process.env.PUBLIC_LOCATION_MIN_OFFSET_METERS;
  const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_MIN_OFFSET_METERS;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MIN_OFFSET_METERS;
}

export function getPublicLocationMaxOffsetMeters(): number {
  const raw = process.env.PUBLIC_LOCATION_MAX_OFFSET_METERS;
  const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_MAX_OFFSET_METERS;
  const max = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_OFFSET_METERS;
  return Math.max(max, getPublicLocationMinOffsetMeters());
}

export function displacementMeters(
  from: Coordinates,
  to: Coordinates,
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6_371_000;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Converts private geocoded coordinates into a stable, privacy-safe public point.
 * Uses a deterministic bearing/distance derived from the stable review id.
 */
export function anonymizeCoordinates(
  lat: number,
  lng: number,
  stableId: string,
): Coordinates {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Invalid coordinates");
  }
  if (!stableId) {
    throw new Error("A stable record identifier is required for privacy transformation");
  }

  const minOffset = getPublicLocationMinOffsetMeters();
  const maxOffset = getPublicLocationMaxOffsetMeters();
  const hash = hashString(stableId);
  const distanceHash = hashString(`${stableId}:distance`);
  const distanceMeters =
    minOffset + ((distanceHash % 10_000) / 10_000) * (maxOffset - minOffset);
  const bearingRadians = ((hash % 360) * Math.PI) / 180;
  const latRadians = (lat * Math.PI) / 180;
  const metersPerDegreeLat = KM_PER_DEGREE_LAT * 1000;
  const metersPerDegreeLng =
    metersPerDegreeLat * Math.max(0.2, Math.cos(latRadians));

  const deltaLat = (distanceMeters * Math.cos(bearingRadians)) / metersPerDegreeLat;
  const deltaLng = (distanceMeters * Math.sin(bearingRadians)) / metersPerDegreeLng;

  return {
    lat: round6(clampLatitude(lat + deltaLat)),
    lng: round6(wrapLongitude(lng + deltaLng)),
  };
}

export function coordinatesAreEqual(a: Coordinates, b: Coordinates, epsilon = 1e-7): boolean {
  return Math.abs(a.lat - b.lat) < epsilon && Math.abs(a.lng - b.lng) < epsilon;
}
