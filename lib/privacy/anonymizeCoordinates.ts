export type Coordinates = {
  lat: number;
  lng: number;
};

const GRID_KM = 1.6;
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

/**
 * Converts exact geocoded coordinates into a stable, privacy-safe
 * approximate location. The same record id always maps to the same pin.
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

  const latGrid = GRID_KM / KM_PER_DEGREE_LAT;
  const lngGrid = GRID_KM / (KM_PER_DEGREE_LAT * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));

  const snappedLat = Math.round(lat / latGrid) * latGrid;
  const snappedLng = Math.round(lng / lngGrid) * lngGrid;

  const hash = hashString(stableId);
  const jitterLat = ((hash % 1000) / 1000 - 0.5) * latGrid * 0.55;
  const jitterLng = ((((hash / 1000) >>> 0) % 1000) / 1000 - 0.5) * lngGrid * 0.55;

  let publicLat = snappedLat + jitterLat;
  let publicLng = snappedLng + jitterLng;

  if (publicLat === lat && publicLng === lng) {
    publicLat += latGrid * 0.18;
    publicLng += lngGrid * 0.12;
  }

  return {
    lat: round6(clampLatitude(publicLat)),
    lng: round6(wrapLongitude(publicLng)),
  };
}

export function coordinatesAreEqual(a: Coordinates, b: Coordinates, epsilon = 1e-7): boolean {
  return Math.abs(a.lat - b.lat) < epsilon && Math.abs(a.lng - b.lng) < epsilon;
}
