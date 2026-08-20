import { getGhlConfig } from "@/lib/env";
import { contactHasIdentity, extractContactNameVariants } from "@/lib/integrations/ghl/contactIdentity";
import { mapGhlApiContact } from "@/lib/integrations/ghl/mapContact";
import { ghlFetch } from "@/lib/integrations/ghl/client";
import type { GhlSearchContactsResponse } from "@/lib/integrations/ghl/types";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

type QualityBucket =
  | "first_and_last_name"
  | "first_name_only"
  | "last_name_only"
  | "display_name_only"
  | "company_name_only"
  | "custom_name_field"
  | "email_only"
  | "phone_only"
  | "address_only"
  | "no_identity";

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function classifyContact(contact: ReturnType<typeof mapGhlApiContact>): QualityBucket {
  const first = readString(contact.firstName);
  const last = readString(contact.lastName);
  const name = readString(contact.name);
  const company = readString(contact.companyName);
  const email = readString(contact.email);
  const phone = readString(contact.phone);
  const hasAddress = Boolean(readString(contact.address1) || readString(contact.city));
  const variants = extractContactNameVariants(contact);

  if (first && last) return "first_and_last_name";
  if (first) return "first_name_only";
  if (last) return "last_name_only";
  if (name) return "display_name_only";
  if (company) return "company_name_only";
  if (variants.some((variant) => variant.source.startsWith("custom field"))) return "custom_name_field";
  if (email && !contactHasIdentity(contact)) return "email_only";
  if (phone && !contactHasIdentity(contact)) return "phone_only";
  if (hasAddress) return "address_only";
  return "no_identity";
}

async function fetchAllContacts(locationId: string) {
  const merged = [];
  for (let page = 1; page <= 10; page += 1) {
    const data = await ghlFetch<GhlSearchContactsResponse>("/contacts/search", {
      method: "POST",
      body: JSON.stringify({ locationId, page, pageLimit: 100 }),
    });
    const batch = (data.contacts ?? []).map(mapGhlApiContact);
    merged.push(...batch);
    if (batch.length < 100) break;
  }
  return merged;
}

async function main() {
  const config = getGhlConfig();
  if (!config) {
    throw new Error("GHL_PRIVATE_INTEGRATION_TOKEN and GHL_LOCATION_ID must be set.");
  }

  const contacts = await fetchAllContacts(config.locationId);
  const counts = Object.fromEntries(
    [
      "first_and_last_name",
      "first_name_only",
      "last_name_only",
      "display_name_only",
      "company_name_only",
      "custom_name_field",
      "email_only",
      "phone_only",
      "address_only",
      "no_identity",
    ].map((key) => [key, 0]),
  ) as Record<QualityBucket, number>;

  for (const contact of contacts) {
    counts[classifyContact(contact)] += 1;
  }

  const searchable =
    counts.first_and_last_name +
    counts.first_name_only +
    counts.last_name_only +
    counts.display_name_only +
    counts.company_name_only +
    counts.custom_name_field;

  process.stdout.write(
    JSON.stringify(
      {
        ok: true,
        totalContacts: contacts.length,
        searchableIdentity: searchable,
        searchablePercent: contacts.length
          ? Math.round((searchable / contacts.length) * 100)
          : 0,
        buckets: counts,
        samples: {
          fullName: contacts
            .filter((contact) => classifyContact(contact) === "first_and_last_name")
            .slice(0, 5)
            .map((contact) => [contact.firstName, contact.lastName].filter(Boolean).join(" ")),
          firstNameOnly: contacts
            .filter((contact) => classifyContact(contact) === "first_name_only")
            .slice(0, 5)
            .map((contact) => contact.firstName),
          addressOnly: contacts
            .filter((contact) => classifyContact(contact) === "address_only")
            .slice(0, 5)
            .map((contact) => `${contact.city ?? "no city"}, ${contact.state ?? "?"}`),
        },
      },
      null,
      2,
    ) + "\n",
  );
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : "unknown error"}\n`);
  process.exit(1);
});
