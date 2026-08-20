import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { ingestManualGoogleReviewBatch } from "@/lib/reviews/ingestManualReviewBatch";
import { parseReviewCsv } from "@/lib/reviews/parseReviewCsv";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  let body: {
    csv?: string;
    replacePipelinePlaceholder?: boolean;
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

  const result = await ingestManualGoogleReviewBatch(parsed.rows, {
    replacePipelinePlaceholder: body.replacePipelinePlaceholder ?? false,
    skipDuplicates: body.skipDuplicates ?? true,
  });

  return NextResponse.json({
    ok: true,
    parseErrors: parsed.errors,
    ...result,
    queuePaths: {
      pending: "/admin?status=pending",
      needs_review: "/admin?status=needs_review",
      unmatched: "/admin?status=unmatched",
    },
  });
}
