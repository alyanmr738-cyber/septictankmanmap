import type { PublicReviewLocation, ReviewRecord } from "@/lib/types";

const PUBLIC_KEYS = [
  "id",
  "lat",
  "lng",
  "city",
  "state",
  "rating",
  "reviewer",
  "review",
  "reviewDate",
] as const;

const FORBIDDEN_PUBLIC_KEYS = [
  "email",
  "phone",
  "address",
  "street",
  "ghlContactId",
  "ghl_contact_id",
  "googleReviewId",
  "matchMetadata",
  "exactLat",
  "exactLng",
  "address1",
  "postalCode",
];

export function toPublicReviewLocation(record: ReviewRecord): PublicReviewLocation | null {
  if (
    record.matchStatus !== "approved" ||
    record.publicLat == null ||
    record.publicLng == null ||
    !record.publicReviewerName
  ) {
    return null;
  }

  return {
    id: record.id,
    lat: record.publicLat,
    lng: record.publicLng,
    city: record.publicCity ?? "",
    state: record.publicState ?? "FL",
    rating: record.rating,
    reviewer: record.publicReviewerName,
    review: record.reviewText,
    reviewDate: record.reviewCreatedAt ? record.reviewCreatedAt.slice(0, 10) : "",
  };
}

export function sanitizePublicLocations(records: ReviewRecord[]): PublicReviewLocation[] {
  return records
    .map((record) => toPublicReviewLocation(record))
    .filter((location): location is PublicReviewLocation => location !== null);
}

export function assertPublicLocationSafe(location: PublicReviewLocation): PublicReviewLocation {
  const safe: PublicReviewLocation = {
    id: location.id,
    lat: location.lat,
    lng: location.lng,
    city: location.city,
    state: location.state,
    rating: location.rating,
    reviewer: location.reviewer,
    review: location.review,
    reviewDate: location.reviewDate,
  };

  for (const key of Object.keys(location)) {
    if (!PUBLIC_KEYS.includes(key as (typeof PUBLIC_KEYS)[number])) {
      throw new Error(`Refusing to publish unexpected map field: ${key}`);
    }
  }

  return safe;
}

export function jsonContainsForbiddenPublicFields(payload: unknown): string[] {
  const found = new Set<string>();

  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (value && typeof value === "object") {
      for (const [key, nested] of Object.entries(value)) {
        if (FORBIDDEN_PUBLIC_KEYS.some((forbidden) => key.toLowerCase() === forbidden.toLowerCase())) {
          found.add(key);
        }
        visit(nested);
      }
    }
  };

  visit(payload);
  return [...found];
}
