import { useMockGhlData } from "@/lib/env";
import { ghlFetch, requireGhlConfig } from "@/lib/integrations/ghl/client";
import { getMockGhlContact } from "@/lib/integrations/ghl/mockContacts";
import { mapGhlApiContact } from "@/lib/integrations/ghl/mapContact";
import type { GhlApiContact } from "@/lib/integrations/ghl/types";
import type { GhlContact } from "@/lib/types";
import { logger } from "@/lib/logger";

export async function getContact(contactId: string): Promise<GhlContact | null> {
  if (useMockGhlData()) {
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
    return mapGhlApiContact(contact);
  } catch (error) {
    logger.error("GHL get contact failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    throw error;
  }
}
