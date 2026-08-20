import { MapShell } from "@/components/map/MapShell";
import { getPublicMapData } from "@/lib/database/public-map";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  try {
    const data = await getPublicMapData();
    return <MapShell data={data} />;
  } catch (error) {
    logger.error("Public map page failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return <MapShell data={null} error />;
  }
}
