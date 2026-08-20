import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { getReviewById, replaceCandidates } from "@/lib/database/reviews";
import { searchContacts } from "@/lib/integrations/ghl/searchContacts";
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
  const contacts = await searchContacts(query);
  const signalsByContactId: Record<string, CustomerActivitySignals> = {};
  for (const contact of contacts) {
    signalsByContactId[contact.id] = await getCustomerActivitySignals(contact.id);
  }

  const match = findCandidates({
    review: {
      reviewerDisplayName: review.reviewerDisplayName,
      createTime: review.reviewCreatedAt,
    },
    contacts,
    signalsByContactId,
  });

  await replaceCandidates(review.id, match.candidates);
  return NextResponse.json({ candidates: match.candidates });
}
