import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCron } from "@/lib/security/cron";
import { syncReviews } from "@/lib/sync/syncReviews";
import { logger } from "@/lib/logger";
import { GoogleReviewsNotConfiguredError } from "@/lib/integrations/google-reviews/client";
import { GhlNotConfiguredError } from "@/lib/integrations/ghl/client";

async function handle(request: NextRequest) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncReviews();
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof GoogleReviewsNotConfiguredError || error instanceof GhlNotConfiguredError) {
      logger.warn("Review sync skipped because an integration is not configured");
      return NextResponse.json(
        { error: "Integration is not configured. Enable MOCK_MODE or add credentials." },
        { status: 503 },
      );
    }
    logger.error("Review sync failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
