import { MapShell } from "@/components/map/MapShell";
import { getPublicMapData } from "@/lib/database/public-map";
import { isMockMode } from "@/lib/env";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const previewMode = isMockMode();

  try {
    const data = await getPublicMapData();
    return <MapShell data={data} previewMode={previewMode} />;
  } catch (error) {
    logger.error("Public map page failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return <MapShell data={null} previewMode={previewMode} error />;
  }
}
