import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { getReviewById, listCandidates, replaceCandidates, upsertReview } from "@/lib/database/reviews";
import { resolveImportedReviewStatus, runReviewMatching } from "@/lib/reviews/runReviewMatching";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  const { id } = await context.params;
  const review = await getReviewById(id);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const match = await runReviewMatching({
    reviewerDisplayName: review.reviewerDisplayName,
    createTime: review.reviewCreatedAt,
  });

  const topCandidate = match.candidates[0] ?? null;
  const now = new Date().toISOString();

  await upsertReview({
    ...review,
    ghlContactId: topCandidate?.ghlContactId ?? null,
    matchStatus: resolveImportedReviewStatus(match),
    matchConfidence: match.bestScore,
    publicCity: topCandidate?.city ?? review.publicCity,
    publicState: topCandidate?.state ?? review.publicState,
    matchMetadata: {
      ...(review.matchMetadata ?? {}),
      discoveryDiagnostics: match.diagnostics,
    },
    updatedAt: now,
  });
  await replaceCandidates(review.id, match.candidates);

  return NextResponse.json({
    ok: true,
    matchStatus: resolveImportedReviewStatus(match),
    matchConfidence: match.bestScore,
    candidateCount: match.candidates.length,
    candidates: await listCandidates(review.id),
    diagnostics: match.diagnostics,
    queuePath: `/admin?status=${resolveImportedReviewStatus(match)}`,
  });
}
