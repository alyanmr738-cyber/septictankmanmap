import { randomUUID } from "crypto";
import { getSql } from "@/lib/database/client";
import { memoryStore } from "@/lib/database/memory-store";
import { hasDatabase, isMockMode } from "@/lib/env";
import type {
  MatchCandidate,
  MatchStatus,
  ReviewMatchCandidateRecord,
  ReviewRecord,
} from "@/lib/types";

type ReviewRow = {
  id: string;
  google_review_id: string | null;
  reviewer_display_name: string;
  public_reviewer_name: string;
  rating: number;
  review_text: string;
  review_created_at: string | Date | null;
  ghl_contact_id: string | null;
  match_status: MatchStatus;
  match_confidence: number | null;
  public_city: string | null;
  public_state: string | null;
  public_lat: number | null;
  public_lng: number | null;
  match_metadata: ReviewRecord["matchMetadata"];
  approved_at: string | Date | null;
  rejected_at: string | Date | null;
  is_seed: boolean;
  created_at: string | Date;
  updated_at: string | Date;
};

type CandidateRow = {
  id: string;
  review_id: string;
  ghl_contact_id: string;
  score: number;
  match_reasons: ReviewMatchCandidateRecord["matchReasons"];
  last_customer_activity: string | Date | null;
  service_completed_at: string | Date | null;
  review_request_at: string | Date | null;
  display_name: string;
  public_city: string | null;
  public_state: string | null;
  has_address: boolean;
  created_at: string | Date;
};

