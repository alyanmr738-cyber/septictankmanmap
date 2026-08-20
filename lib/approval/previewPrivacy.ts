import { getContact } from "@/lib/integrations/ghl/getContact";
import { geocodeCustomerLocation } from "@/lib/integrations/geocoding/client";
import { anonymizeCoordinates } from "@/lib/privacy/anonymizeCoordinates";
import {
  createGeocodePrivacyReport,
  formatGeocodePrivacyLog,
} from "@/lib/privacy/geocodePrivacyReport";

export async function previewPrivacyTransformation(input: {
  reviewId: string;
  ghlContactId: string;
}) {
  const contact = await getContact(input.ghlContactId);
  if (!contact) {
    throw new Error("Matched customer could not be loaded");
  }

  const city = contact.city?.trim();
  const state = contact.state?.trim() || "FL";
  if (!city) {
    throw new Error("Matched customer does not have a usable city for mapping");
  }

  const geocoded = await geocodeCustomerLocation({
    city,
    state,
    postalCode: contact.postalCode,
    addressLine: contact.address1,
  });

  if (!geocoded) {
    throw new Error("Unable to geocode the matched customer location");
  }

  const approximate = anonymizeCoordinates(geocoded.lat, geocoded.lng, input.reviewId);
  const report = createGeocodePrivacyReport({
    geocoded,
    approximate,
    publicCity: geocoded.city ?? city,
    publicState: geocoded.state ?? state,
    publicPointStored: false,
  });

  return formatGeocodePrivacyLog(report);
}
