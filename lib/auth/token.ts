import { createHmac, timingSafeEqual } from "crypto";
import { getAuthSecret } from "@/lib/env";

export const ADMIN_COOKIE = "stm_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret(): string | null {
  const secret = getAuthSecret();
  if (!secret || secret.length < 16) {
    return null;
  }
  return secret;
}

function requireAuthSecret(): string {
  const secret = getSecret();
  if (!secret) {
    throw new Error("AUTH_SECRET must be set to a long random string");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", requireAuthSecret()).update(value).digest("base64url");
}

export function createSessionToken(): string {
  const payload = JSON.stringify({
    role: "admin",
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !token.includes(".") || !getSecret()) {
    return false;
  }
  try {
    const [encoded, signature] = token.split(".");
    const expected = sign(encoded);
    const left = Buffer.from(signature);
    const right = Buffer.from(expected);
    if (left.length !== right.length || !timingSafeEqual(left, right)) {
      return false;
    }
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
      role?: string;
      exp?: number;
    };
    return payload.role === "admin" && typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}
