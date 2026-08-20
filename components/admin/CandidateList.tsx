"use client";

import type { MatchCandidate } from "@/lib/types";

type CandidateListProps = {
  candidates: MatchCandidate[];
  selectedId: string | null;
  name: string;
  onChange: (ghlContactId: string) => void;
  legend?: string;
};

function formatDate(value?: string | null): string {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function primaryReason(candidate: MatchCandidate): string | null {
  const preferred = candidate.reasons.find(
    (reason) =>
      reason.points > 0 &&
      reason.code !== "valid_address" &&
      reason.code !== "identity_source",
  );
  return preferred?.label ?? null;
}

export function CandidateList({
  candidates,
  selectedId,
  name,
  onChange,
  legend = "Choose customer",
}: CandidateListProps) {
  if (candidates.length === 0) {
    return <p className="stm-admin-copy">No customer candidates were found.</p>;
  }

  return (
    <fieldset className="stm-candidate-list">
      <legend>{legend}</legend>
      {candidates.map((candidate) => {
        const place = [candidate.city, candidate.state].filter(Boolean).join(", ");
        const reason = primaryReason(candidate);
        return (
          <label key={candidate.ghlContactId} className="stm-candidate">
            <input
              type="radio"
              name={name}
              value={candidate.ghlContactId}
              checked={selectedId === candidate.ghlContactId}
              onChange={() => onChange(candidate.ghlContactId)}
            />
            <span>
              <strong>
                {candidate.displayName}
                {place ? ` — ${place}` : ""}
              </strong>
              <small>
                {candidate.score}% confidence
                {candidate.confidence === "low" ? " (low)" : ""}
                {candidate.hasAddress ? " · Address on file" : " · No address"}
              </small>
              {reason ? <small>{reason}</small> : null}
              <small>Last activity: {formatDate(candidate.lastCustomerActivity ?? candidate.serviceCompletedAt)}</small>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
