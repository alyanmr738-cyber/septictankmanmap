import type { FindCandidatesResult } from "@/lib/matching/findCandidates";
import { findCandidates } from "@/lib/matching/findCandidates";
import { searchContacts } from "@/lib/integrations/ghl/searchContacts";
import { getCustomerActivitySignals } from "@/lib/integrations/ghl/activitySignals";
import type { GoogleReview, MatchStatus } from "@/lib/types";

export function resolveImportedReviewStatus(
  match: Pick<FindCandidatesResult, "status">,
): MatchStatus {
  if (match.status === "needs_review") {
    return "needs_review";
  }
  if (match.status === "unmatched") {
    return "unmatched";
  }
  return "pending";
}

export async function runReviewMatching(review: Pick<GoogleReview, "reviewerDisplayName" | "createTime">) {
  const contacts = await searchContacts(review.reviewerDisplayName);
  const signalsByContactId: Record<string, Awaited<ReturnType<typeof getCustomerActivitySignals>>> = {};
  for (const contact of contacts) {
    signalsByContactId[contact.id] = await getCustomerActivitySignals(contact.id);
  }

  return findCandidates({
    review,
    contacts,
    signalsByContactId,
  });
}
