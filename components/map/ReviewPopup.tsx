"use client";

import type { PublicReviewLocation } from "@/lib/types";

type ReviewPopupProps = {
  location: PublicReviewLocation;
  previewMode: boolean;
};

function formatMonthYear(value: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function starLabel(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(Math.max(0, 5 - rating));
}

export function ReviewPopup({ location, previewMode }: ReviewPopupProps) {
  const place = [location.city, location.state].filter(Boolean).join(", ");
  const showVerified = !previewMode && location.verifiedGoogle;

  return (
    <article className="stm-popup">
      <p className="stm-popup-stars" aria-label={`${location.rating} out of 5 stars`}>
        {starLabel(location.rating)}
      </p>
      {location.review ? (
        <blockquote className="stm-popup-quote">“{location.review}”</blockquote>
      ) : null}
      <p className="stm-popup-byline">— {location.reviewer}</p>
      {place ? <p className="stm-popup-place">{place}</p> : null}
      {location.reviewDate ? (
        <p className="stm-popup-date">{formatMonthYear(location.reviewDate)}</p>
      ) : null}
      {showVerified ? (
        <p className="stm-popup-verified">✓ Verified Google review</p>
      ) : null}
      <p className="stm-popup-note">Approximate location</p>
    </article>
  );
}
