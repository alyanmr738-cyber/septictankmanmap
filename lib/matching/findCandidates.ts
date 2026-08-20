import type {
  GhlContact,
  GhlContactCandidate,
  GoogleReview,
  MatchCandidate,
  MatchDiscoveryDiagnostics,
  MatchStatus,
} from "@/lib/types";
import {
  extractContactNameVariants,
  getPrimaryDisplayName,
} from "@/lib/integrations/ghl/contactIdentity";
import { scoreMatch } from "@/lib/matching/scoreMatch";
import {
  abbreviatedNameMatchKey,
  firstNameAndLastInitialMatch,
  namesAreExactMatch,
  normalizeName,
  splitPersonName,
} from "@/lib/matching/normalizeName";
import type { CustomerActivitySignals } from "@/lib/types";

export type FindCandidatesInput = {
  review: Pick<GoogleReview, "reviewerDisplayName" | "createTime">;
  contacts: GhlContact[];
  signalsByContactId?: Record<string, CustomerActivitySignals>;
  discovery?: Pick<MatchDiscoveryDiagnostics, "strategiesAttempted" | "messages">;
  /** Manual admin search: include low-confidence scored contacts for human review. */
  includeWeakCandidates?: boolean;
};

export type FindCandidatesResult = {
  status: Extract<MatchStatus, "matched" | "needs_review" | "unmatched">;
  candidates: MatchCandidate[];
  bestScore: number | null;
  diagnostics: MatchDiscoveryDiagnostics;
};

function hasUsableAddress(contact: GhlContact): boolean {
  return Boolean(contact.city || contact.address1);
}

function toCandidate(contact: GhlContact, signals?: CustomerActivitySignals): GhlContactCandidate {
  return {
    ghlContactId: contact.id,
    displayName: getPrimaryDisplayName(contact),
    city: contact.city,
    state: contact.state,
    hasAddress: hasUsableAddress(contact),
    lastCustomerActivity: signals?.lastCustomerActivity ?? contact.lastActivity ?? null,
    serviceCompletedAt: signals?.serviceCompletedAt ?? null,
    reviewRequestAt: signals?.reviewRequestAt ?? null,
  };
}

function scoreContactVariants(
  contact: GhlContact,
  input: FindCandidatesInput,
  sameNameCount: Map<string, number>,
  abbreviatedPatternCount: Map<string, number>,
  signals?: CustomerActivitySignals,
): MatchCandidate {
  const baseCandidate = toCandidate(contact, signals);
  let best: MatchCandidate | null = null;

  for (const variant of extractContactNameVariants(contact)) {
    const sameNameKey = normalizeName(variant.label);
    const abbreviatedKey = abbreviatedNameMatchKey(input.review.reviewerDisplayName, variant.label);
    const result = scoreMatch({
      googleDisplayName: input.review.reviewerDisplayName,
      reviewCreatedAt: input.review.createTime,
      candidateName: variant.label,
      candidateCountWithSameName: sameNameCount.get(sameNameKey) ?? 1,
      candidateCountWithSameAbbreviatedPattern: abbreviatedKey
        ? (abbreviatedPatternCount.get(abbreviatedKey) ?? 1)
        : undefined,
      hasValidAddress: baseCandidate.hasAddress,
      signals: {
        lastCustomerActivity: baseCandidate.lastCustomerActivity,
        serviceCompletedAt: baseCandidate.serviceCompletedAt,
        reviewRequestAt: baseCandidate.reviewRequestAt,
      },
    });

    const reasons =
      variant.source === "firstName + lastName"
        ? result.reasons
        : [
            ...result.reasons,
            {
              code: "identity_source",
              label: `Matched via ${variant.source}`,
              points: 0,
            },
          ];

    const candidate: MatchCandidate = {
      ...baseCandidate,
      displayName: variant.label === baseCandidate.displayName ? baseCandidate.displayName : `${baseCandidate.displayName} (${variant.source})`,
      score: result.score,
      confidence: result.confidence,
      reasons,
    };

    if (!best || candidate.score > best.score) {
      best = candidate;
    }
  }

  return (
    best ?? {
      ...baseCandidate,
      score: 0,
      confidence: "low",
      reasons: [{ code: "no_identity", label: "No usable name fields on contact", points: 0 }],
    }
  );
}

