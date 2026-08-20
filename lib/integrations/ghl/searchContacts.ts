import { isMockMode } from "@/lib/env";
import { ghlFetch, requireGhlConfig } from "@/lib/integrations/ghl/client";
import { searchMockGhlContacts } from "@/lib/integrations/ghl/mockContacts";
import type { GhlApiContact, GhlSearchContactsResponse } from "@/lib/integrations/ghl/types";
import type { GhlContact } from "@/lib/types";
import { logger } from "@/lib/logger";

function toGhlContact(contact: GhlApiContact | GhlContact): GhlContact {
  return {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    name:
      contact.name ??
      ("contactName" in contact ? contact.contactName : undefined) ??
      [contact.firstName, contact.lastName].filter(Boolean).join(" "),
    city: contact.city,
    state: contact.state,
    postalCode: contact.postalCode,
    address1:
      "address1" in contact
        ? contact.address1 ?? ("address" in contact ? contact.address : undefined)
        : undefined,
    lastActivity: contact.lastActivity,
    dateAdded: "dateAdded" in contact ? contact.dateAdded : undefined,
  };
}

export async function searchContacts(query: string): Promise<GhlContact[]> {
  if (isMockMode()) {
    return searchMockGhlContacts(query).map(toGhlContact);
  }

  const config = requireGhlConfig();
  if (!config) {
    return [];
  }

  try {
    const data = await ghlFetch<GhlSearchContactsResponse>("/contacts/search", {
      method: "POST",
      body: JSON.stringify({
        locationId: config.locationId,
        page: 1,
        pageLimit: 25,
        query,
      }),
    });

    return (data.contacts ?? []).map(toGhlContact);
  } catch (error) {
    logger.error("GHL contact search failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    throw error;
  }
}
