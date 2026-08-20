import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth/session";

export async function requireAdmin(): Promise<true | NextResponse> {
  const valid = await getAdminSessionFromCookies();
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return true;
}
