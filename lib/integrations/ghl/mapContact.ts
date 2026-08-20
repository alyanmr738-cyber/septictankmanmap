import type { GhlApiContact } from "@/lib/integrations/ghl/types";
import type { GhlContact } from "@/lib/types";

export function mapGhlApiContact(contact: GhlApiContact): GhlContact {
  return {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    name:
      contact.name ??
      contact.contactName ??
      ([contact.firstName, contact.lastName].filter(Boolean).join(" ") || undefined),
    companyName: contact.companyName,
    email: contact.email,
    phone: contact.phone,
    city: contact.city,
    state: contact.state,
    postalCode: contact.postalCode,
    address1: contact.address1 ?? contact.address,
    lastActivity: contact.lastActivity ?? null,
    dateAdded: contact.dateAdded ?? null,
    customFields: contact.customFields,
  };
}