function toIso(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

function mapReview(row: ReviewRow): ReviewRecord {
  return {
    id: row.id,
    googleReviewId: row.google_review_id,
    reviewerDisplayName: row.reviewer_display_name,
    publicReviewerName: row.public_reviewer_name,
    rating: row.rating,
    reviewText: row.review_text,
    reviewCreatedAt: toIso(row.review_created_at),
    ghlContactId: row.ghl_contact_id,
    matchStatus: row.match_status,
    matchConfidence: row.match_confidence,
    publicCity: row.public_city,
    publicState: row.public_state,
    publicLat: row.public_lat,
    publicLng: row.public_lng,
    matchMetadata: row.match_metadata,
    approvedAt: toIso(row.approved_at),
    rejectedAt: toIso(row.rejected_at),
    isSeed: row.is_seed,
    createdAt: toIso(row.created_at) ?? new Date().toISOString(),
    updatedAt: toIso(row.updated_at) ?? new Date().toISOString(),
  };
}

function mapCandidate(row: CandidateRow): ReviewMatchCandidateRecord {
  return {
    id: row.id,
    reviewId: row.review_id,
    ghlContactId: row.ghl_contact_id,
    score: row.score,
    matchReasons: row.match_reasons ?? [],
    lastCustomerActivity: toIso(row.last_customer_activity),
    serviceCompletedAt: toIso(row.service_completed_at),
    reviewRequestAt: toIso(row.review_request_at),
    displayName: row.display_name,
    publicCity: row.public_city,
    publicState: row.public_state,
    hasAddress: row.has_address,
    createdAt: toIso(row.created_at) ?? new Date().toISOString(),
  };
}

function useMemory(): boolean {
  return !hasDatabase();
}

export function createReviewId(): string {
  return randomUUID();
}

export async function listReviews(status?: MatchStatus): Promise<ReviewRecord[]> {
  if (useMemory()) {
    return memoryStore.listReviews(status);
  }
  const sql = getSql();
  if (!sql) return [];
  const rows = status
    ? await sql<ReviewRow[]>`
        SELECT * FROM reviews WHERE match_status = ${status} ORDER BY review_created_at DESC NULLS LAST
      `
    : await sql<ReviewRow[]>`
        SELECT * FROM reviews ORDER BY review_created_at DESC NULLS LAST
      `;
  return rows.map(mapReview);
}

export async function getReviewById(id: string): Promise<ReviewRecord | null> {
  if (useMemory()) {
    return memoryStore.getReview(id);
  }
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql<ReviewRow[]>`SELECT * FROM reviews WHERE id = ${id} LIMIT 1`;
  return rows[0] ? mapReview(rows[0]) : null;
}

export async function getReviewByGoogleId(googleReviewId: string): Promise<ReviewRecord | null> {
  if (useMemory()) {
    return memoryStore.getReviewByGoogleId(googleReviewId);
  }
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql<ReviewRow[]>`
    SELECT * FROM reviews WHERE google_review_id = ${googleReviewId} LIMIT 1
  `;
  return rows[0] ? mapReview(rows[0]) : null;
}

export async function listApprovedReviews(): Promise<ReviewRecord[]> {
  if (useMemory()) {
    if (!isMockMode()) {
      return [];
    }
    return memoryStore.listReviews("approved");
  }
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql<ReviewRow[]>`
    SELECT * FROM reviews
    WHERE match_status = 'approved'
      AND public_lat IS NOT NULL
      AND public_lng IS NOT NULL
    ORDER BY approved_at DESC NULLS LAST
  `;
  return rows.map(mapReview);
}

export async function upsertReview(review: ReviewRecord): Promise<ReviewRecord> {
  if (useMemory()) {
    return memoryStore.upsertReview(review);
  }
  const sql = getSql();
  if (!sql) {
    throw new Error("Database is not configured");
  }
  const rows = await sql<ReviewRow[]>`
    INSERT INTO reviews (
      id, google_review_id, reviewer_display_name, public_reviewer_name, rating,
      review_text, review_created_at, ghl_contact_id, match_status, match_confidence,
      public_city, public_state, public_lat, public_lng, match_metadata,
      approved_at, rejected_at, is_seed, created_at, updated_at
    ) VALUES (
      ${review.id}, ${review.googleReviewId}, ${review.reviewerDisplayName},
      ${review.publicReviewerName}, ${review.rating}, ${review.reviewText},
      ${review.reviewCreatedAt}, ${review.ghlContactId}, ${review.matchStatus},
      ${review.matchConfidence}, ${review.publicCity}, ${review.publicState},
      ${review.publicLat}, ${review.publicLng}, ${sql.json(review.matchMetadata ?? {})},
      ${review.approvedAt}, ${review.rejectedAt}, ${review.isSeed},
      ${review.createdAt}, ${review.updatedAt}
    )
    ON CONFLICT (id) DO UPDATE SET
      google_review_id = EXCLUDED.google_review_id,
      reviewer_display_name = EXCLUDED.reviewer_display_name,
      public_reviewer_name = EXCLUDED.public_reviewer_name,
      rating = EXCLUDED.rating,
      review_text = EXCLUDED.review_text,
      review_created_at = EXCLUDED.review_created_at,
      ghl_contact_id = EXCLUDED.ghl_contact_id,
      match_status = EXCLUDED.match_status,
      match_confidence = EXCLUDED.match_confidence,
      public_city = EXCLUDED.public_city,
      public_state = EXCLUDED.public_state,
      public_lat = EXCLUDED.public_lat,
      public_lng = EXCLUDED.public_lng,
      match_metadata = EXCLUDED.match_metadata,
      approved_at = EXCLUDED.approved_at,
      rejected_at = EXCLUDED.rejected_at,
      updated_at = EXCLUDED.updated_at
    RETURNING *
  `;
  return mapReview(rows[0]);
}

export async function replaceCandidates(reviewId: string, next: MatchCandidate[]): Promise<void> {
  const records: ReviewMatchCandidateRecord[] = next.map((candidate) => ({
    id: randomUUID(),
    reviewId,
    ghlContactId: candidate.ghlContactId,
    score: candidate.score,
    matchReasons: candidate.reasons,
    lastCustomerActivity: candidate.lastCustomerActivity ?? null,
    serviceCompletedAt: candidate.serviceCompletedAt ?? null,
    reviewRequestAt: candidate.reviewRequestAt ?? null,
    displayName: candidate.displayName,
    publicCity: candidate.city ?? null,
    publicState: candidate.state ?? null,
    hasAddress: candidate.hasAddress,
    createdAt: new Date().toISOString(),
  }));

  if (useMemory()) {
    memoryStore.replaceCandidates(reviewId, records);
    return;
  }

  const sql = getSql();
  if (!sql) {
    throw new Error("Database is not configured");
  }

  await sql`DELETE FROM review_match_candidates WHERE review_id = ${reviewId}`;
  for (const record of records) {
    await sql`
      INSERT INTO review_match_candidates (
        id, review_id, ghl_contact_id, score, match_reasons, last_customer_activity,
        service_completed_at, review_request_at, display_name, public_city, public_state,
        has_address, created_at
      ) VALUES (
        ${record.id}, ${record.reviewId}, ${record.ghlContactId}, ${record.score},
        ${sql.json(record.matchReasons)}, ${record.lastCustomerActivity},
        ${record.serviceCompletedAt}, ${record.reviewRequestAt}, ${record.displayName},
        ${record.publicCity}, ${record.publicState}, ${record.hasAddress}, ${record.createdAt}
      )
    `;
  }
}

export async function listCandidates(reviewId: string): Promise<MatchCandidate[]> {
  if (useMemory()) {
    return memoryStore.toMatchCandidates(reviewId);
  }
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql<CandidateRow[]>`
    SELECT * FROM review_match_candidates
    WHERE review_id = ${reviewId}
    ORDER BY score DESC
  `;
  return rows.map(mapCandidate).map((candidate) => ({
    ghlContactId: candidate.ghlContactId,
    displayName: candidate.displayName,
    city: candidate.publicCity ?? undefined,
    state: candidate.publicState ?? undefined,
    hasAddress: candidate.hasAddress,
    lastCustomerActivity: candidate.lastCustomerActivity,
    serviceCompletedAt: candidate.serviceCompletedAt,
    reviewRequestAt: candidate.reviewRequestAt,
    score: candidate.score,
    confidence: candidate.score >= 90 ? "high" : candidate.score >= 70 ? "review" : "low",
    reasons: candidate.matchReasons,
  }));
}
