import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { LAUNCH_GOOGLE_REVIEWS, launchReviewsToCsv } from "./launch-review-data";

const csvPath = resolve(process.cwd(), "public/launch-google-reviews.csv");
writeFileSync(csvPath, launchReviewsToCsv(LAUNCH_GOOGLE_REVIEWS), "utf8");
console.log(`Wrote ${LAUNCH_GOOGLE_REVIEWS.length} launch reviews to ${csvPath}`);
