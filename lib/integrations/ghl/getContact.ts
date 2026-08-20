import { isMockMode } from "@/lib/env";
import { ghlFetch, requireGhlConfig } from "@/lib/integrations/ghl/client";
import { getMockGhlContact } from "@/lib/integrations/ghl/mockContacts";
import type { GhlApiContact } from "@/lib/integrations/ghl/types";
import type { GhlContact } from "@/lib/types";
import { logger } from "@/lib/logger";

export async function getContact(contactId: string): Promise<GhlContact | null> {
  if (isMockMode()) {
    return getMockGhlContact(contactId);
  }

  requireGhlConfig();

  try {
    const data = await ghlFetch<{ contact: GhlApiContact }>(`/contacts/${encodeURIComponent(contactId)}`, {
      method: "GET",
    });
    const contact = data.contact;
    if (!contact) {
      return null;
    }
    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      name: contact.name ?? contact.contactName ?? [contact.firstName, contact.lastName].filter(Boolean).join(" "),
      city: contact.city,
      state: contact.state,
      postalCode: contact.postalCode,
      address1: contact.address1 ?? contact.address,
      lastActivity: contact.lastActivity,
      dateAdded: contact.dateAdded,
    };
  } catch (error) {
    logger.error("GHL get contact failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    throw error;
  }
}
