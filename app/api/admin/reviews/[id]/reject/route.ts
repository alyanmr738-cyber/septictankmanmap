import { requireAdmin } from "@/lib/auth/guard";
import { rejectReview } from "@/lib/approval/approveReview";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth !== true) return auth;
  const { id } = await context.params;
  return rejectReview(id);
}
