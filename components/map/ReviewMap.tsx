"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
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
};

function createClusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div class="stm-cluster">${count}</div>`,
    className: "stm-cluster-wrap",
    iconSize: L.point(42, 42, true),
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
    map.fitBounds(bounds.pad(0.18), { maxZoom: 11, animate: false });
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

export default function ReviewMap({ locations, reviewCount, averageRating }: ReviewMapProps) {
  const tiles = getMapTileConfig();

  return (
    <div className="stm-map-root" role="application" aria-label="Approximate customer review locations across Southwest Florida">
      <MapHeader reviewCount={reviewCount} averageRating={averageRating} />
      <MapContainer
        center={SWFL_CENTER}
        zoom={SWFL_DEFAULT_ZOOM}
        className="stm-leaflet"
        scrollWheelZoom={false}
        attributionControl
        zoomControl
        dragging
        touchZoom
      >
        <TileLayer
          url={tiles.url}
          attribution={tiles.attribution}
          subdomains={tiles.subdomains}
          maxZoom={tiles.maxZoom}
        />
        <ScrollZoomOnInteract />
        <FitLocations locations={locations} />
        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          spiderfyOnMaxZoom
          disableClusteringAtZoom={13}
          maxClusterRadius={56}
          iconCreateFunction={createClusterIcon}
        >
          {locations.map((location) => (
            <ReviewMarker key={location.id} location={location} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      <p className="stm-map-hint">Click the map to enable zoom. Locations are approximate.</p>
    </div>
  );
}
