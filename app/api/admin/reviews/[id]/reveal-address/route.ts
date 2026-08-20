import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guard";
import { getContact } from "@/lib/integrations/ghl/getContact";
import { logger } from "@/lib/logger";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { ghlContactId?: string } | null;
  if (!body?.ghlContactId) {
    return NextResponse.json({ error: "A customer is required" }, { status: 400 });
  }

  const contact = await getContact(body.ghlContactId);
  if (!contact?.address1 && !contact?.city) {
    return NextResponse.json({ error: "No address is available for this customer" }, { status: 404 });
  }

  logger.info("Admin revealed a customer address", { reviewId: id });

  const line = [contact.address1, contact.city, contact.state, contact.postalCode]
    .filter(Boolean)
    .join(", ");

  return NextResponse.json(
    { addressLine: line },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
