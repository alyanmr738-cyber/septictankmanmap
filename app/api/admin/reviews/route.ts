import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { getAdminReviewCards } from "@/lib/admin/queries";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  const status = request.nextUrl.searchParams.get("status");
  const reviews = await getAdminReviewCards(status);
  return NextResponse.json(
    { reviews },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
