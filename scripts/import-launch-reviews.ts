import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ingestLaunchReviewBatch } from "@/lib/reviews/ingestLaunchReviewBatch";
import { parseReviewCsv } from "@/lib/reviews/parseReviewCsv";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

async function main() {
  const csvPath = resolve(process.cwd(), "public/launch-google-reviews.csv");
  const csv = readFileSync(csvPath, "utf8");
  const parsed = parseReviewCsv(csv);

  if (parsed.errors.length > 0) {
    console.error("Parse errors:", parsed.errors);
  }

  console.log(`Publishing ${parsed.rows.length} launch reviews (rating >= 4)...\n`);
  const result = await ingestLaunchReviewBatch(parsed.rows, {
    minRating: 4,
    tryGhlEnrichment: process.argv.includes("--try-ghl"),
    skipDuplicates: !process.argv.includes("--force"),
  });

  console.log(`Published: ${result.published}`);
  console.log(`Skipped: ${result.skipped}`);
  console.log(`Failed: ${result.failed}`);
  console.log(
    `Locations → ghl_verified: ${result.ghlVerified}, service_area_estimate: ${result.serviceAreaEstimate}\n`,
  );

  for (const row of result.rows) {
    const detail =
      row.status === "published"
        ? `${row.locationSource} (${row.reviewId})`
        : row.message ?? row.status;
    console.log(`  ${row.reviewerDisplayName.padEnd(24)} ${detail}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
