import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { assignMatch } from "@/lib/approval/approveReview";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { ghlContactId?: string } | null;
  if (!body?.ghlContactId) {
    return Response.json({ error: "A customer match is required" }, { status: 400 });
  }
  return assignMatch(id, body.ghlContactId);
}
