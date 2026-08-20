"use client";

type MapHeaderProps = {
  reviewCount: number;
  averageRating: number | null;
  previewMode: boolean;
};

function stars(averageRating: number | null): string {
  const count = Math.max(0, Math.min(5, Math.round(averageRating ?? 5)));
  return "★".repeat(count) + "☆".repeat(5 - count);
}

function reviewMeta(reviewCount: number, averageRating: number | null): string {
  const starLine = stars(averageRating);
  if (averageRating != null && reviewCount > 0) {
    const formatted = Number.isInteger(averageRating)
      ? averageRating.toFixed(0)
      : averageRating.toFixed(1);
    return `${starLine} ${formatted} · ${reviewCount.toLocaleString()} Google Reviews`;
  }
  return `${starLine} ${reviewCount.toLocaleString()} Review${reviewCount === 1 ? "" : "s"}`;
}

export function MapHeader({ reviewCount, averageRating, previewMode }: MapHeaderProps) {
  if (previewMode) {
    return (
      <div className="stm-map-overlay">
        <div className="stm-map-overlay-card stm-map-overlay-card--compact stm-map-overlay-card--preview">
          <p className="stm-map-kicker">Customer Map Preview</p>
          <h1>Southwest Florida Service Coverage</h1>
          <p className="stm-map-sub">Demo locations for layout testing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stm-map-overlay">
      <div className="stm-map-overlay-card stm-map-overlay-card--compact">
        <h1>Trusted Across Southwest Florida</h1>
        <p className="stm-map-sub stm-map-sub--production">Real Customers. Real Reviews.</p>
        <p className="stm-map-meta stm-map-meta--compact" aria-label={`${reviewCount} reviews`}>
          {reviewMeta(reviewCount, averageRating)}
        </p>
      </div>
    </div>
  );
}
