"use client";

import type { MatchCandidate } from "@/lib/types";

type CandidateListProps = {
  candidates: MatchCandidate[];
  selectedId: string | null;
  name: string;
  onChange: (ghlContactId: string) => void;
};

function formatDate(value?: string | null): string {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function CandidateList({ candidates, selectedId, name, onChange }: CandidateListProps) {
  if (candidates.length === 0) {
    return <p className="stm-admin-copy">No customer candidates were found.</p>;
  }

  return (
    <fieldset className="stm-candidate-list">
      <legend>Choose Customer</legend>
      {candidates.map((candidate) => {
        const place = [candidate.city, candidate.state].filter(Boolean).join(", ");
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
                {candidate.score}% match
                {candidate.hasAddress ? " · Address on file" : " · No address"}
              </small>
              <small>Last activity: {formatDate(candidate.lastCustomerActivity ?? candidate.serviceCompletedAt)}</small>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
