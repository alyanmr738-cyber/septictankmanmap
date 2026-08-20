import { listReviews, replaceCandidates, upsertReview } from "@/lib/database/reviews";
import {
  discoverContacts,
  fetchAllLocationContactsForDiscovery,
} from "@/lib/integrations/ghl/discoverContacts";
import { getCustomerActivitySignals } from "@/lib/integrations/ghl/activitySignals";
import { findCandidates } from "@/lib/matching/findCandidates";
import { resolveImportedReviewStatus } from "@/lib/reviews/runReviewMatching";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

async function main() {
  const reviews = await listReviews("unmatched");
  console.log(`Re-running discovery for ${reviews.length} unmatched review(s)...\n`);

  const preloadedContacts = await fetchAllLocationContactsForDiscovery();
  console.log(`Loaded ${preloadedContacts.length} GHL contacts for local scan.\n`);

  let moved = 0;
  for (const review of reviews) {
    const discovery = await discoverContacts(review.reviewerDisplayName, { preloadedContacts });
    const signalsByContactId: Record<string, Awaited<ReturnType<typeof getCustomerActivitySignals>>> = {};
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
      discovery: {
        strategiesAttempted: discovery.strategiesAttempted,
        messages: discovery.messages,
      },
    });

    const status = resolveImportedReviewStatus(match);
    const top = match.candidates[0] ?? null;
    const now = new Date().toISOString();

    await upsertReview({
      ...review,
      ghlContactId: top?.ghlContactId ?? null,
      matchStatus: status,
      matchConfidence: match.bestScore,
      publicCity: top?.city ?? null,
      publicState: top?.state ?? null,
      matchMetadata: {
        ...(review.matchMetadata ?? {}),
        discoveryDiagnostics: match.diagnostics,
      },
      updatedAt: now,
    });
    await replaceCandidates(review.id, match.candidates);

    if (status !== "unmatched") {
      moved += 1;
    }

    console.log(
      `${review.reviewerDisplayName.padEnd(24)} ${status.padEnd(14)} ${match.bestScore ?? 0}% · ${match.candidates.length} candidate(s)`,
    );
    for (const message of match.diagnostics.messages.slice(0, 2)) {
      console.log(`  ↳ ${message}`);
    }
  }

  console.log(`\nMoved out of unmatched: ${moved}/${reviews.length}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
