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
  const [query, setQuery] = useState(review.reviewerDisplayName);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revealedAddress, setRevealedAddress] = useState<string | null>(null);
  const [privacyPreview, setPrivacyPreview] = useState<string | null>(null);
  const [candidates, setCandidates] = useState(review.candidates);
  const [diagnostics, setDiagnostics] = useState(review.matchMetadata?.discoveryDiagnostics ?? null);

  const selected = useMemo(
    () => candidates.find((candidate) => candidate.ghlContactId === selectedId) ?? candidates[0] ?? null,
    [candidates, selectedId],
  );

  async function run(action: string, fn: () => Promise<Response>) {
    setBusy(action);
    setError(null);
    try {
      const response = await fn();
      const data = (await response.json()) as {
        error?: string;
        candidates?: typeof candidates;
        diagnostics?: NonNullable<typeof diagnostics>;
      };
      if (!response.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      if (data.candidates) {
        setCandidates(data.candidates);
      }
      if (data.diagnostics) {
        setDiagnostics(data.diagnostics);
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
        {review.matchMetadata?.manualImport ? (
          <span className="stm-badge stm-badge-muted">MANUAL IMPORT</span>
        ) : null}
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
        <section className="stm-match-panel">
          <h3>No automatic match</h3>
          {diagnostics?.messages?.length ? (
            <ul className="stm-reason-list">
              {diagnostics.messages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          ) : (
            <p className="stm-admin-copy">
              Search GoHighLevel manually below, or re-run discovery after CRM names are cleaned up.
            </p>
          )}
          {review.matchStatus === "unmatched" ? (
            <button
              type="button"
              className="stm-btn"
              disabled={busy !== null}
              onClick={() =>
                run("rematch", async () => {
                  const response = await fetch(`/api/admin/reviews/${review.id}/rematch`, {
                    method: "POST",
                  });
                  const data = (await response.json()) as {
                    error?: string;
                    candidates?: typeof candidates;
                    diagnostics?: NonNullable<typeof diagnostics>;
                  };
                  if (response.ok) {
                    if (data.candidates) setCandidates(data.candidates);
                    if (data.diagnostics) setDiagnostics(data.diagnostics);
                  }
                  return response;
                })
              }
            >
              {busy === "rematch" ? "Re-running discovery..." : "Re-run GHL discovery"}
            </button>
          ) : null}
        </section>
      )}

      {review.matchStatus !== "approved" ? (
        <>
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
            <label htmlFor={`search-${review.id}`}>Search GHL manually</label>
            <input
              id={`search-${review.id}`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={review.reviewerDisplayName}
            />
            <button type="submit" className="stm-btn stm-btn-primary" disabled={busy !== null}>
              {busy === "search" ? "Searching..." : "Search"}
            </button>
          </form>

          <CandidateList
            candidates={candidates}
            selectedId={selectedId}
            name={`match-${review.id}`}
            onChange={setSelectedId}
            legend={candidates.length > 0 ? "Results" : "Choose customer"}
          />
        </>
      ) : null}

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
          className="stm-btn stm-btn-primary"
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
          {busy === "match" ? "Linking..." : "Link customer"}
        </button>
        <button
          type="button"
          className="stm-btn"
          disabled={busy !== null || !selectedId}
          onClick={() =>
            run("privacy", async () => {
              const response = await fetch(`/api/admin/reviews/${review.id}/privacy-preview`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ghlContactId: selectedId }),
              });
              const data = (await response.json()) as {
                privacy?: {
                  geocoderResultLabel?: string;
                  displacementMeters?: number;
                  meetsMinimumDisplacement?: boolean;
                };
                error?: string;
              };
              if (response.ok && data.privacy) {
                setPrivacyPreview(
                  `${data.privacy.geocoderResultLabel} · Privacy displacement: ${(
                    (data.privacy.displacementMeters ?? 0) / 1000
                  ).toFixed(2)} km · Meets minimum: ${data.privacy.meetsMinimumDisplacement ? "yes" : "no"}`,
                );
              }
              return response;
            })
          }
        >
          Privacy preview
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
      {privacyPreview ? <p className="stm-reveal">{privacyPreview}</p> : null}
      {error ? <p className="stm-error">{error}</p> : null}
    </article>
  );
}
