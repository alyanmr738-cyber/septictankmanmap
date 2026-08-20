import { NextRequest, NextResponse } from "next/server";
import { previewPrivacyTransformation } from "@/lib/approval/previewPrivacy";
import { requireAdmin } from "@/lib/auth/guard";
import { getReviewById } from "@/lib/database/reviews";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  const { id } = await context.params;
  const review = await getReviewById(id);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  let body: { ghlContactId?: string } = {};
  try {
    body = (await request.json()) as { ghlContactId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const ghlContactId = body.ghlContactId ?? review.ghlContactId;
  if (!ghlContactId) {
    return NextResponse.json({ error: "A GHL customer match is required" }, { status: 400 });
  }

  try {
    const privacy = await previewPrivacyTransformation({ reviewId: review.id, ghlContactId });
    return NextResponse.json({ ok: true, privacy });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Privacy preview failed" },
      { status: 400 },
    );
  }
}
