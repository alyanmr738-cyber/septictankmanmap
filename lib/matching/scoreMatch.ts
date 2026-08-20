import type { CustomerActivitySignals, MatchReason, MatchResult } from "@/lib/types";
import {
  firstNameAndLastInitialMatch,
  isFirstNameOnlyReviewer,
  namesAreExactMatch,
  splitPersonName,
} from "@/lib/matching/normalizeName";

const DAY_MS = 24 * 60 * 60 * 1000;

export type ScoreMatchInput = {
  googleDisplayName: string;
  reviewCreatedAt?: string | null;
  candidateName: string;
  candidateCountWithSameName: number;
  candidateCountWithSameAbbreviatedPattern?: number;
  hasValidAddress: boolean;
  signals?: CustomerActivitySignals;
};

function daysBetween(a: string | null | undefined, b: string | null | undefined): number | null {
  if (!a || !b) {
    return null;
  }
  const first = Date.parse(a);
  const second = Date.parse(b);
  if (Number.isNaN(first) || Number.isNaN(second)) {
    return null;
  }
  return Math.round((second - first) / DAY_MS);
}

function pushReason(reasons: MatchReason[], reason: MatchReason) {
  reasons.push(reason);
}

export function scoreMatch(input: ScoreMatchInput): MatchResult {
  const reasons: MatchReason[] = [];
  let score = 0;

  const google = splitPersonName(input.googleDisplayName);
  const candidate = splitPersonName(input.candidateName);
  const exact = namesAreExactMatch(input.googleDisplayName, input.candidateName);
  const firstInitial = firstNameAndLastInitialMatch(input.googleDisplayName, input.candidateName);
  const firstOnly = isFirstNameOnlyReviewer(input.googleDisplayName);

  if (!google.full || google.full.length < 3) {
    pushReason(reasons, {
      code: "insufficient_name",
      label: "Insufficient reviewer name",
      points: -50,
    });
    score -= 50;
  } else if (exact) {
    pushReason(reasons, {
      code: "exact_name",
      label: "Exact full-name match",
      points: 50,
    });
    score += 50;
  } else if (firstInitial) {
    pushReason(reasons, {
      code: "first_initial_name",
      label: "First name and last initial match",
      points: 35,
    });
    score += 35;
  } else if (google.first && candidate.first === google.first && google.last && candidate.last === google.last) {
    pushReason(reasons, {
      code: "exact_name",
      label: "Exact full-name match",
      points: 50,
    });
    score += 50;
  } else if (firstOnly && google.first && candidate.first === google.first) {
    pushReason(reasons, {
      code: "first_name_only",
      label: "First name only match",
      points: 10,
    });
    score += 10;
  } else if (
    google.first &&
    candidate.first === google.first &&
    google.last &&
    !candidate.last
  ) {
    pushReason(reasons, {
      code: "ghl_first_name_only",
      label: "First name match only",
      points: 10,
    });
    score += 10;
  } else if (
    google.last &&
    candidate.last === google.last &&
    google.first &&
    !candidate.first
  ) {
    pushReason(reasons, {
      code: "ghl_last_name_only",
      label: "Last name match only",
      points: 10,
    });
    score += 10;
  } else if (google.first && candidate.first.startsWith(google.first) && google.last && candidate.last === google.last) {
    pushReason(reasons, {
      code: "close_name",
      label: "Close name match",
      points: 20,
    });
    score += 20;
  } else if (google.last && candidate.last === google.last && google.first && candidate.first[0] === google.first[0]) {
    pushReason(reasons, {
      code: "partial_name",
      label: "Matching last name and first initial",
      points: 10,
    });
    score += 10;
  } else {
    pushReason(reasons, {
      code: "weak_name",
      label: "Name is not a strong match",
      points: -20,
    });
    score -= 20;
  }

  const abbreviatedCount = input.candidateCountWithSameAbbreviatedPattern ?? 0;
  if (exact && input.candidateCountWithSameName === 1) {
    pushReason(reasons, {
      code: "unique_name",
      label: "Only matching contact",
      points: 25,
    });
    score += 25;
  } else if (firstInitial && abbreviatedCount === 1) {
    pushReason(reasons, {
      code: "unique_name",
      label: "Only matching contact for this first name and initial",
      points: 25,
    });
    score += 25;
  } else if (input.candidateCountWithSameName > 1) {
    const penalty = Math.min(40, 15 * (input.candidateCountWithSameName - 1));
    pushReason(reasons, {
      code: "duplicate_name",
      label: "Multiple identical names",
      points: -penalty,
    });
    score -= penalty;
  } else if (firstInitial && abbreviatedCount > 1) {
    const penalty = Math.min(40, 15 * (abbreviatedCount - 1));
    pushReason(reasons, {
      code: "duplicate_name",
      label: "Multiple contacts share this first name and initial",
      points: -penalty,
    });
    score -= penalty;
  }

  if (input.hasValidAddress) {
    pushReason(reasons, {
      code: "valid_address",
      label: "Valid customer address",
      points: 10,
    });
    score += 10;
  }

  const reviewDate = input.reviewCreatedAt;
  const reviewRequestAt = input.signals?.reviewRequestAt;
  const serviceCompletedAt = input.signals?.serviceCompletedAt;
  const lastActivity = input.signals?.lastCustomerActivity;
  let recentActivitySignal = false;

  if (reviewRequestAt && reviewDate) {
    const gap = daysBetween(reviewRequestAt, reviewDate);
    if (gap != null && gap >= 0 && gap <= 14) {
      pushReason(reasons, {
        code: "recent_review_request",
        label: "Recent review request",
        points: 20,
      });
      score += 20;
      recentActivitySignal = true;
    }
  }

  if (serviceCompletedAt && reviewDate) {
    const gap = daysBetween(serviceCompletedAt, reviewDate);
    if (gap != null && gap >= 0 && gap <= 21) {
      pushReason(reasons, {
        code: "recent_service",
        label: "Recent completed service",
        points: 15,
      });
      score += 15;
      recentActivitySignal = true;
    } else if (gap != null && gap < -3) {
      pushReason(reasons, {
        code: "conflicting_timing",
        label: "Service date conflicts with review timing",
        points: -30,
      });
      score -= 30;
      recentActivitySignal = true;
    }
  } else if (lastActivity && reviewDate) {
    const gap = Math.abs(daysBetween(lastActivity, reviewDate) ?? 999);
    if (gap <= 30) {
      pushReason(reasons, {
        code: "recent_activity",
        label: "Recent customer activity",
        points: 10,
      });
      score += 10;
      recentActivitySignal = true;
    }
  }

  if (!recentActivitySignal) {
    if (exact) {
      pushReason(reasons, {
        code: "no_recent_activity",
        label: "No recent customer activity",
        points: -30,
      });
      score -= 30;
    } else if (firstInitial) {
      pushReason(reasons, {
        code: "no_recent_activity",
        label: "No recent customer activity for abbreviated reviewer name",
        points: -20,
      });
      score -= 20;
    }
  }

  score = Math.max(0, Math.min(100, score));

  let confidence: MatchResult["confidence"] = "low";
  if (score >= 90) {
    confidence = "high";
  } else if (score >= 70) {
    confidence = "review";
  }

  return { score, confidence, reasons };
}

export function confidenceFromScore(score: number): MatchResult["confidence"] {
  if (score >= 90) return "high";
  if (score >= 70) return "review";
  return "low";
}
