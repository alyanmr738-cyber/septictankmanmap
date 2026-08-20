"use client";

import dynamic from "next/dynamic";
import { MapEmptyState, MapErrorState, MapSkeleton } from "@/components/map/MapStates";
import type { PublicMapResponse } from "@/lib/types";

const ReviewMap = dynamic(() => import("@/components/map/ReviewMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

type MapShellProps = {
  data: PublicMapResponse | null;
  previewMode: boolean;
  error?: boolean;
};

export function MapShell({ data, previewMode, error = false }: MapShellProps) {
  if (error) {
    return <MapErrorState />;
  }
  if (!data || data.locations.length === 0) {
    return <MapEmptyState />;
  }
  return (
    <ReviewMap
      locations={data.locations}
      reviewCount={data.reviewCount}
      averageRating={data.averageRating}
      previewMode={previewMode}
    />
  );
}
