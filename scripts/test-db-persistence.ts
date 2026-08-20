import postgres from "postgres";
import type { ReviewRecord } from "@/lib/types";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

function buildTestReview(id: string): ReviewRecord {
  const now = new Date().toISOString();
  return {
    id,
    googleReviewId: null,
    reviewerDisplayName: "Persistence Test",
    publicReviewerName: "Persistence T.",
    rating: 5,
    reviewText: "Database persistence verification record.",
    reviewCreatedAt: now,
    ghlContactId: null,
    matchStatus: "pending",
    matchConfidence: null,
    publicCity: null,
    publicState: null,
    publicLat: null,
    publicLng: null,
    matchMetadata: { persistenceTest: true },
    approvedAt: null,
    rejectedAt: null,
    isSeed: false,
    createdAt: now,
    updatedAt: now,
  };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set.");
  }

  const { createReviewId, getReviewById, upsertReview } = await import("@/lib/database/reviews");

  const reviewId = createReviewId();
  const created = await upsertReview(buildTestReview(reviewId));
  const loaded = await getReviewById(reviewId);
  if (!loaded || loaded.matchStatus !== "pending") {
    throw new Error("Review was not persisted on first write.");
  }

  const approvedAt = new Date().toISOString();
  await upsertReview({
    ...created,
    matchStatus: "approved",
    approvedAt,
    publicCity: "Sarasota",
    publicState: "FL",
    publicLat: 27.3364,
    publicLng: -82.5307,
    updatedAt: approvedAt,
  });

  const url = process.env.DATABASE_URL;
  const sql = postgres(url, {
    max: 1,
    ssl: url.includes("localhost") || url.includes("127.0.0.1") ? false : "require",
  });

  try {
    const rows = await sql<
      {
        id: string;
        match_status: string;
        public_city: string | null;
      }[]
    >`SELECT id, match_status, public_city FROM reviews WHERE id = ${reviewId} LIMIT 1`;

    if (!rows[0] || rows[0].match_status !== "approved") {
      throw new Error("Approved review did not survive in Postgres.");
    }

    await sql`DELETE FROM reviews WHERE id = ${reviewId}`;

    process.stdout.write(
      JSON.stringify(
        {
          ok: true,
          reviewId,
          persisted: true,
          approvedStatusSurvivedReconnect: true,
          cleanedUpTestRow: true,
        },
        null,
        2,
      ) + "\n",
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : "unknown error"}\n`);
  process.exit(1);
});
