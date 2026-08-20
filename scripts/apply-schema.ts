import { readFileSync } from "fs";
import { resolve } from "path";
import postgres from "postgres";
import { loadEnvLocal } from "./load-env";

loadEnvLocal();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local first.");
  }

  const schemaPath = resolve(process.cwd(), "lib/database/schema.sql");
  const schema = readFileSync(schemaPath, "utf8");
  const sql = postgres(url, {
    max: 1,
    ssl: url.includes("localhost") || url.includes("127.0.0.1") ? false : "require",
  });

  try {
    await sql.unsafe(schema);
    const tables = await sql<{ table_name: string }[]>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('reviews', 'review_match_candidates')
      ORDER BY table_name
    `;
    process.stdout.write(
      JSON.stringify(
        {
          ok: true,
          tables: tables.map((row) => row.table_name),
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
