"use client";

export function MapSkeleton() {
  return (
    <div
      className="stm-map-root stm-map-state"
      role="status"
      aria-live="polite"
      aria-label="Loading customer locations"
    >
      <div className="stm-map-state-card">
        <div className="stm-map-pulse" />
        <p>Loading customer locations...</p>
      </div>
    </div>
  );
}

export function MapErrorState() {
  return (
    <div className="stm-map-root stm-map-state" role="alert">
      <div className="stm-map-state-card">
        <p>Customer map temporarily unavailable.</p>
      </div>
    </div>
  );
}

export function MapEmptyState() {
  return (
    <div className="stm-map-root stm-map-state">
      <div className="stm-map-state-card">
        <p>Customer locations are being added.</p>
      </div>
    </div>
  );
}
