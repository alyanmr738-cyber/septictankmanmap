"use client";

import type { PublicReviewLocation } from "@/lib/types";

function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function starLabel(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(Math.max(0, 5 - rating));
}

export function ReviewPopup({ location }: { location: PublicReviewLocation }) {
  const place = [location.city, location.state].filter(Boolean).join(", ");

  return (
    <article className="stm-popup">
      <p className="stm-stars" aria-label={`${location.rating} out of 5 stars`}>
        {starLabel(location.rating)}
      </p>
      {place ? <h2>{place}</h2> : null}
      {location.review ? <blockquote>“{location.review}”</blockquote> : null}
      <p className="stm-popup-byline">— {location.reviewer}</p>
      {location.reviewDate ? <p className="stm-popup-date">{formatDate(location.reviewDate)}</p> : null}
      <p className="stm-popup-note">Approximate customer location</p>
    </article>
  );
}
