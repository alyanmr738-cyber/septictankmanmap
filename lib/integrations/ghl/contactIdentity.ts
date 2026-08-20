import { normalizeName, splitPersonName } from "@/lib/matching/normalizeName";
import type { GhlContact } from "@/lib/types";

export type ContactNameVariant = {
  label: string;
  normalized: string;
  source: string;
};

const NAME_FIELD_HINTS = ["name", "customer", "client", "homeowner", "contact"] as const;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function looksLikePersonName(value: string): boolean {
  if (!value || value.length < 2) {
    return false;
  }
  if (value.includes("@") || /\d{3}/.test(value)) {
    return false;
  }
  return /[a-z]/i.test(value);
}

function pushVariant(
  variants: ContactNameVariant[],
  seen: Set<string>,
  label: string,
  source: string,
): void {
  const trimmed = label.trim();
  if (!looksLikePersonName(trimmed)) {
    return;
  }
  const normalized = normalizeName(trimmed);
  if (!normalized || seen.has(normalized)) {
    return;
  }
  seen.add(normalized);
  variants.push({ label: trimmed, normalized, source });
}

export function extractContactNameVariants(contact: GhlContact): ContactNameVariant[] {
  const variants: ContactNameVariant[] = [];
  const seen = new Set<string>();

  const first = readString(contact.firstName);
  const last = readString(contact.lastName);
  const combined = [first, last].filter(Boolean).join(" ").trim();
  if (combined) {
    pushVariant(variants, seen, combined, "firstName + lastName");
  }
  if (first) {
    pushVariant(variants, seen, first, "firstName");
  }
  if (last) {
    pushVariant(variants, seen, last, "lastName");
  }

  pushVariant(variants, seen, readString(contact.name), "name");
  pushVariant(variants, seen, readString(contact.companyName), "companyName");

  for (const entry of contact.customFields ?? []) {
    if (!entry || typeof entry !== "object") {
      continue;
    }
    const field = entry as Record<string, unknown>;
    const fieldLabel =
      readString(field.name) || readString(field.key) || readString(field.fieldKey);
    const value = readString(field.value);
    if (!value || !looksLikePersonName(value)) {
      continue;
    }
    const normalizedLabel = fieldLabel.toLowerCase();
    if (!NAME_FIELD_HINTS.some((hint) => normalizedLabel.includes(hint))) {
      continue;
    }
    pushVariant(
      variants,
      seen,
      value,
      fieldLabel ? `custom field: ${fieldLabel}` : "custom field",
    );
  }

  return variants;
}

export function getPrimaryDisplayName(contact: GhlContact): string {
  const variants = extractContactNameVariants(contact);
  const preferred =
    variants.find((variant) => variant.source === "firstName + lastName") ??
    variants.find((variant) => variant.source === "name") ??
    variants.find((variant) => variant.source === "companyName") ??
    variants[0];

  return preferred?.label ?? "Unknown contact";
}

export function contactHasIdentity(contact: GhlContact): boolean {
  return extractContactNameVariants(contact).length > 0;
}

export function contactMatchesReviewerName(
  contact: GhlContact,
  reviewerDisplayName: string,
): boolean {
  const google = splitPersonName(reviewerDisplayName);
  if (!google.full) {
    return false;
  }

  for (const variant of extractContactNameVariants(contact)) {
    const candidate = splitPersonName(variant.label);
    if (variant.normalized === normalizeName(reviewerDisplayName)) {
      return true;
    }
    if (google.first && candidate.first === google.first) {
      return true;
    }
    if (google.last && candidate.last === google.last) {
      return true;
    }
    if (google.last && candidate.last && candidate.last.startsWith(google.last.charAt(0))) {
      if (google.first && candidate.first === google.first) {
        return true;
      }
    }
  }

  return false;
}
