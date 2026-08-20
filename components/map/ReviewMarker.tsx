"use client";

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import type { PublicReviewLocation } from "@/lib/types";
import { ReviewPopup } from "@/components/map/ReviewPopup";

const pinIcon = L.divIcon({
  className: "stm-marker",
  html: '<span class="stm-marker-pin" aria-hidden="true"></span>',
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -28],
});

export function ReviewMarker({ location }: { location: PublicReviewLocation }) {
  return (
    <Marker
      position={[location.lat, location.lng]}
      icon={pinIcon}
      title={`${location.city}, ${location.state} review from ${location.reviewer}`}
      keyboard
    >
      <Popup>
        <ReviewPopup location={location} />
      </Popup>
    </Marker>
  );
}
