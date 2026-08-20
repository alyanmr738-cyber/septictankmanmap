import { notFound } from "next/navigation";
import { MapShell } from "@/components/map/MapShell";
import { getPublicMapData } from "@/lib/database/public-map";
import { isMockMode } from "@/lib/env";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export default async function MapEmbedPreviewPage() {
  if (!isMockMode() && process.env.NODE_ENV === "production") {
    notFound();
  }

  const previewMode = isMockMode();

  try {
    const data = await getPublicMapData();
    return (
      <div className="stm-embed-preview-page">
        <p className="stm-embed-preview-label">
          Embed preview · 720×720 · WordPress left-column target
        </p>
        <div className="stm-embed-preview-frame">
          <MapShell data={data} previewMode={previewMode} />
        </div>
      </div>
    );
  } catch (error) {
    logger.error("Embed preview map page failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return (
      <div className="stm-embed-preview-page">
        <p className="stm-embed-preview-label">Embed preview · 720×720</p>
        <div className="stm-embed-preview-frame">
          <MapShell data={null} previewMode={previewMode} error />
        </div>
      </div>
    );
  }
}
