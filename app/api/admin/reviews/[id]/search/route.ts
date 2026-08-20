import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { getReviewById, listCandidates, replaceCandidates, upsertReview } from "@/lib/database/reviews";
import { searchGhlContactsManual } from "@/lib/integrations/ghl/discoverContacts";
import { getCustomerActivitySignals } from "@/lib/integrations/ghl/activitySignals";
import { findCandidates } from "@/lib/matching/findCandidates";
import type { CustomerActivitySignals } from "@/lib/types";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  const { id } = await context.params;
  const review = await getReviewById(id);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { query?: string } | null;
  const query = body?.query?.trim() || review.reviewerDisplayName;
  const discovery = await searchGhlContactsManual(query);
  const signalsByContactId: Record<string, CustomerActivitySignals> = {};
  for (const contact of discovery.contacts) {
    signalsByContactId[contact.id] = await getCustomerActivitySignals(contact.id);
  }

  const match = findCandidates({
    review: {
      reviewerDisplayName: review.reviewerDisplayName,
      createTime: review.reviewCreatedAt,
    },
    contacts: discovery.contacts,
    signalsByContactId,
    includeWeakCandidates: true,
    discovery: {
      strategiesAttempted: discovery.strategiesAttempted,
      messages: discovery.messages,
    },
  });

  const now = new Date().toISOString();
  const nextStatus =
    review.matchStatus === "approved"
      ? review.matchStatus
      : match.candidates.length > 0
        ? "needs_review"
        : review.matchStatus;

  await upsertReview({
    ...review,
    matchStatus: nextStatus,
    matchConfidence: match.bestScore,
    matchMetadata: {
      ...(review.matchMetadata ?? {}),
      discoveryDiagnostics: match.diagnostics,
    },
    updatedAt: now,
  });
  await replaceCandidates(review.id, match.candidates);

  return NextResponse.json({
    candidates: await listCandidates(review.id),
    diagnostics: match.diagnostics,
    matchStatus: nextStatus,
    matchConfidence: match.bestScore,
  });
}
