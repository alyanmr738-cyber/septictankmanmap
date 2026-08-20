import { getGhlConfig } from "@/lib/env";
import { GHL_API_BASE, GHL_API_VERSION, getGhlHeaders } from "@/lib/integrations/ghl/client";
import {
  contactDisplayName,
  inspectServiceAddress,
  isExactNameMatch,
} from "@/lib/integrations/ghl/inspectContactAddress";
import type { GhlSearchContactsResponse } from "@/lib/integrations/ghl/types";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

type DiagnosticResult = {
  customer: string;
  searchResults: number;
  exactNameCandidates: number;
  status: string;
  addressFound?: boolean;
  addressSource?: string;
  city?: string | null;
  state?: string | null;
  hasStreetLine?: boolean;
  error?: string;
};

async function searchContacts(
  body: Record<string, unknown>,
  token: string,
): Promise<GhlSearchContactsResponse> {
  const response = await fetch(`${GHL_API_BASE}/contacts/search`, {
    method: "POST",
    headers: getGhlHeaders(token),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GHL search failed (${response.status}): ${text.slice(0, 180)}`);
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
    const text = await response.text();
    throw new Error(`GHL get contact failed (${response.status}): ${text.slice(0, 180)}`);
  }

  return (await response.json()) as { contact?: Record<string, unknown> };
}

function buildNameFilters(name: string): Record<string, unknown>[] {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return [
      {
        group: "AND",
        filters: [
          { field: "firstName", operator: "eq", value: parts[0] },
          { field: "lastName", operator: "eq", value: parts.slice(1).join(" ") },
        ],
      },
    ];
  }
  return [{ field: "lastName", operator: "eq", value: parts[0] }];
}

async function findCandidatesByName(
  customer: string,
  token: string,
  locationId: string,
): Promise<Record<string, unknown>[]> {
  const queryResult = await searchContacts(
    { locationId, pageLimit: 25, query: customer },
    token,
  );
  const queryContacts = (queryResult.contacts ?? []) as Record<string, unknown>[];
  if (queryContacts.length > 0) {
    return queryContacts;
  }

  const filterResult = await searchContacts(
    {
      locationId,
      pageLimit: 25,
      filters: buildNameFilters(customer),
    },
    token,
  );
  return (filterResult.contacts ?? []) as Record<string, unknown>[];
}

async function diagnoseCustomer(
  customer: string,
  token: string,
  locationId: string,
): Promise<DiagnosticResult> {
  try {
    const contacts = await findCandidatesByName(customer, token, locationId);
    const exactMatches = contacts.filter((contact) => isExactNameMatch(contact, customer));

    if (exactMatches.length === 0) {
      return {
        customer,
        searchResults: contacts.length,
        exactNameCandidates: 0,
        status: contacts.length > 0 ? "No exact-name match in search results" : "No matches",
      };
    }

    if (exactMatches.length > 1) {
      return {
        customer,
        searchResults: contacts.length,
        exactNameCandidates: exactMatches.length,
        status: "Ambiguous",
      };
    }

    const contactId = String(exactMatches[0].id ?? "");
    const full = await getContact(contactId, token);
    const contact = full.contact ?? exactMatches[0];
    const address = inspectServiceAddress(contact);

    return {
      customer,
      searchResults: contacts.length,
      exactNameCandidates: 1,
      status: "Matched",
      addressFound: address.addressFound,
      addressSource: address.addressSource,
      city: address.city ?? readCity(contact),
      state: address.state ?? readState(contact),
      hasStreetLine: address.hasStreetLine,
    };
  } catch (error) {
    return {
      customer,
      searchResults: 0,
      exactNameCandidates: 0,
      status: "Error",
      error: error instanceof Error ? error.message : "unknown",
    };
  }
}

function readCity(contact: Record<string, unknown>): string | null {
  return typeof contact.city === "string" && contact.city.trim() ? contact.city.trim() : null;
}

function readState(contact: Record<string, unknown>): string | null {
  return typeof contact.state === "string" && contact.state.trim() ? contact.state.trim() : null;
}

async function main() {
  const config = getGhlConfig();
  if (!config) {
    throw new Error("GHL_PRIVATE_INTEGRATION_TOKEN and GHL_LOCATION_ID must be set.");
  }

  const names = process.argv.slice(2);
  const customers = names.length > 0 ? names : ["John Smith", "Mike Johnson", "David"];

  const locationProbe = await searchContacts(
    { locationId: config.locationId, pageLimit: 1 },
    config.token,
  );

  const results: DiagnosticResult[] = [];
  for (const customer of customers) {
    results.push(await diagnoseCustomer(customer, config.token, config.locationId));
  }

  process.stdout.write(
    JSON.stringify(
      {
        ok: true,
        mode: "read-only",
        locationConfigured: true,
        apiVersion: GHL_API_VERSION,
        locationContactTotal: locationProbe.total ?? null,
        note:
          "Provide real customer names with npm run ghl:diagnostic -- \"First Last\" \"Another Name\"",
        customers: results,
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
