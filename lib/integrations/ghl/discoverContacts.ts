import { useMockGhlData } from "@/lib/env";
import { ghlFetch, requireGhlConfig } from "@/lib/integrations/ghl/client";
import { contactMatchesReviewerName } from "@/lib/integrations/ghl/contactIdentity";
import { mapGhlApiContact } from "@/lib/integrations/ghl/mapContact";
import { searchMockGhlContacts } from "@/lib/integrations/ghl/mockContacts";
import type { GhlSearchContactsResponse } from "@/lib/integrations/ghl/types";
import { isAbbreviatedLastInitial, splitPersonName } from "@/lib/matching/normalizeName";
import type { GhlContact } from "@/lib/types";
import { logger } from "@/lib/logger";

export type ContactDiscoveryResult = {
  contacts: GhlContact[];
  strategiesAttempted: Array<{ strategy: string; resultCount: number }>;
  messages: string[];
};

function dedupeContacts(contacts: GhlContact[]): GhlContact[] {
  const seen = new Set<string>();
  const unique: GhlContact[] = [];
  for (const contact of contacts) {
    if (seen.has(contact.id)) {
      continue;
    }
    seen.add(contact.id);
    unique.push(contact);
  }
  return unique;
}

async function searchRequest(
  config: NonNullable<ReturnType<typeof requireGhlConfig>>,
  body: Record<string, unknown>,
): Promise<GhlContact[]> {
  const data = await ghlFetch<GhlSearchContactsResponse>("/contacts/search", {
    method: "POST",
    body: JSON.stringify({ locationId: config.locationId, ...body }),
  });
  return (data.contacts ?? []).map(mapGhlApiContact);
}

function buildDiscoveryPlans(reviewerDisplayName: string): Array<{
  strategy: string;
  body: Record<string, unknown>;
}> {
  const trimmed = reviewerDisplayName.trim();
  const google = splitPersonName(trimmed);
  const plans: Array<{ strategy: string; body: Record<string, unknown> }> = [
    {
      strategy: "full_name_query",
      body: { page: 1, pageLimit: 25, query: trimmed },
    },
  ];

  if (google.first) {
    plans.push({
      strategy: "first_name_query",
      body: { page: 1, pageLimit: 25, query: google.first },
    });
    plans.push({
      strategy: "first_name_filter",
      body: {
        page: 1,
        pageLimit: 25,
        filters: [{ field: "firstName", operator: "eq", value: google.first }],
      },
    });
  }

  if (google.last && !isAbbreviatedLastInitial(google.last) && google.last.length >= 3) {
    plans.push({
      strategy: "last_name_query",
      body: { page: 1, pageLimit: 25, query: google.last },
    });
    plans.push({
      strategy: "last_name_filter",
      body: {
        page: 1,
        pageLimit: 25,
        filters: [{ field: "lastName", operator: "eq", value: google.last }],
      },
    });
  }

  if (google.first && google.last && !isAbbreviatedLastInitial(google.last)) {
    plans.push({
      strategy: "split_name_filter",
      body: {
        page: 1,
        pageLimit: 25,
        filters: [
          {
            group: "AND",
            filters: [
              { field: "firstName", operator: "eq", value: google.first },
              { field: "lastName", operator: "eq", value: google.last },
            ],
          },
        ],
      },
    });
  }

  return plans;
}

async function fetchAllLocationContacts(
  config: NonNullable<ReturnType<typeof requireGhlConfig>>,
): Promise<GhlContact[]> {
  const merged: GhlContact[] = [];
  const pageLimit = 100;

  for (let page = 1; page <= 10; page += 1) {
    const batch = await searchRequest(config, { page, pageLimit });
    merged.push(...batch);
    if (batch.length < pageLimit) {
      break;
    }
  }

  return dedupeContacts(merged);
}

function filterContactsForReviewer(
  contacts: GhlContact[],
  reviewerDisplayName: string,
): GhlContact[] {
  return contacts.filter((contact) => contactMatchesReviewerName(contact, reviewerDisplayName));
}

export async function fetchAllLocationContactsForDiscovery(): Promise<GhlContact[]> {
  if (useMockGhlData()) {
    return searchMockGhlContacts("").map((contact) => ({
      ...contact,
      lastActivity: contact.lastActivity ?? null,
      dateAdded: contact.dateAdded ?? null,
    }));
  }

  const config = requireGhlConfig();
  if (!config) {
    return [];
  }

  return fetchAllLocationContacts(config);
}

