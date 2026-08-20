const SENSITIVE_KEY_PATTERN =
  /(password|secret|token|authorization|api[_-]?key|email|phone|address|street|postal|zip|ssn|cookie)/i;

const SENSITIVE_EXACT_KEYS = new Set([
  "ghlcontactid",
  "ghl_contact_id",
  "address1",
  "address2",
  "emailaddress",
  "phonenumber",
  "access_token",
  "refresh_token",
]);

function shouldRedactKey(key: string): boolean {
  const normalized = key.replace(/[\s-]/g, "").toLowerCase();
  return SENSITIVE_EXACT_KEYS.has(normalized) || SENSITIVE_KEY_PATTERN.test(key);
}

export function redactSensitive(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitive(item));
  }

  if (value && typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      output[key] = shouldRedactKey(key) ? "[REDACTED]" : redactSensitive(nested);
    }
    return output;
  }

  return value;
}
