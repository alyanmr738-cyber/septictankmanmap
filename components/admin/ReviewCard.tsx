"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CandidateList } from "@/components/admin/CandidateList";
import { ConfidenceBadge } from "@/components/admin/ConfidenceBadge";
import type { AdminReviewCard } from "@/lib/types";

function formatDate(value: string | null): string {
  if (!value) return "Unknown date";
  const date = new Date(value);
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

export function ReviewCard({ review }: { review: AdminReviewCard }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(review.selectedCandidateId);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revealedAddress, setRevealedAddress] = useState<string | null>(null);
  const [candidates, setCandidates] = useState(review.candidates);

  const selected = useMemo(
    () => candidates.find((candidate) => candidate.ghlContactId === selectedId) ?? candidates[0] ?? null,
    [candidates, selectedId],
  );

  async function run(action: string, fn: () => Promise<Response>) {
    setBusy(action);
    setError(null);
    try {
      const response = await fn();
      const data = (await response.json()) as { error?: string; candidates?: typeof candidates };
      if (!response.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      if (data.candidates) {
        setCandidates(data.candidates);
      }
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <article className="stm-review-card">
      <header>
        <p className="stm-stars" aria-label={`${review.rating} out of 5 stars`}>
          {starLabel(review.rating)}
        </p>
        <h2>{review.reviewerDisplayName}</h2>
        {review.isSeed ? <span className="stm-badge stm-badge-muted">SEED</span> : null}
        <ConfidenceBadge score={review.matchConfidence} />
      </header>

      {review.reviewText ? <blockquote>“{review.reviewText}”</blockquote> : null}
      <p className="stm-admin-copy">Google Review Date {formatDate(review.reviewCreatedAt)}</p>

      {selected ? (
        <section className="stm-match-panel">
          <h3>Suggested GHL Match</h3>
          <p>
            <strong>{selected.displayName}</strong>
            {selected.city ? ` · ${selected.city}${selected.state ? `, ${selected.state}` : ""}` : ""}
          </p>
          <p className="stm-admin-copy">
            Recent activity:{" "}
            {formatDate(selected.serviceCompletedAt ?? selected.lastCustomerActivity ?? null)}
          </p>
          <ul className="stm-reason-list">
            {selected.reasons.map((reason) => (
              <li key={`${reason.code}-${reason.label}`}>
                {reason.points >= 0 ? "✓" : "–"} {reason.label}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="stm-admin-copy">No automatic match. Search GoHighLevel or ignore this review.</p>
      )}

      {review.matchStatus !== "approved" ? (
        <CandidateList
          candidates={candidates}
          selectedId={selectedId}
          name={`match-${review.id}`}
          onChange={setSelectedId}
        />
      ) : null}

      <form
        className="stm-search-row"
        onSubmit={(event) => {
          event.preventDefault();
          void run("search", () =>
            fetch(`/api/admin/reviews/${review.id}/search`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query }),
            }),
          );
        }}
      >
        <label htmlFor={`search-${review.id}`}>Search GHL</label>
        <input
          id={`search-${review.id}`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Customer name"
        />
        <button type="submit" disabled={busy !== null}>
          Search
        </button>
      </form>

      <div className="stm-actions">
        <button
          type="button"
          className="stm-btn stm-btn-primary"
          disabled={busy !== null || !selectedId}
          onClick={() =>
            run("approve", () =>
              fetch(`/api/admin/reviews/${review.id}/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ghlContactId: selectedId }),
              }),
            )
          }
        >
          {busy === "approve" ? "Approving..." : "Approve"}
        </button>
        <button
          type="button"
          className="stm-btn"
          disabled={busy !== null || !selectedId}
          onClick={() =>
            run("match", () =>
              fetch(`/api/admin/reviews/${review.id}/match`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ghlContactId: selectedId }),
              }),
            )
          }
        >
          Confirm Match
        </button>
        <button
          type="button"
          className="stm-btn stm-btn-danger"
          disabled={busy !== null}
          onClick={() =>
            run("reject", () =>
              fetch(`/api/admin/reviews/${review.id}/reject`, {
                method: "POST",
              }),
            )
          }
        >
          Reject
        </button>
        <button
          type="button"
          className="stm-btn"
          disabled={busy !== null || !selectedId}
          onClick={() =>
            run("address", async () => {
              const response = await fetch(`/api/admin/reviews/${review.id}/reveal-address`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ghlContactId: selectedId }),
              });
              const data = (await response.json()) as { addressLine?: string; error?: string };
              if (response.ok && data.addressLine) {
                setRevealedAddress(data.addressLine);
              }
              return response;
            })
          }
        >
          Reveal address
        </button>
      </div>

      {revealedAddress ? <p className="stm-reveal">Temporary address view: {revealedAddress}</p> : null}
      {error ? <p className="stm-error">{error}</p> : null}
    </article>
  );
}
