import { timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";
import { getCronSecret } from "@/lib/env";

export function isAuthorizedCron(request: NextRequest): boolean {
  const secret = getCronSecret();
  if (!secret) {
    return false;
  }

  const header =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.headers.get("x-cron-secret") ??
    "";

  const left = Buffer.from(header);
  const right = Buffer.from(secret);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}
