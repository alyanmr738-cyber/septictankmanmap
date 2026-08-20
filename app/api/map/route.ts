import { NextRequest, NextResponse } from "next/server";
import { getPublicMapData } from "@/lib/database/public-map";
import { jsonContainsForbiddenPublicFields } from "@/lib/privacy/sanitizePublicReview";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const data = await getPublicMapData();
    const leaked = jsonContainsForbiddenPublicFields(data);
    if (leaked.length > 0) {
      logger.error("Public map payload contained forbidden fields", { leaked });
      return NextResponse.json(
        { locations: [], reviewCount: 0, averageRating: null },
        { status: 500, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    logger.error("Public map API failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json(
      { locations: [], reviewCount: 0, averageRating: null },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, { status: 204 });
}
