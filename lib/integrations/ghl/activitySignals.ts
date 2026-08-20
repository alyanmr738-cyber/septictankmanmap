import { isMockMode } from "@/lib/env";
import { getMockGhlContact } from "@/lib/integrations/ghl/mockContacts";
import { getContact } from "@/lib/integrations/ghl/getContact";
import type { CustomerActivitySignals } from "@/lib/types";

/**
 * Adapter for optional GHL activity signals.
 * Review-request SMS timing can be wired here later without changing matching.
 */
export async function getCustomerActivitySignals(
  contactId: string,
): Promise<CustomerActivitySignals> {
  if (isMockMode()) {
    const mock = getMockGhlContact(contactId);
    return {
      lastCustomerActivity: mock?.lastActivity ?? null,
      serviceCompletedAt: mock && "serviceCompletedAt" in mock ? mock.serviceCompletedAt : null,
      reviewRequestAt: mock && "reviewRequestAt" in mock ? mock.reviewRequestAt : null,
    };
  }

  const contact = await getContact(contactId);
  return {
    lastCustomerActivity: contact?.lastActivity ?? null,
    serviceCompletedAt: null,
    reviewRequestAt: null,
  };
}
