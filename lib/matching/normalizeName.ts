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
