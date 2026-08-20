-- Septic Tank Man customer review map
-- Run in Supabase SQL editor or psql against DATABASE_URL.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'match_status') THEN
    CREATE TYPE match_status AS ENUM (
      'pending',
      'matched',
      'needs_review',
      'approved',
      'rejected',
      'unmatched'
    );
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  google_review_id TEXT UNIQUE,
  reviewer_display_name TEXT NOT NULL DEFAULT '',
  public_reviewer_name TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL DEFAULT '',
  review_created_at TIMESTAMPTZ,
  ghl_contact_id TEXT,
  match_status match_status NOT NULL DEFAULT 'pending',
  match_confidence INTEGER,
  public_city TEXT,
  public_state TEXT,
  public_lat DOUBLE PRECISION,
  public_lng DOUBLE PRECISION,
  match_metadata JSONB,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  is_seed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reviews_match_status_idx ON reviews (match_status);
CREATE INDEX IF NOT EXISTS reviews_approved_map_idx ON reviews (match_status, approved_at DESC);

CREATE TABLE IF NOT EXISTS review_match_candidates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  review_id TEXT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  ghl_contact_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  match_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_customer_activity TIMESTAMPTZ,
  service_completed_at TIMESTAMPTZ,
  review_request_at TIMESTAMPTZ,
  display_name TEXT NOT NULL DEFAULT '',
  public_city TEXT,
  public_state TEXT,
  has_address BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS review_match_candidates_review_id_idx
  ON review_match_candidates (review_id, score DESC);
