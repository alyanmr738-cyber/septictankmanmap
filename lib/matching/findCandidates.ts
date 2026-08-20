import type { GhlContact, GhlContactCandidate, GoogleReview, MatchCandidate, MatchStatus } from "@/lib/types";
import { scoreMatch } from "@/lib/matching/scoreMatch";
import { namesAreExactMatch, normalizeName, splitPersonName } from "@/lib/matching/normalizeName";
import type { CustomerActivitySignals } from "@/lib/types";

export type FindCandidatesInput = {
  review: Pick<GoogleReview, "reviewerDisplayName" | "createTime">;
  contacts: GhlContact[];
  signalsByContactId?: Record<string, CustomerActivitySignals>;
};

export type FindCandidatesResult = {
  status: Extract<MatchStatus, "matched" | "needs_review" | "unmatched">;
  candidates: MatchCandidate[];
  bestScore: number | null;
};

function displayNameFor(contact: GhlContact): string {
  const combined = [contact.firstName, contact.lastName].filter(Boolean).join(" ").trim();
  return contact.name?.trim() || combined || "Unknown contact";
}

function hasUsableAddress(contact: GhlContact): boolean {
  return Boolean(contact.city || contact.address1);
}

function toCandidate(contact: GhlContact, signals?: CustomerActivitySignals): GhlContactCandidate {
  return {
    ghlContactId: contact.id,
    displayName: displayNameFor(contact),
    city: contact.city,
    state: contact.state,
    hasAddress: hasUsableAddress(contact),
    lastCustomerActivity: signals?.lastCustomerActivity ?? contact.lastActivity ?? null,
    serviceCompletedAt: signals?.serviceCompletedAt ?? null,
    reviewRequestAt: signals?.reviewRequestAt ?? null,
  };
}

export function findCandidates(input: FindCandidatesInput): FindCandidatesResult {
  const googleName = splitPersonName(input.review.reviewerDisplayName);

  if (!googleName.full || googleName.full.length < 3 || (!googleName.last && googleName.first.length < 4)) {
    return { status: "unmatched", candidates: [], bestScore: null };
  }

  const sameNameCount = new Map<string, number>();
  for (const contact of input.contacts) {
    const key = normalizeName(displayNameFor(contact));
    sameNameCount.set(key, (sameNameCount.get(key) ?? 0) + 1);
  }

  const scored: MatchCandidate[] = input.contacts.map((contact) => {
    const candidate = toCandidate(contact, input.signalsByContactId?.[contact.id]);
    const sameNameKey = normalizeName(candidate.displayName);
    const result = scoreMatch({
      googleDisplayName: input.review.reviewerDisplayName,
      reviewCreatedAt: input.review.createTime,
      candidateName: candidate.displayName,
      candidateCountWithSameName: sameNameCount.get(sameNameKey) ?? 1,
      hasValidAddress: candidate.hasAddress,
      signals: {
        lastCustomerActivity: candidate.lastCustomerActivity,
        serviceCompletedAt: candidate.serviceCompletedAt,
        reviewRequestAt: candidate.reviewRequestAt,
      },
    });

    return {
      ...candidate,
      score: result.score,
      confidence: result.confidence,
      reasons: result.reasons,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const exactMatches = scored.filter((candidate) =>
    namesAreExactMatch(input.review.reviewerDisplayName, candidate.displayName),
  );
  const viable = scored.filter((candidate) => candidate.score >= 40);
  const top = viable[0] ?? scored[0];

  if (exactMatches.length > 1) {
    return {
      status: "needs_review",
      candidates: scored.slice(0, 8),
      bestScore: top?.score ?? null,
    };
  }

  if (!top || top.score < 70) {
    return {
      status: "unmatched",
      candidates: scored.filter((candidate) => candidate.score > 0).slice(0, 8),
      bestScore: top?.score ?? null,
    };
  }

  const closeCompetitors = viable.filter(
    (candidate) => candidate.ghlContactId !== top.ghlContactId && top.score - candidate.score <= 12,
  );

  if (closeCompetitors.length > 0 || top.confidence === "review") {
    return {
      status: "needs_review",
      candidates: viable.slice(0, 8),
      bestScore: top.score,
    };
  }

  return {
    status: top.confidence === "high" ? "matched" : "needs_review",
    candidates: viable.slice(0, 8),
    bestScore: top.score,
  };
}
