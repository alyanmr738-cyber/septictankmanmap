import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { ingestLaunchReviewBatch } from "@/lib/reviews/ingestLaunchReviewBatch";
import { parseReviewCsv } from "@/lib/reviews/parseReviewCsv";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  let body: {
    csv?: string;
    minRating?: number;
    tryGhlEnrichment?: boolean;
    skipDuplicates?: boolean;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.csv?.trim()) {
    return NextResponse.json({ error: "CSV content is required." }, { status: 400 });
  }

  const parsed = parseReviewCsv(body.csv);
  if (parsed.rows.length === 0) {
    return NextResponse.json(
      {
        error: parsed.errors[0]?.message ?? "No valid rows found in CSV.",
        parseErrors: parsed.errors,
      },
      { status: 400 },
    );
  }

  const result = await ingestLaunchReviewBatch(parsed.rows, {
    minRating: body.minRating ?? 4,
    tryGhlEnrichment: body.tryGhlEnrichment ?? false,
    skipDuplicates: body.skipDuplicates ?? true,
  });

  return NextResponse.json({
    ok: true,
    parseErrors: parsed.errors,
    ...result,
  });
}
