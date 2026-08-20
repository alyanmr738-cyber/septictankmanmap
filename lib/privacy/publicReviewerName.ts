const GOOGLE_GENERIC_NAMES = new Set([
  "a google user",
  "google user",
  "anonymous",
  "a google reviewer",
]);

function cleanToken(token: string): string {
  return token.replace(/[.,]+$/g, "").trim();
}

/**
 * Converts a Google display name into a privacy-safe public byline.
 * "John Smith" → "John S."
 * "Maria Gonzalez" → "Maria G."
 */
export function toPublicReviewerName(displayName: string | null | undefined): string {
  const raw = displayName?.trim() ?? "";
  if (!raw) {
    return "Google Reviewer";
  }

  if (GOOGLE_GENERIC_NAMES.has(raw.toLowerCase())) {
    return "Google Reviewer";
  }

  const tokens = raw.split(/\s+/).map(cleanToken).filter(Boolean);
  if (tokens.length === 0) {
    return "Google Reviewer";
  }

  if (tokens.length === 1) {
    const single = tokens[0];
    if (/^[A-Za-z]\.?$/.test(single)) {
      return `${single.replace(/\.$/, "")}.`;
    }
    return single;
  }

  const suffixes = new Set(["jr", "jr.", "sr", "sr.", "ii", "iii", "iv", "phd", "md"]);
  const lastIndex = suffixes.has(tokens[tokens.length - 1].toLowerCase())
    ? tokens.length - 2
    : tokens.length - 1;

  if (lastIndex <= 0) {
    return tokens[0];
  }

  const firstName = tokens.slice(0, lastIndex).join(" ");
  const lastName = tokens[lastIndex];
  const initial = lastName.charAt(0).toUpperCase();

  if (!/[A-Za-z]/.test(initial)) {
    return firstName;
  }

  return `${firstName} ${initial}.`;
}
