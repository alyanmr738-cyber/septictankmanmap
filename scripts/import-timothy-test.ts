import { listCandidates } from "@/lib/database/reviews";
import { ingestManualGoogleReview } from "@/lib/reviews/ingestManualReview";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

async function main() {
  const result = await ingestManualGoogleReview({
    reviewerDisplayName: "Timothy H.",
    rating: 5,
    reviewText:
      "TJ came out to pump our septic tank and was knowledgeable, professional, personable, and friendly.",
    reviewCreatedAt: "2026-01-15",
    replacePipelinePlaceholder: false,
  });

  const candidates = await listCandidates(result.review.id);

  console.log("\n=== Timothy H. Manual Import Result ===\n");
  console.log(`Review ID: ${result.review.id}`);
  console.log(`Queue: ${result.matchStatus}`);
  console.log(`Confidence: ${result.bestScore ?? result.review.matchConfidence ?? 0}%`);
  console.log(`Candidates: ${result.candidateCount}`);
  console.log(`Public name: ${result.review.publicReviewerName}`);
  console.log(`Suggested city/state: ${result.review.publicCity ?? "—"}, ${result.review.publicState ?? "—"}`);

  if (candidates.length === 0) {
    console.log("\nNo GHL candidates returned.");
    return;
  }

  console.log("\nTop candidates:");
  for (const candidate of candidates.slice(0, 8)) {
    console.log(
      `  • ${candidate.displayName} — ${candidate.score}% (${candidate.confidence})` +
        `${candidate.city ? ` — ${candidate.city}, ${candidate.state ?? "FL"}` : ""}`,
    );
    for (const reason of candidate.reasons.slice(0, 4)) {
      console.log(`      ${reason.points >= 0 ? "+" : ""}${reason.points} ${reason.label}`);
    }
  }

  console.log(`\nAdmin queue: /admin?status=${result.matchStatus}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
