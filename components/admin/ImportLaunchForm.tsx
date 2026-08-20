"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LaunchRowResult = {
  lineNumber: number;
  reviewerDisplayName: string;
  status: "published" | "skipped" | "failed";
  locationSource?: "ghl_verified" | "service_area_estimate";
  reviewId?: string;
  message?: string;
};

type LaunchImportResponse = {
  error?: string;
  published?: number;
  skipped?: number;
  failed?: number;
  totalRows?: number;
  ghlVerified?: number;
  serviceAreaEstimate?: number;
  rows?: LaunchRowResult[];
  parseErrors?: Array<{ lineNumber: number; message: string }>;
};

export function ImportLaunchForm() {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [minRating, setMinRating] = useState(4);
  const [tryGhlEnrichment, setTryGhlEnrichment] = useState(false);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LaunchImportResponse | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/admin/reviews/import-launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv, minRating, tryGhlEnrichment, skipDuplicates }),
      });
      const data = (await response.json()) as LaunchImportResponse;

      if (!response.ok) {
        setError(data.error ?? "Launch import failed.");
        if (data.parseErrors?.length) {
          setResult(data);
        }
        return;
      }

      setResult(data);
      router.refresh();
    } catch {
      setError("Launch import failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="stm-import-card">
      <h2>Launch Import — Publish 4★ and 5★ Reviews to Map</h2>
      <p className="stm-admin-copy">
        Reviews publish immediately with approximate service-area pins. GHL matching is optional
        enrichment — it never blocks publication.
      </p>
      <p className="stm-admin-copy">
        Required columns: <code>reviewer_name</code>, <code>rating</code>, <code>review_text</code>,{" "}
        <code>review_date</code>. Optional: <code>source</code>, <code>google_review_id</code>.
      </p>
      <p className="stm-admin-copy">
        <Link href="/launch-google-reviews.csv">
          Download launch CSV ({`rating >= ${minRating}`} reviews)
        </Link>
      </p>
      <form className="stm-import-form" onSubmit={onSubmit}>
        <label>
          CSV file or pasted export
          <textarea
            value={csv}
            onChange={(event) => setCsv(event.target.value)}
            rows={12}
            placeholder={"reviewer_name,rating,review_text,review_date,source\nMonika Wooten,5,\"I needed an inspection...\",2026-08-18,google_manual"}
            required
          />
        </label>
        <label>
          Minimum rating
          <select
            value={minRating}
            onChange={(event) => setMinRating(Number(event.target.value))}
          >
            <option value={4}>4 stars and above</option>
            <option value={5}>5 stars only</option>
          </select>
        </label>
        <label className="stm-import-checkbox">
          <input
            type="checkbox"
            checked={tryGhlEnrichment}
            onChange={(event) => setTryGhlEnrichment(event.target.checked)}
          />
          Try GHL enrichment when a high-confidence match exists (fallback to service area)
        </label>
        <label className="stm-import-checkbox">
          <input
            type="checkbox"
            checked={skipDuplicates}
            onChange={(event) => setSkipDuplicates(event.target.checked)}
          />
          Skip rows already published for the same reviewer and date
        </label>
        <button type="submit" className="stm-btn stm-btn-primary" disabled={busy}>
          {busy ? "Publishing to map..." : "Publish launch batch to map"}
        </button>
      </form>

      {error ? <p className="stm-error">{error}</p> : null}

      {result?.parseErrors?.length ? (
        <div className="stm-batch-summary">
          <h3>Parse warnings</h3>
          <ul className="stm-batch-list">
            {result.parseErrors.map((row) => (
              <li key={`parse-${row.lineNumber}`}>
                Line {row.lineNumber}: {row.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {result?.rows?.length ? (
        <div className="stm-batch-summary">
          <h3>
            Published {result.published ?? 0}, skipped {result.skipped ?? 0}, failed{" "}
            {result.failed ?? 0}
          </h3>
          <p className="stm-admin-copy">
            GHL verified {result.ghlVerified ?? 0} · Service area estimate{" "}
            {result.serviceAreaEstimate ?? 0}
          </p>
          <div className="stm-batch-table-wrap">
            <table className="stm-batch-table">
              <thead>
                <tr>
                  <th>Line</th>
                  <th>Reviewer</th>
                  <th>Result</th>
                  <th>Location source</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={`${row.lineNumber}-${row.reviewerDisplayName}`}>
                    <td>{row.lineNumber}</td>
                    <td>{row.reviewerDisplayName}</td>
                    <td>{row.status === "failed" ? row.message : row.status}</td>
                    <td>{row.locationSource ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="stm-actions">
            <Link className="stm-btn stm-btn-primary" href="/map">
              View public map
            </Link>
            <Link className="stm-btn" href="/admin?status=approved">
              Open approved queue
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
