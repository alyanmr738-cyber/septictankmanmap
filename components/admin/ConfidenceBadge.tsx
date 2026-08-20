"use client";

type ConfidenceBadgeProps = {
  score: number | null;
  confidence?: "high" | "review" | "low";
};

export function ConfidenceBadge({ score, confidence }: ConfidenceBadgeProps) {
  if (score == null) {
    return <span className="stm-badge stm-badge-muted">No score</span>;
  }

  const tone = confidence ?? (score >= 90 ? "high" : score >= 70 ? "review" : "low");
  const label = tone === "high" ? "High confidence" : tone === "review" ? "Needs review" : "Low confidence";

  return (
    <span className={`stm-badge stm-badge-${tone}`}>
      {score}% · {label}
    </span>
  );
}
