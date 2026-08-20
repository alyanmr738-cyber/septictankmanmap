"use client";

type MapHeaderProps = {
  reviewCount: number;
  averageRating: number | null;
};

function stars(averageRating: number | null): string {
  const count = Math.max(0, Math.min(5, Math.round(averageRating ?? 5)));
  return "★".repeat(count) + "☆".repeat(5 - count);
}

export function MapHeader({ reviewCount, averageRating }: MapHeaderProps) {
  return (
    <div className="stm-map-overlay">
      <div className="stm-map-overlay-card">
        <p className="stm-map-kicker">Southwest Florida</p>
        <h1>Customers Across Southwest Florida</h1>
        <p className="stm-map-sub">Real customers. Real reviews.</p>
        <p className="stm-map-meta">
          <span className="stm-stars" aria-hidden="true">
            {stars(averageRating)}
          </span>
          <span>
            {reviewCount} Customer Review{reviewCount === 1 ? "" : "s"}
          </span>
        </p>
      </div>
    </div>
  );
}
