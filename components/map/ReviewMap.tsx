"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import { MapHeader } from "@/components/map/MapHeader";
import { ReviewMarker } from "@/components/map/ReviewMarker";
import { getMapTileConfig, SWFL_CENTER, SWFL_DEFAULT_ZOOM } from "@/lib/map/tiles";
import type { PublicReviewLocation } from "@/lib/types";

type ReviewMapProps = {
  locations: PublicReviewLocation[];
  reviewCount: number;
  averageRating: number | null;
  previewMode: boolean;
};

function createClusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div class="stm-cluster">${count}</div>`,
    className: "stm-cluster-wrap",
    iconSize: L.point(46, 46, true),
  });
}

function FitLocations({ locations }: { locations: PublicReviewLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) {
      map.setView(SWFL_CENTER, SWFL_DEFAULT_ZOOM);
      return;
    }
    const bounds = L.latLngBounds(locations.map((location) => [location.lat, location.lng]));
    map.fitBounds(bounds.pad(0.1), {
      maxZoom: 12,
      animate: false,
      paddingTopLeft: [12, 88],
      paddingBottomRight: [12, 36],
    });
  }, [locations, map]);

  return null;
}

function ScrollZoomOnInteract() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const enable = () => {
      map.scrollWheelZoom.enable();
      container.classList.add("is-active");
    };
    const disable = () => {
      map.scrollWheelZoom.disable();
      container.classList.remove("is-active");
    };

    map.scrollWheelZoom.disable();
    map.on("click", enable);
    map.on("focus", enable);
    container.addEventListener("mouseleave", disable);

    return () => {
      map.off("click", enable);
      map.off("focus", enable);
      container.removeEventListener("mouseleave", disable);
    };
  }, [map]);

  return null;
}

export default function ReviewMap({
  locations,
  reviewCount,
  averageRating,
  previewMode,
}: ReviewMapProps) {
  const tiles = getMapTileConfig();

  return (
    <div
      className="stm-map-root"
      role="application"
      aria-label="Approximate customer review locations across Southwest Florida"
    >
      <MapHeader
        reviewCount={reviewCount}
        averageRating={averageRating}
        previewMode={previewMode}
      />
      <MapContainer
        center={SWFL_CENTER}
        zoom={SWFL_DEFAULT_ZOOM}
        className="stm-leaflet"
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl
        dragging
        touchZoom
      >
        <TileLayer
          url={tiles.url}
          attribution={tiles.attribution}
          subdomains={tiles.subdomains}
          maxZoom={tiles.maxZoom}
          className="stm-map-tiles"
        />
        <ZoomControl position="bottomright" />
        <ScrollZoomOnInteract />
        <FitLocations locations={locations} />
        <MarkerClusterGroup
          chunkedLoading
          animate
          animateAddingMarkers
          showCoverageOnHover={false}
          spiderfyOnMaxZoom
          zoomToBoundsOnClick
          removeOutsideVisibleBounds
          disableClusteringAtZoom={14}
          maxClusterRadius={48}
          spiderfyDistanceMultiplier={1.6}
          iconCreateFunction={createClusterIcon}
        >
          {locations.map((location) => (
            <ReviewMarker
              key={location.id}
              location={location}
              previewMode={previewMode}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      <p className="stm-map-hint">Click to explore • Locations approximate</p>
    </div>
  );
}