function buildDiagnostics(
  input: FindCandidatesInput,
  rawContactCount: number,
  candidates: MatchCandidate[],
): MatchDiscoveryDiagnostics {
  const messages = [...(input.discovery?.messages ?? [])];
  if (rawContactCount === 0) {
    messages.push(
      `No GHL contacts matched "${input.review.reviewerDisplayName}" after discovery and local scan.`,
    );
  } else if (candidates.length === 0) {
    messages.push(
      `${rawContactCount} contact(s) matched by name fields, but none scored high enough to suggest automatically.`,
    );
  }

  return {
    strategiesAttempted: input.discovery?.strategiesAttempted ?? [],
    rawContactCount,
    filteredContactCount: rawContactCount,
    messages,
  };
}

export function findCandidates(input: FindCandidatesInput): FindCandidatesResult {
  const googleName = splitPersonName(input.review.reviewerDisplayName);

  if (!googleName.full || googleName.full.length < 3 || (!googleName.last && googleName.first.length < 4)) {
    return {
      status: "unmatched",
      candidates: [],
      bestScore: null,
      diagnostics: buildDiagnostics(input, 0, []),
    };
  }

  const sameNameCount = new Map<string, number>();
  const abbreviatedPatternCount = new Map<string, number>();
  for (const contact of input.contacts) {
    for (const variant of extractContactNameVariants(contact)) {
      const key = normalizeName(variant.label);
      sameNameCount.set(key, (sameNameCount.get(key) ?? 0) + 1);
      const abbreviatedKey = abbreviatedNameMatchKey(input.review.reviewerDisplayName, variant.label);
      if (abbreviatedKey) {
        abbreviatedPatternCount.set(
          abbreviatedKey,
          (abbreviatedPatternCount.get(abbreviatedKey) ?? 0) + 1,
        );
      }
    }
  }

  const scored: MatchCandidate[] = input.contacts.map((contact) =>
    scoreContactVariants(
      contact,
      input,
      sameNameCount,
      abbreviatedPatternCount,
      input.signalsByContactId?.[contact.id],
    ),
  );

  scored.sort((a, b) => b.score - a.score);

  const exactMatches = scored.filter((candidate) =>
    namesAreExactMatch(input.review.reviewerDisplayName, candidate.displayName),
  );
  const firstInitialMatches = scored.filter((candidate) =>
    firstNameAndLastInitialMatch(input.review.reviewerDisplayName, candidate.displayName),
  );
  const positive = scored.filter((candidate) => candidate.score > 0);
  const viable = scored.filter((candidate) => candidate.score >= 40);
  const top = viable[0] ?? positive[0] ?? scored[0];
  const diagnostics = buildDiagnostics(input, input.contacts.length, positive);

  if (exactMatches.length > 1) {
    return {
      status: "needs_review",
      candidates: scored.slice(0, 8),
      bestScore: top?.score ?? null,
      diagnostics,
    };
  }

  if (firstInitialMatches.length > 1) {
    return {
      status: "needs_review",
      candidates: viable.length > 0 ? viable.slice(0, 8) : firstInitialMatches.slice(0, 8),
      bestScore: top?.score ?? null,
      diagnostics,
    };
  }

  if (!top || top.score < 70) {
    if (positive.length > 0 || input.includeWeakCandidates) {
      const pool = input.includeWeakCandidates ? scored : positive;
      return {
        status: "needs_review",
        candidates: pool.slice(0, 8),
        bestScore: top?.score ?? pool[0]?.score ?? null,
        diagnostics,
      };
    }
    return {
      status: "unmatched",
      candidates: [],
      bestScore: top?.score ?? null,
      diagnostics,
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
      diagnostics,
    };
  }

  return {
    status: top.confidence === "high" ? "matched" : "needs_review",
    candidates: viable.slice(0, 8),
    bestScore: top.score,
    diagnostics,
  };
}
