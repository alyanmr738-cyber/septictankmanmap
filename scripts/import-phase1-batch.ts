import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ingestManualGoogleReviewBatch } from "@/lib/reviews/ingestManualReviewBatch";
import { parseReviewCsv } from "@/lib/reviews/parseReviewCsv";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

async function main() {
  const csvPath = resolve(process.cwd(), "public/phase1-google-reviews.csv");
  const csv = readFileSync(csvPath, "utf8");
  const parsed = parseReviewCsv(csv);

  if (parsed.errors.length > 0) {
    console.error("Parse errors:", parsed.errors);
  }

  console.log(`Importing ${parsed.rows.length} reviews...\n`);
  const result = await ingestManualGoogleReviewBatch(parsed.rows, { skipDuplicates: true });

  console.log(`Imported: ${result.imported}`);
  console.log(`Skipped: ${result.skipped}`);
  console.log(`Failed: ${result.failed}`);
  console.log(
    `Queues → pending: ${result.queueCounts.pending}, needs_review: ${result.queueCounts.needs_review}, unmatched: ${result.queueCounts.unmatched}\n`,
  );

  for (const row of result.rows) {
    const detail =
      row.status === "imported"
        ? `${row.matchStatus} (${row.matchConfidence ?? 0}%, ${row.candidateCount ?? 0} candidates)`
        : row.message ?? row.status;
    console.log(`  ${row.reviewerDisplayName.padEnd(22)} ${detail}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
