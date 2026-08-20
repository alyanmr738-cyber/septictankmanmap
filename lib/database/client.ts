import postgres from "postgres";
import { getDatabaseUrl } from "@/lib/env";

let client: ReturnType<typeof postgres> | null = null;

export function getSql() {
  const url = getDatabaseUrl();
  if (!url) {
    return null;
  }
  if (!client) {
    client = postgres(url, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: url.includes("localhost") || url.includes("127.0.0.1") ? false : "require",
    });
  }
  return client;
}
