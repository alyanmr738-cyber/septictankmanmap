"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BatchRowResult = {
  lineNumber: number;
  reviewerDisplayName: string;
  status: "imported" | "skipped" | "failed";
  matchStatus?: string;
  matchConfidence?: number | null;
  candidateCount?: number;
  message?: string;
};

type BatchImportResponse = {
  error?: string;
  imported?: number;
  skipped?: number;
  failed?: number;
  totalRows?: number;
  queueCounts?: Record<string, number>;
  rows?: BatchRowResult[];
  parseErrors?: Array<{ lineNumber: number; message: string }>;
};

export function ImportCsvForm() {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BatchImportResponse | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/admin/reviews/import-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv, skipDuplicates }),
      });
      const data = (await response.json()) as BatchImportResponse;

      if (!response.ok) {
        setError(data.error ?? "CSV import failed.");
        if (data.parseErrors?.length) {
          setResult(data);
        }
        return;
      }

      setResult(data);
      router.refresh();
    } catch {
      setError("CSV import failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="stm-import-card">
      <h2>Batch Import Google Reviews (CSV)</h2>
      <p className="stm-admin-copy">
        Each row uses the same GHL matching and approval workflow as single review import. Reviews
        land in pending, needs review, or unmatched — never directly on the map.
      </p>
      <p className="stm-admin-copy">
        Required columns: <code>reviewer_name</code>, <code>rating</code>, <code>review_text</code>,{" "}
        <code>review_date</code>. Optional: <code>source</code>, <code>google_review_id</code>.
      </p>
      <p className="stm-admin-copy">
        <Link href="/phase1-google-reviews.csv">Download phase-1 sample CSV (14 full-name reviews)</Link>
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
        <label className="stm-import-checkbox">
          <input
            type="checkbox"
            checked={skipDuplicates}
            onChange={(event) => setSkipDuplicates(event.target.checked)}
          />
          Skip rows already imported for the same reviewer and date
        </label>
        <button type="submit" className="stm-btn stm-btn-primary" disabled={busy}>
          {busy ? "Importing batch..." : "Import CSV batch"}
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
            Imported {result.imported ?? 0}, skipped {result.skipped ?? 0}, failed {result.failed ?? 0}
          </h3>
          {result.queueCounts ? (
            <p className="stm-admin-copy">
              Pending {result.queueCounts.pending ?? 0} · Needs review{" "}
              {result.queueCounts.needs_review ?? 0} · Unmatched {result.queueCounts.unmatched ?? 0}
            </p>
          ) : null}
          <div className="stm-batch-table-wrap">
            <table className="stm-batch-table">
              <thead>
                <tr>
                  <th>Line</th>
                  <th>Reviewer</th>
                  <th>Result</th>
                  <th>Queue</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={`${row.lineNumber}-${row.reviewerDisplayName}`}>
                    <td>{row.lineNumber}</td>
                    <td>{row.reviewerDisplayName}</td>
                    <td>{row.status}</td>
                    <td>{row.matchStatus ?? row.message ?? "—"}</td>
                    <td>{row.matchConfidence != null ? `${row.matchConfidence}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="stm-actions">
            <Link className="stm-btn stm-btn-primary" href="/admin?status=pending">
              Open pending queue
            </Link>
            <Link className="stm-btn" href="/admin?status=needs_review">
              Open needs review
            </Link>
            <Link className="stm-btn" href="/admin?status=unmatched">
              Open unmatched
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
