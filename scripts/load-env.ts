import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function parseEnvFile(path: string) {
  if (!existsSync(path)) {
    return;
  }

  const content = readFileSync(path, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

export function loadEnvLocal() {
  parseEnvFile(resolve(process.cwd(), ".env.local"));
  parseEnvFile(resolve(process.cwd(), ".env"));

  if (!process.env.DATABASE_URL) {
    const direct = process.env.SUPABASE_DIRECT_CONNECTION_STRING;
    const password = process.env.SUPABASE_DB_PASSWORD ?? process.env.YOUR_PASSWORD;
    if (direct && password && direct.includes("[YOUR-PASSWORD]")) {
      process.env.DATABASE_URL = direct.replace(
        "[YOUR-PASSWORD]",
        encodeURIComponent(password),
      );
    }
  }
}
