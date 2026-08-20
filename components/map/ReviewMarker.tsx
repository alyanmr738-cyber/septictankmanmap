"use client";

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import type { PublicReviewLocation } from "@/lib/types";
import { ReviewPopup } from "@/components/map/ReviewPopup";

const pinIcon = L.divIcon({
  className: "stm-marker",
  html: '<span class="stm-marker-pin" aria-hidden="true"></span>',
  iconSize: [32, 41],
  iconAnchor: [16, 41],
  popupAnchor: [0, -32],
});

export function ReviewMarker({
  location,
  previewMode,
}: {
  location: PublicReviewLocation;
  previewMode: boolean;
}) {
  return (
    <Marker
      position={[location.lat, location.lng]}
      icon={pinIcon}
      title={`${location.city}, ${location.state} review from ${location.reviewer}`}
      keyboard
    >
      <Popup className="stm-popup-wrap" minWidth={260} maxWidth={300}>
        <ReviewPopup location={location} previewMode={previewMode} />
      </Popup>
    </Marker>
  );
}
