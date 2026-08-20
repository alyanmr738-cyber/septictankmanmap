export type ParsedReviewCsvRow = {
  lineNumber: number;
  reviewerDisplayName: string;
  rating: number;
  reviewText: string;
  reviewCreatedAt: string;
  reviewSource: string;
  googleReviewId: string | null;
};

export type ParsedReviewCsvResult = {
  rows: ParsedReviewCsvRow[];
  errors: Array<{ lineNumber: number; message: string }>;
};

const HEADER_ALIASES: Record<string, keyof Omit<ParsedReviewCsvRow, "lineNumber">> = {
  reviewer_name: "reviewerDisplayName",
  reviewer_display_name: "reviewerDisplayName",
  name: "reviewerDisplayName",
  rating: "rating",
  stars: "rating",
  review_text: "reviewText",
  text: "reviewText",
  comment: "reviewText",
  review_date: "reviewCreatedAt",
  date: "reviewCreatedAt",
  created_at: "reviewCreatedAt",
  source: "reviewSource",
  review_source: "reviewSource",
  google_review_id: "googleReviewId",
  review_id: "googleReviewId",
};

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  fields.push(current);
  return fields.map((field) => field.trim());
}

function isHeaderRow(values: string[]): boolean {
  const normalized = values.map(normalizeHeader);
  return normalized.some((value) => value in HEADER_ALIASES);
}

function mapRow(values: string[], headerIndexes: Record<string, number>, lineNumber: number) {
  const read = (key: string): string => {
    const index = headerIndexes[key];
    return index == null ? "" : (values[index] ?? "").trim();
  };

  const reviewerDisplayName = read("reviewerDisplayName");
  const ratingRaw = read("rating");
  const reviewText = read("reviewText");
  const reviewCreatedAt = read("reviewCreatedAt");
  const reviewSource = read("reviewSource") || "google_manual";
  const googleReviewId = read("googleReviewId") || null;

  if (!reviewerDisplayName && !reviewText && !ratingRaw && !reviewCreatedAt) {
    return null;
  }

  if (!reviewerDisplayName) {
    throw new Error("reviewer_name is required");
  }
  if (!reviewText) {
    throw new Error("review_text is required");
  }
  if (!reviewCreatedAt || Number.isNaN(Date.parse(reviewCreatedAt))) {
    throw new Error("review_date must be a valid date");
  }

  const rating = Number.parseInt(ratingRaw, 10);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("rating must be an integer from 1 to 5");
  }

  return {
    lineNumber,
    reviewerDisplayName,
    rating,
    reviewText,
    reviewCreatedAt,
    reviewSource,
    googleReviewId,
  } satisfies ParsedReviewCsvRow;
}

export function parseReviewCsv(input: string): ParsedReviewCsvResult {
  const lines = input
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rows: ParsedReviewCsvRow[] = [];
  const errors: ParsedReviewCsvResult["errors"] = [];

  if (lines.length === 0) {
    return { rows, errors: [{ lineNumber: 1, message: "CSV is empty." }] };
  }

  const firstValues = parseCsvLine(lines[0]);
  const hasHeader = isHeaderRow(firstValues);
  const headerIndexes: Record<string, number> = {};

  if (hasHeader) {
    firstValues.forEach((value, index) => {
      const mapped = HEADER_ALIASES[normalizeHeader(value)];
      if (mapped) {
        headerIndexes[mapped] = index;
      }
    });
  } else {
    headerIndexes.reviewerDisplayName = 0;
    headerIndexes.rating = 1;
    headerIndexes.reviewText = 2;
    headerIndexes.reviewCreatedAt = 3;
    headerIndexes.reviewSource = 4;
    headerIndexes.googleReviewId = 5;
  }

  const required = ["reviewerDisplayName", "rating", "reviewText", "reviewCreatedAt"] as const;
  for (const key of required) {
    if (headerIndexes[key] == null) {
      return {
        rows: [],
        errors: [{ lineNumber: 1, message: `Missing required CSV column: ${key}` }],
      };
    }
  }

  const dataLines = hasHeader ? lines.slice(1) : lines;
  for (let index = 0; index < dataLines.length; index += 1) {
    const lineNumber = hasHeader ? index + 2 : index + 1;
    try {
      const values = parseCsvLine(dataLines[index]);
      const row = mapRow(values, headerIndexes, lineNumber);
      if (row) {
        rows.push(row);
      }
    } catch (error) {
      errors.push({
        lineNumber,
        message: error instanceof Error ? error.message : "Invalid row",
      });
    }
  }

  return { rows, errors };
}
