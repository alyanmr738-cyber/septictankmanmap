import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import {
  ingestManualGoogleReview,
  type ManualGoogleReviewInput,
} from "@/lib/reviews/ingestManualReview";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  let body: Partial<ManualGoogleReviewInput>;
  try {
    body = (await request.json()) as Partial<ManualGoogleReviewInput>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const result = await ingestManualGoogleReview({
      reviewerDisplayName: body.reviewerDisplayName ?? "",
      rating: Number(body.rating),
      reviewText: body.reviewText ?? "",
      reviewCreatedAt: body.reviewCreatedAt ?? "",
      googleReviewId: body.googleReviewId ?? null,
      replacePipelinePlaceholder: body.replacePipelinePlaceholder ?? true,
    });

    return NextResponse.json({
      ok: true,
      reviewId: result.review.id,
      matchStatus: result.matchStatus,
      matchConfidence: result.review.matchConfidence,
      candidateCount: result.candidateCount,
      removedPipelinePlaceholders: result.removedPipelinePlaceholders,
      queuePath: `/admin?status=${result.matchStatus}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Import failed" },
      { status: 400 },
    );
  }
}
