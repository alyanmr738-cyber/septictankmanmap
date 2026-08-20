type AddressInspection = {
  addressFound: boolean;
  addressSource: string;
  city: string | null;
  state: string | null;
  hasStreetLine: boolean;
};

const ADDRESS_FIELD_HINTS = [
  "address",
  "service",
  "property",
  "street",
  "location",
  "site",
] as const;

function readString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function looksLikeAddressFieldName(name: string): boolean {
  const normalized = name.toLowerCase();
  return ADDRESS_FIELD_HINTS.some((hint) => normalized.includes(hint));
}

function inspectStandardFields(contact: Record<string, unknown>): AddressInspection | null {
  const address1 = readString(contact.address1) || readString(contact.address);
  const address2 = readString(contact.address2);
  const city = readString(contact.city);
  const state = readString(contact.state);
  const postalCode = readString(contact.postalCode);
  const streetLine = address1 || address2;

  if (streetLine || city || state || postalCode) {
    return {
      addressFound: Boolean(streetLine || city || state),
      addressSource: streetLine
        ? "Standard contact fields"
        : "Standard contact fields (city/state only)",
      city: city || null,
      state: state || null,
      hasStreetLine: Boolean(streetLine),
    };
  }

  return null;
}

function inspectCustomFields(contact: Record<string, unknown>): AddressInspection | null {
  const customFields = contact.customFields;
  if (!Array.isArray(customFields)) {
    return null;
  }

  for (const entry of customFields) {
    if (!entry || typeof entry !== "object") {
      continue;
    }
    const field = entry as Record<string, unknown>;
    const label = readString(field.name) || readString(field.key) || readString(field.fieldKey);
    const value = readString(field.value);
    if (!value) {
      continue;
    }

    if (!looksLikeAddressFieldName(label) && !/\d/.test(value)) {
      continue;
    }

    const cityMatch = value.match(/,\s*([A-Za-z .'-]+),\s*([A-Z]{2})\b/);
    return {
      addressFound: true,
      addressSource: label ? `Custom field: ${label}` : "Custom field",
      city: cityMatch?.[1]?.trim() ?? null,
      state: cityMatch?.[2]?.trim() ?? null,
      hasStreetLine: /\d/.test(value),
    };
  }

  return null;
}

function inspectNestedObjects(contact: Record<string, unknown>): AddressInspection | null {
  for (const [key, value] of Object.entries(contact)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      continue;
    }
    if (!looksLikeAddressFieldName(key)) {
      continue;
    }
    const nested = value as Record<string, unknown>;
    const nestedResult = inspectStandardFields(nested);
    if (nestedResult?.addressFound) {
      return {
        ...nestedResult,
        addressSource: `Nested object: ${key}`,
      };
    }
  }
  return null;
}

export function inspectServiceAddress(contact: Record<string, unknown>): AddressInspection {
  return (
    inspectStandardFields(contact) ??
    inspectCustomFields(contact) ??
    inspectNestedObjects(contact) ?? {
      addressFound: false,
      addressSource: "None",
      city: null,
      state: null,
      hasStreetLine: false,
    }
  );
}

export function normalizePersonName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function contactDisplayName(contact: Record<string, unknown>): string {
  const explicit = readString(contact.name) || readString(contact.contactName);
  if (explicit) {
    return explicit;
  }
  return [readString(contact.firstName), readString(contact.lastName)].filter(Boolean).join(" ");
}

export function isExactNameMatch(contact: Record<string, unknown>, query: string): boolean {
  const target = normalizePersonName(query);
  const displayName = normalizePersonName(contactDisplayName(contact));
  return displayName === target;
}
