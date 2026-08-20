"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ImportReviewForm() {
  const router = useRouter();
  const [reviewerDisplayName, setReviewerDisplayName] = useState("");
  const [rating, setRating] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const [reviewCreatedAt, setReviewCreatedAt] = useState("");
  const [googleReviewId, setGoogleReviewId] = useState("");
  const [replacePipelinePlaceholder, setReplacePipelinePlaceholder] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/admin/reviews/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerDisplayName,
          rating: Number(rating),
          reviewText,
          reviewCreatedAt,
          googleReviewId: googleReviewId.trim() || null,
          replacePipelinePlaceholder,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        matchStatus?: string;
        matchConfidence?: number | null;
        removedPipelinePlaceholders?: number;
        queuePath?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Import failed.");
        return;
      }

      setResult(
        `Imported into ${data.matchStatus} queue (${data.matchConfidence ?? 0}% confidence).` +
          (data.removedPipelinePlaceholders
            ? ` Removed ${data.removedPipelinePlaceholders} pipeline placeholder record(s).`
            : ""),
      );
      router.push(data.queuePath ?? "/admin?status=pending");
      router.refresh();
    } catch {
      setError("Import failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="stm-import-card">
      <h2>Import Real Google Review</h2>
      <p className="stm-admin-copy">
        Manual import uses the same GHL search, scoring, and approval workflow as automated Google
        sync. It does not publish directly to the map.
      </p>
      <form className="stm-import-form" onSubmit={onSubmit}>
        <label>
          Google reviewer display name
          <input
            value={reviewerDisplayName}
            onChange={(event) => setReviewerDisplayName(event.target.value)}
            placeholder="John Drier"
            required
          />
        </label>
        <label>
          Star rating
          <select value={rating} onChange={(event) => setRating(event.target.value)}>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </label>
        <label>
          Review text
          <textarea
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            rows={4}
            required
          />
        </label>
        <label>
          Review date
          <input
            type="date"
            value={reviewCreatedAt}
            onChange={(event) => setReviewCreatedAt(event.target.value)}
            required
          />
        </label>
        <label>
          Google review ID (optional)
          <input
            value={googleReviewId}
            onChange={(event) => setGoogleReviewId(event.target.value)}
            placeholder="Only if copied from Google"
          />
        </label>
        <label className="stm-import-checkbox">
          <input
            type="checkbox"
            checked={replacePipelinePlaceholder}
            onChange={(event) => setReplacePipelinePlaceholder(event.target.checked)}
          />
          Replace pipeline placeholder for this reviewer
        </label>
        <button type="submit" className="stm-btn stm-btn-primary" disabled={busy}>
          {busy ? "Importing..." : "Import review"}
        </button>
      </form>
      {result ? <p className="stm-import-success">{result}</p> : null}
      {error ? <p className="stm-error">{error}</p> : null}
    </section>
  );
}
