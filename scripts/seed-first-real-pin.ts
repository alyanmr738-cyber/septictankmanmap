import { randomUUID } from "crypto";
import { getGhlConfig } from "@/lib/env";
import { GHL_API_BASE, getGhlHeaders } from "@/lib/integrations/ghl/client";
import {
  contactDisplayName,
  inspectServiceAddress,
  isExactNameMatch,
} from "@/lib/integrations/ghl/inspectContactAddress";
import { NominatimGeocodingProvider } from "@/lib/integrations/geocoding/providers/nominatim";
import { anonymizeCoordinates } from "@/lib/privacy/anonymizeCoordinates";
import {
  createGeocodePrivacyReport,
  formatGeocodePrivacyLog,
} from "@/lib/privacy/geocodePrivacyReport";
import { toPublicReviewerName } from "@/lib/privacy/publicReviewerName";
import type { GhlSearchContactsResponse } from "@/lib/integrations/ghl/types";
import type { ReviewRecord } from "@/lib/types";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

const CUSTOMER_NAME = "John Drier";

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function searchContacts(body: Record<string, unknown>, token: string) {
  const response = await fetch(`${GHL_API_BASE}/contacts/search`, {
    method: "POST",
    headers: getGhlHeaders(token),
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`GHL search failed (${response.status})`);
  }
  return (await response.json()) as GhlSearchContactsResponse;
}

async function getContact(contactId: string, token: string) {
  const response = await fetch(`${GHL_API_BASE}/contacts/${encodeURIComponent(contactId)}`, {
    method: "GET",
    headers: getGhlHeaders(token),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`GHL get contact failed (${response.status})`);
  }
  return (await response.json()) as { contact?: Record<string, unknown> };
}

async function findExactContact(name: string, token: string, locationId: string) {
  const queryResult = await searchContacts({ locationId, pageLimit: 25, query: name }, token);
  let contacts = (queryResult.contacts ?? []) as Record<string, unknown>[];
  let exact = contacts.filter((contact) => isExactNameMatch(contact, name));

  if (exact.length === 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      const filterResult = await searchContacts(
        {
          locationId,
          pageLimit: 25,
          filters: [
            {
              group: "AND",
              filters: [
                { field: "firstName", operator: "eq", value: parts[0] },
                { field: "lastName", operator: "eq", value: parts.slice(1).join(" ") },
              ],
            },
          ],
        },
        token,
      );
      contacts = (filterResult.contacts ?? []) as Record<string, unknown>[];
      exact = contacts.filter((contact) => isExactNameMatch(contact, name));
    }
  }

  if (exact.length !== 1) {
    throw new Error(
      exact.length === 0
        ? `No exact match found for ${name}`
        : `Ambiguous match for ${name} (${exact.length} candidates)`,
    );
  }

  const contactId = String(exact[0].id ?? "");
  const full = await getContact(contactId, token);
  return { contactId, contact: full.contact ?? exact[0] };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set.");
  }

  const ghl = getGhlConfig();
  if (!ghl) {
    throw new Error("GHL credentials must be set.");
  }

  const { contactId, contact } = await findExactContact(CUSTOMER_NAME, ghl.token, ghl.locationId);
  const address = inspectServiceAddress(contact);
  if (!address.addressFound || !address.city || !address.state) {
    throw new Error("Matched contact does not have a usable address for geocoding.");
  }

  const geocoder = new NominatimGeocodingProvider();
  const geocodeAttempts: Array<{ precision: "street" | "postal" | "city"; query: Parameters<NominatimGeocodingProvider["geocode"]>[0] }> = [
    {
      precision: "street",
      query: {
        addressLine: readString(contact.address1) || readString(contact.address),
        city: address.city,
        state: address.state,
        postalCode: readString(contact.postalCode),
      },
    },
    {
      precision: "postal",
      query: {
        city: address.city,
        state: address.state,
        postalCode: readString(contact.postalCode),
      },
    },
    {
      precision: "city",
      query: {
        city: address.city,
        state: address.state,
      },
    },
  ];

  let geocoded: Awaited<ReturnType<NominatimGeocodingProvider["geocode"]>> = null;
  let geocodePrecision: "street" | "postal" | "city" | null = null;
  for (const attempt of geocodeAttempts) {
    geocoded = await geocoder.geocode(attempt.query);
    if (geocoded) {
      geocodePrecision = attempt.precision;
      break;
    }
  }

  if (!geocoded || !geocodePrecision) {
    throw new Error("Geocoding returned no result for any fallback strategy.");
  }

  const reviewId = randomUUID();
  const approximate = anonymizeCoordinates(geocoded.lat, geocoded.lng, reviewId);
  const privacyReport = createGeocodePrivacyReport({
    geocoded: { ...geocoded, precision: geocodePrecision },
    approximate,
    publicCity: geocoded.city ?? address.city ?? "",
    publicState: geocoded.state ?? address.state ?? "FL",
  });
  const now = new Date().toISOString();

  const review: ReviewRecord = {
    id: reviewId,
    googleReviewId: null,
    reviewerDisplayName: contactDisplayName(contact) || CUSTOMER_NAME,
    publicReviewerName: toPublicReviewerName(contactDisplayName(contact) || CUSTOMER_NAME),
    rating: 5,
    reviewText:
      "Pipeline verification record - replace with verified Google review text before public launch.",
    reviewCreatedAt: now,
    ghlContactId: contactId,
    matchStatus: "approved",
    matchConfidence: 100,
    publicCity: geocoded.city ?? address.city,
    publicState: geocoded.state ?? address.state,
    publicLat: approximate.lat,
    publicLng: approximate.lng,
    matchMetadata: {
      pipelineTest: true,
      selectedGhlContactId: contactId,
      autoMatchLocked: true,
      geocodingProvider: "nominatim",
      geocodePrecision,
      addressSource: address.addressSource,
    },
    approvedAt: now,
    rejectedAt: null,
    isSeed: false,
    createdAt: now,
    updatedAt: now,
  };

  const { upsertReview } = await import("@/lib/database/reviews");
  await upsertReview(review);

  const { getPublicMapData } = await import("@/lib/database/public-map");
  const mapData = await getPublicMapData();
  const published = mapData.locations.find((location) => location.id === reviewId);

  process.stdout.write(
    JSON.stringify(
      {
        ok: true,
        customer: CUSTOMER_NAME,
        addressSource: address.addressSource,
        publicCity: review.publicCity,
        publicState: review.publicState,
        hasStreetLine: address.hasStreetLine,
        geocodingProvider: "nominatim",
        geocodePrecision,
        privacy: formatGeocodePrivacyLog(privacyReport),
        publicPin: {
          lat: approximate.lat,
          lng: approximate.lng,
        },
        reviewId,
        publicReviewerName: review.publicReviewerName,
        mapPublished: Boolean(published),
        totalApprovedPinsOnMap: mapData.reviewCount,
        note:
          "Pipeline verification only. Geocoder result is not treated as a confirmed residence. Import a real Google review through /admin and approve through the normal workflow.",
      },
      null,
      2,
    ) + "\n",
  );
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "unknown error";
  process.stderr.write(message + "\n");
  process.exit(1);
});