export async function discoverContacts(
  reviewerDisplayName: string,
  options?: { preloadedContacts?: GhlContact[] },
): Promise<ContactDiscoveryResult> {
  const trimmed = reviewerDisplayName.trim();
  if (!trimmed) {
    return {
      contacts: [],
      strategiesAttempted: [],
      messages: ["Reviewer name is empty."],
    };
  }

  if (useMockGhlData()) {
    const contacts = searchMockGhlContacts(trimmed).map((contact) => ({
      ...contact,
      lastActivity: contact.lastActivity ?? null,
      dateAdded: contact.dateAdded ?? null,
    }));
    return {
      contacts,
      strategiesAttempted: [{ strategy: "mock_search", resultCount: contacts.length }],
      messages:
        contacts.length > 0
          ? [`Mock GHL returned ${contacts.length} contact(s).`]
          : ["Mock GHL returned no contacts for this reviewer."],
    };
  }

  const config = requireGhlConfig();
  if (!config) {
    return {
      contacts: [],
      strategiesAttempted: [],
      messages: ["GHL credentials are not configured."],
    };
  }

  const strategiesAttempted: ContactDiscoveryResult["strategiesAttempted"] = [];
  const messages: string[] = [];
  let merged: GhlContact[] = [];

  try {
    for (const plan of buildDiscoveryPlans(trimmed)) {
      const batch = await searchRequest(config, plan.body);
      strategiesAttempted.push({ strategy: plan.strategy, resultCount: batch.length });
      merged.push(...batch);
      merged = dedupeContacts(merged);
    }

    let filtered = filterContactsForReviewer(merged, trimmed);

    if (filtered.length === 0) {
      const allContacts = options?.preloadedContacts ?? (await fetchAllLocationContacts(config));
      if (!options?.preloadedContacts) {
        strategiesAttempted.push({
          strategy: "local_name_scan",
          resultCount: allContacts.length,
        });
      }
      filtered = filterContactsForReviewer(allContacts, trimmed);
      if (filtered.length > 0) {
        messages.push(
          `API search returned ${merged.length} contact(s), but a full-location scan found ${filtered.length} name match(es) in alternate GHL fields.`,
        );
      } else if (allContacts.length > 0) {
        messages.push(
          `Scanned ${allContacts.length} GHL contacts; none matched "${trimmed}" in firstName, lastName, name, companyName, or name-like custom fields.`,
        );
      }
    } else if (merged.length === 0) {
      messages.push(`No GHL contacts were returned by API search for "${trimmed}".`);
    } else {
      messages.push(
        `Found ${filtered.length} candidate contact(s) from ${merged.length} raw search result(s).`,
      );
    }

    return {
      contacts: filtered.slice(0, 25),
      strategiesAttempted,
      messages,
    };
  } catch (error) {
    logger.error("GHL contact discovery failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    throw error;
  }
}

/** Admin manual search: return raw GHL API hits for the query (no name filter, no full scan). */
export async function searchGhlContactsManual(query: string): Promise<ContactDiscoveryResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      contacts: [],
      strategiesAttempted: [],
      messages: ["Enter a name to search GoHighLevel."],
    };
  }

  if (useMockGhlData()) {
    const contacts = searchMockGhlContacts(trimmed).map((contact) => ({
      ...contact,
      lastActivity: contact.lastActivity ?? null,
      dateAdded: contact.dateAdded ?? null,
    }));
    return {
      contacts,
      strategiesAttempted: [{ strategy: "mock_manual_search", resultCount: contacts.length }],
      messages: [`Manual search returned ${contacts.length} mock contact(s) for "${trimmed}".`],
    };
  }

  const config = requireGhlConfig();
  if (!config) {
    return {
      contacts: [],
      strategiesAttempted: [],
      messages: ["GHL credentials are not configured."],
    };
  }

  const strategiesAttempted: ContactDiscoveryResult["strategiesAttempted"] = [];
  let merged: GhlContact[] = [];

  for (const plan of buildDiscoveryPlans(trimmed)) {
    const batch = await searchRequest(config, plan.body);
    strategiesAttempted.push({ strategy: plan.strategy, resultCount: batch.length });
    merged.push(...batch);
    merged = dedupeContacts(merged);
  }

  const messages =
    merged.length > 0
      ? [
          `Manual search returned ${merged.length} raw GHL contact(s) for "${trimmed}". Select one and link it to this review.`,
        ]
      : [`No GHL contacts returned for "${trimmed}". Try first name, last name, or a spelling variant.`];

  return {
    contacts: merged.slice(0, 25),
    strategiesAttempted,
    messages,
  };
}

export async function searchContacts(query: string): Promise<GhlContact[]> {
  const discovery = await discoverContacts(query);
  return discovery.contacts;
}
