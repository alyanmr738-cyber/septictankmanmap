export function normalizeName(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitPersonName(value: string): { first: string; last: string; full: string } {
  const normalized = normalizeName(value);
  const tokens = normalized.split(" ").filter(Boolean);
  if (tokens.length === 0) {
    return { first: "", last: "", full: "" };
  }
  if (tokens.length === 1) {
    return { first: tokens[0], last: "", full: tokens[0] };
  }
  return {
    first: tokens[0],
    last: tokens[tokens.length - 1],
    full: tokens.join(" "),
  };
}

export function namesAreExactMatch(googleName: string, ghlName: string): boolean {
  const a = splitPersonName(googleName);
  const b = splitPersonName(ghlName);
  return Boolean(a.full) && a.full === b.full;
}

export function lastNamesMatch(googleName: string, ghlName: string): boolean {
  const a = splitPersonName(googleName);
  const b = splitPersonName(ghlName);
  return Boolean(a.last) && a.last === b.last;
}

export function isAbbreviatedLastInitial(last: string): boolean {
  const cleaned = last.replace(/\./g, "").trim();
  return cleaned.length === 1 && /[a-z]/i.test(cleaned);
}

export function firstNameAndLastInitialMatch(googleName: string, candidateName: string): boolean {
  const google = splitPersonName(googleName);
  const candidate = splitPersonName(candidateName);
  if (!google.first || !candidate.first || google.first !== candidate.first) {
    return false;
  }
  if (!isAbbreviatedLastInitial(google.last)) {
    return false;
  }
  if (!candidate.last) {
    return false;
  }
  const initial = google.last.replace(/\./g, "").charAt(0);
  return candidate.last.charAt(0) === initial;
}

export function isFirstNameOnlyReviewer(googleName: string): boolean {
  const google = splitPersonName(googleName);
  return Boolean(google.first) && !google.last;
}

export function abbreviatedNameMatchKey(googleName: string, candidateName: string): string | null {
  if (!firstNameAndLastInitialMatch(googleName, candidateName)) {
    return null;
  }
  const google = splitPersonName(googleName);
  const initial = google.last.replace(/\./g, "").charAt(0);
  return `${google.first} ${initial}`;
}
