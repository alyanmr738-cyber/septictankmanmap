-- Septic Tank Man launch reviews
-- Run in Supabase SQL editor (safe to re-run)
BEGIN;

DELETE FROM review_match_candidates WHERE review_id IN (SELECT id FROM reviews WHERE match_status IN ('pending','needs_review','unmatched'));
DELETE FROM reviews WHERE match_status IN ('pending','needs_review','unmatched');

-- Replace any prior launch publish rows (including npm import:launch) before re-inserting stable ids
DELETE FROM review_match_candidates rmc
USING reviews r
WHERE rmc.review_id = r.id
  AND COALESCE(r.match_metadata->>'launchPublish', 'false') = 'true';

DELETE FROM reviews
WHERE COALESCE(match_metadata->>'launchPublish', 'false') = 'true';

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '1ae26779-cb0a-4cac-7c48-4a29315d2d26',
  'Monika Wooten',
  'Monika W.',
  5,
  'I needed an inspection done on my septic in a pinch. Slade came out and was able to get it done quickly and efficiently.',
  '2026-08-18'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.102191,
  -82.45358,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '7d3b11c8-d0f3-44df-82fd-a510ad8eb0b5',
  'Danny CoastalColors',
  'Danny C.',
  5,
  'Great company and owner!! Highly recommend!!',
  '2026-07-30'::timestamptz,
  'approved',
  'Bradenton',
  'FL',
  27.497533,
  -82.572755,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"bradenton","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'f57588b8-cc1c-ef99-10f3-4f16072d763f',
  'Leslie Tullis',
  'Leslie T.',
  5,
  'TJ is amazing',
  '2026-07-09'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.10148,
  -82.45663,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '82cd0192-d2c7-7850-5dda-dc7f6d3be6ee',
  'David Turner',
  'David T.',
  5,
  'I needed our septic tanks pumped and inspected. I called Septic Tank Man, they immediately answered the phone and were responsive.',
  '2026-06-11'::timestamptz,
  'approved',
  'North Port',
  'FL',
  27.046871,
  -82.236005,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"north-port","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '30ce0b70-ad3b-1c9c-0f33-5437d5cd0051',
  'Sue Gottesman',
  'Sue G.',
  5,
  'TJ came out yesterday. I wanted to understand the process and he was awesome at explaining how he does what he does.',
  '2026-05-21'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.97801,
  -82.092703,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'aff03819-56d1-b123-ca4a-3765e990bfd2',
  'Andrew Gottesman',
  'Andrew G.',
  5,
  'I wish to express much thanx to Septic Tank Man, Inc. and particularly to their technician TJ. We had our tank pumped and he was professional.',
  '2026-05-21'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.338063,
  -82.532779,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '3d2bc266-ebb9-c76f-5286-441dc350f1ae',
  'Matthew Mativi',
  'Matthew M.',
  5,
  'Great price. Big THANK YOU to Septic Tank Man for always taking great care of us. TJ came out today for a pump.',
  '2026-04-16'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.927517,
  -82.04682,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'ee73c8ff-c907-a774-7ec7-c5e0750ce1b6',
  'Becca Anastasi',
  'Becca A.',
  5,
  'Huge thanks to TJ at Septic Tank Man for the prompt and professional service today. He was super knowledgeable.',
  '2026-02-19'::timestamptz,
  'approved',
  'North Port',
  'FL',
  27.042112,
  -82.237481,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"north-port","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '19bd367c-39df-8637-463f-8c8f9e8a630d',
  'Janice Walker',
  'Janice W.',
  5,
  'TJ came to our home quickly and was great and personable.',
  '2026-02-05'::timestamptz,
  'approved',
  'North Port',
  'FL',
  27.043029,
  -82.238596,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"north-port","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '8daa2147-8866-72d9-1d12-b27aa2ef2a53',
  'Rica Man',
  'Rica M.',
  5,
  'I had a great experience with Septic Tank Man and will always use them in the future. Corey and TJ were very professional and knowledgeable.',
  '2026-01-22'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.974156,
  -82.091719,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '95bac7ba-3dae-8e99-e1d5-18b0f6c18da7',
  'Jose González',
  'Jose G.',
  5,
  'On October 17th 2025, job #6480, the technician who came out did a very thorough inspection of my septic system.',
  '2026-01-08'::timestamptz,
  'approved',
  'Bradenton',
  'FL',
  27.496433,
  -82.575142,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"bradenton","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '5432630f-bd3b-548d-ae24-ae4fef1edaed',
  'Renee Jayhan',
  'Renee J.',
  5,
  'I had a great experience with this septic tank company from start to finish. They were prompt, professional, and very helpful.',
  '2025-12-18'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.932056,
  -82.04658,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '1e4ae11e-3cab-f07c-1d63-7c9a2ef05241',
  'Don Hauptmann',
  'Don H.',
  5,
  'TJ came to pump out my tanks, he was very friendly and professional. I would definitely recommend him and use him again!',
  '2025-12-04'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.335392,
  -82.528152,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'fcdc1ae8-9019-eb47-f8c8-b09d26183e37',
  'Crystal Motuzas',
  'Crystal M.',
  5,
  'We had an excellent experience with Septic Tank Man! TJ came out to pump our septic tank and was knowledgeable and professional.',
  '2025-09-25'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.338286,
  -82.529157,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'c10f973e-a8a9-f710-02c5-c6d1fdc56432',
  'Armando Vazquez',
  'Armando V.',
  5,
  'Quick to respond and efficient. TJ and Slade did work in our home and so far we''ve been very pleased. I would recommend them for your septic issues.',
  '2025-08-20'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.927173,
  -82.045038,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'c5d610ce-6b8f-32f5-5083-d397359ae17d',
  'Terry Hawks',
  'Terry H.',
  5,
  'Tj did a class act of a Job',
  '2025-05-12'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.334424,
  -82.531984,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '63ec8db0-cae9-f339-20a2-66db6cf42d73',
  'R & J Thurston',
  'R & J T.',
  5,
  'TJ and Anthony showed up today, and what a great experience. They were courteous and professional, on time.',
  '2024-09-16'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.927177,
  -82.045039,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '5217da50-6a9e-99fd-187c-a1f86dda9c59',
  'camp winaco',
  'camp W.',
  5,
  'TJ came out to our house and checked our septic tank. Came on time, told us what our options were in a very clear way.',
  '2024-08-15'::timestamptz,
  'approved',
  'Bradenton',
  'FL',
  27.49719,
  -82.576598,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"bradenton","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '6b57cba3-2769-e98b-344a-d059b0067e0d',
  'Shannon Thomas',
  'Shannon T.',
  5,
  'I was very happy with TJ and how courteous, knowledgeable and thorough he was with my service today.',
  '2024-07-26'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.33761,
  -82.533059,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '7c18d87a-4fc1-4ff3-0f0e-68e3a496aa49',
  'Mary Waldeck',
  'Mary W.',
  5,
  'TJ came to the rescue today, and provided excellent and prompt service on one of our rental properties. We will definitely call him in the future.',
  '2024-06-26'::timestamptz,
  'approved',
  'Bradenton',
  'FL',
  27.501107,
  -82.575561,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"bradenton","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'd8214b37-0b92-19e5-ea46-dd13cd9b3a45',
  'Rachel Benton',
  'Rachel B.',
  5,
  'TJ was so kind and helpful! He went above and beyond to explain everything. I will be recommending The Septic Tank Man to everyone!',
  '2024-05-29'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.336153,
  -82.533343,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'ae782241-37cb-4960-e3b7-100115bb247c',
  'anita dynarski',
  'anita D.',
  5,
  'TJ did an excellent job and was very professional. I am very satisfied with his service and the next time I will call I would ask for him.',
  '2024-05-16'::timestamptz,
  'approved',
  'North Port',
  'FL',
  27.046746,
  -82.236,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"north-port","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '357ff35b-297a-7df8-9610-53e7c5c2501d',
  'andrew leichty',
  'andrew L.',
  5,
  'TJ was the man! Very knowledgeable and informative! He was very thorough and made sure I understood the process and each step!',
  '2024-05-16'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.928054,
  -82.043574,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'a98ccfef-eda3-27fa-f342-28ba07f7f99f',
  'Yac',
  'Yac',
  5,
  'Thank you Shaina and TJ for outstanding service! I am now educated about caring for my septic system.',
  '2024-05-10'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.931975,
  -82.044654,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'c3436c12-5611-5797-683e-057e271b31d8',
  'Craig Hop',
  'Craig H.',
  5,
  'Thank you Slade for sending TJ! Excellent job! Outstanding young man. I highly recommend STM for all of your septic needs.',
  '2024-04-26'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.33509,
  -82.533254,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '3765ce1a-e977-0444-0a37-14286be3db54',
  'Sharon Hundley',
  'Sharon H.',
  5,
  'TJ did an excellent job!! On time, courteous, knowledgeable and very thorough. Would highly recommend.',
  '2024-04-23'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.097234,
  -82.454451,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'd3896ba1-ef77-d0b6-4186-bf3489b831bb',
  'David Warren',
  'David W.',
  5,
  'TJ was great! On time, very knowledgeable and made sure we understood everything.',
  '2024-04-05'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.929512,
  -82.048033,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '7d8bc591-6cd6-4415-a64c-7e6b30f07f4c',
  'Jeffrey Reichard',
  'Jeffrey R.',
  5,
  'Wow, what a great young man, TJ!!! He explained everything to me. He was so pleasant, knowledgeable and professional.',
  '2024-03-20'::timestamptz,
  'approved',
  'North Port',
  'FL',
  27.04621,
  -82.23731,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"north-port","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '10109d65-2239-71d0-af89-d178f9d074d6',
  'Karen',
  'Karen',
  5,
  'TJ came out for a pump out. Showed us everything he did. Was very informative. He did a great job and cleaned up after himself.',
  '2024-03-07'::timestamptz,
  'approved',
  'Bradenton',
  'FL',
  27.496487,
  -82.575428,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"bradenton","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '5cc87878-765e-9e47-e819-3e5993e7c580',
  'Aaron Jackson',
  'Aaron J.',
  5,
  'Outstanding service! They were responsive, efficient and professional. The technician that did the work was excellent.',
  '2024-02-22'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.097993,
  -82.455944,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'd6935de8-f18a-8b6a-f44b-743ed68bb4d3',
  'True Blue',
  'True B.',
  5,
  'TJ was very professional, on time and knew what he was talking about! Pleasant experience and we will use this company again!',
  '2024-02-12'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.974536,
  -82.092825,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'a762c38e-4e90-bd73-4f75-073087b5ace9',
  'Daryl Leto',
  'Daryl L.',
  5,
  'I normally dont fill these things out but i had to today. TJ did a great job he treated us with respect and professionalism.',
  '2024-02-07'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.975733,
  -82.093573,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '666750d9-9150-3c99-77a8-01b827fcd5f6',
  'Lester Byler',
  'Lester B.',
  5,
  'I highly recommend this company for septic tank pump out. TJ was very polite, knowledgeable and professional and did an excellent job.',
  '2024-01-31'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.976039,
  -82.093188,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '62497777-a08b-d022-6342-bf448b64c624',
  'Aaron Rositch',
  'Aaron R.',
  5,
  'Awesome service! Had a surprise issue that needed to be dealt with. They came out the day after I called, just as they promised.',
  '2024-01-26'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.93191,
  -82.044395,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'dae260ae-79a3-f5b7-39f1-3e915d7996b6',
  'Keven Knight',
  'Keven K.',
  5,
  'I saw a lot of five-star reviews and now I know why. TJ went above and beyond, doing more than just pumping out our tank.',
  '2024-01-24'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.978358,
  -82.091888,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '75033137-93f3-8d2e-4f3b-184bfc3e9c57',
  'Ben Soto',
  'Ben S.',
  5,
  'I was having issues with my toilets bubbling every time i took a shower. So i called to get a pump out. They had someone out quickly.',
  '2024-01-18'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.93174,
  -82.043876,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'b03353a3-8559-3c17-ed59-71a71b721dbb',
  'Christy Thomas',
  'Christy T.',
  5,
  'So glad I called these guys !! My tech, TJ, was awesome !!! Super friendly and very informative with every question I had !!',
  '2023-11-28'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.334934,
  -82.528428,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '9c414fdd-07dd-0245-da46-9708102cf92d',
  'Beth Lowe',
  'Beth L.',
  5,
  'Service was so fast and couldn''t have been better. Tj did a great job and shaina also did great setting everything up so promptly. Thank you',
  '2023-11-28'::timestamptz,
  'approved',
  'North Port',
  'FL',
  27.044771,
  -82.233331,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"north-port","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '6b1378ae-da19-2823-8f43-d3b6e09b9bf1',
  'Chester Jones',
  'Chester J.',
  5,
  'TJ was very professional and appreciated his knowledge about the septic system with lots of good hints for care. The price and quality of service were excellent.',
  '2023-10-27'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.338698,
  -82.530972,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '1e51baa4-b682-0315-7660-eda712f90c08',
  'Mrs. Fulgieri',
  'Mrs F.',
  5,
  'TJ was very quick to respond to our emergency on a Saturday. He explained everything and made sure we were satisfied before he left.',
  '2023-10-21'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.930023,
  -82.048262,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '68669a14-eb67-1966-8928-0172e77bb2d5',
  'Gregory Sprimont',
  'Gregory S.',
  5,
  'Called on a Thursday, TJ came out next working day. He was on time and called when on the way. T.J. was very professional.',
  '2023-10-06'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.102454,
  -82.453828,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'b619242b-15a0-4028-6cfd-7c33ce6034d3',
  'Daryle Persson',
  'Daryle P.',
  5,
  'TJ came out to pump out my septic and was on time and very professional definitely using Septic Tank Man in the future.',
  '2023-10-02'::timestamptz,
  'approved',
  'Bradenton',
  'FL',
  27.500109,
  -82.577068,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"bradenton","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '0085e398-270a-971e-435c-c39db6296253',
  'Robin Rinker',
  'Robin R.',
  5,
  'If you want amazing service, on time and professional services, Septic Tank Man can help you out in a pinch.',
  '2023-09-22'::timestamptz,
  'approved',
  'North Port',
  'FL',
  27.046313,
  -82.234639,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"north-port","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '2bb7a97a-ceb6-bdfb-2b8f-3097b3a85643',
  'Emily Leach',
  'Emily L.',
  5,
  'TJ, who came out for our service, was great. He was very knowledgeable, explained everything thoroughly, made sure to answer all of our questions.',
  '2023-09-12'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.930031,
  -82.048367,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '93e5fd0d-e5d0-cff9-a903-84833618f44e',
  'Jim Markowski',
  'Jim M.',
  5,
  'Called on a Friday, came out next working day. We''re on time and called when on the way. T.J. was very professional.',
  '2023-09-07'::timestamptz,
  'approved',
  'North Port',
  'FL',
  27.04204,
  -82.23688,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"north-port","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'c1ab757f-38e6-1c02-cfcc-c8e540916949',
  'Lisa Bruewer',
  'Lisa B.',
  5,
  'Called The Septic Tank Man one day and they showed up the very next day after others said it''ll take 2 days to get out.',
  '2023-08-22'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.932447,
  -82.045764,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '4d6c7dab-ba1b-b838-7fd3-e10655f9bc21',
  'Kimber Dawn Brouse',
  'Kimber Dawn B.',
  5,
  'TJ was awesome! He even taught me how to clean my septic filter so I can save money and stress on my system.',
  '2023-08-18'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.33454,
  -82.532222,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'b47565f7-daae-4f74-a4f8-0c9c67431b36',
  'Alysia Holland',
  'Alysia H.',
  5,
  'Septic Tank Man came out for an inspection on our home and quoted us for a repair. I called to schedule the repair and they were great.',
  '2023-08-18'::timestamptz,
  'approved',
  'Bradenton',
  'FL',
  27.497998,
  -82.577197,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"bradenton","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'b618b55e-c913-b009-bc1f-7469f8a6e59f',
  'Teri Warren',
  'Teri W.',
  5,
  'They Are Hands down the best!! TJ is Awesome! he was very informative.',
  '2023-06-29'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.978023,
  -82.092316,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'cd554223-e912-b19f-f0ad-49e0c688cbc8',
  'amanda appia',
  'amanda A.',
  5,
  'TJ did a fantastic job, he explained everything he was doing to me and answered all my questions, I would use them again.',
  '2023-06-16'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.975249,
  -82.09324,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '0066567a-3eb7-bf9c-06fe-761ba6195f53',
  'John B',
  'John B.',
  5,
  'We contacted them for a pump out. They got us on the schedule the following day and they arrived when they said they would.',
  '2023-05-29'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.336867,
  -82.533175,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '348025db-3a56-c8a4-3e78-6de98f5efe9a',
  'cc4niner',
  'cc4niner',
  5,
  'Imagine your Friday night all of a sudden requires an emergency septic cleaning. They came out and saved the day.',
  '2023-05-20'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.978484,
  -82.091963,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '598b7be5-a826-040b-63ab-be546f2a9817',
  'John Kotuby',
  'John K.',
  5,
  'Septic Tank Man did a pump out and filter clean and inlet toilet paper clog removal. TJ, the service tech they sent, was excellent.',
  '2023-04-27'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.93195,
  -82.047218,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '1ac36c9c-e528-b3b6-1a24-8c668a28a4f8',
  'Vanessa Webb',
  'Vanessa W.',
  5,
  'TJ came to help me with an issue I was having and explained everything he was doing. TJ was very professional and nice.',
  '2023-04-21'::timestamptz,
  'approved',
  'North Port',
  'FL',
  27.042316,
  -82.237326,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"north-port","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '262050c0-0353-b727-4e5a-6fe4ce418a64',
  'Cindy Plume',
  'Cindy P.',
  5,
  'We had an issue with our septic tank and called Septic Tank Man, they sent TJ out the next morning and he was great!',
  '2023-03-31'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.334997,
  -82.528527,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '187c1fc8-4ca8-cdb0-964e-8576ad9d87f7',
  'Mary Flynn',
  'Mary F.',
  5,
  'Quick and efficient',
  '2023-03-03'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.102012,
  -82.453034,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '5e255dde-8cf0-7056-7de8-13a814c5ebde',
  'Michael',
  'Michael',
  5,
  'Big thank you to TJ and Joel. They did a great job, they were on time and the price was good also.',
  '2023-03-02'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.930554,
  -82.042944,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'a5fb115d-47b3-49bd-c660-9f7cbe012ca3',
  'Alan Stier',
  'Alan S.',
  5,
  'After calling Septic Tank Man for my 2nd septic service, they did an excellent job and were professional throughout.',
  '2023-02-17'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.338957,
  -82.529765,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'ea741f38-01a1-d3d8-2b89-0c993510ad2b',
  'Dewey Daniel',
  'Dewey D.',
  5,
  'They are great! I have never had another problem since they replaced my drain field.',
  '2022-11-23'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.974664,
  -82.088394,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '06f0c78c-c160-91bb-75a8-57d866730c66',
  'Andrew Spargur',
  'Andrew S.',
  5,
  'They were here quickly and did a thorough job. Professional service even though I wasn''t thrilled about needing septic work.',
  '2022-07-05'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.33875,
  -82.53156,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'b433009a-f787-f04a-44d1-c938bee712fd',
  'Sharon Porter',
  'Sharon P.',
  5,
  'They take care of our system. Very nice company.',
  '2022-07-01'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.977973,
  -82.089046,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '48bf8cec-854a-2831-b8b9-fb7fa77cc396',
  'Renee Wilson',
  'Renee W.',
  5,
  'I called and left a voicemail on Friday and they got back to me quickly. Great service from start to finish.',
  '2022-01-10'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.931951,
  -82.044662,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '165a2d9b-4d9c-6874-03a4-9c5cdc32436f',
  'David Mineo',
  'David M.',
  5,
  'Very helpful... We were the last customer of the day. They helped in more ways than just one here.',
  '2021-11-29'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.097654,
  -82.455865,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'bd7242ef-5546-6bef-da29-06a6c8dd9a85',
  'Karl Swan',
  'Karl S.',
  5,
  'What a wonderful company to do business with. Would highly recommend and will use them again.',
  '2021-11-05'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.930828,
  -82.048116,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '55e89500-f45a-5958-807d-4e06d97cc27d',
  'Jared Bohager',
  'Jared B.',
  5,
  'Despite being so busy they fit me in quick and got the job done at a great price. I highly recommend them.',
  '2021-09-27'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.333849,
  -82.5307,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '9b2ecca4-f4cd-8321-f6da-ac5b3d7ffd87',
  'Sally Pinches',
  'Sally P.',
  5,
  'We had Septic Tank Man come to pump out our septic on 5/22/21. They arrived on time - very courteous - did a great job.',
  '2021-04-23'::timestamptz,
  'approved',
  'North Port',
  'FL',
  27.044111,
  -82.238777,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"north-port","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '3f42269d-03c8-7bc2-34d8-1b1ba88efa7a',
  'Carolina Russell',
  'Carolina R.',
  5,
  'I used them a couple times. Couple months ago received an estimate from them for extension of leech field. Great service.',
  '2021-04-19'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.932328,
  -82.044849,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '60258c22-836f-fd7c-5ebf-9c1a1d274613',
  'Colleen Meade',
  'Colleen M.',
  5,
  'Great service and prices.',
  '2021-03-15'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.978695,
  -82.089581,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'd12a2282-72d7-cdd5-45bf-2d7c619beaef',
  'Robert Zopp',
  'Robert Z.',
  5,
  'I live in Baltimore MD and my wife and I are buying a house in North Port Fl. Septic Tank Man helped us with our inspection.',
  '2021-03-09'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.930001,
  -82.047974,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '12dea301-f55a-8da1-a394-f480641d4805',
  'mike dukan',
  'mike D.',
  5,
  'We had our tank drained and it was the best price around the area. The technician was professional and courteous.',
  '2021-02-25'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.975326,
  -82.093029,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '6be2e83c-ad3a-887b-53ea-50ebd69e35a8',
  'Waylon Dressel',
  'Waylon D.',
  5,
  'Best septic company in the state!',
  '2021-02-23'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.976386,
  -82.087612,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '5c180e68-dc98-cf53-5c33-d26bdead11ef',
  'Jason Trefil',
  'Jason T.',
  5,
  'They emptied my septic tank professionally. Good communication and fair pricing.',
  '2021-01-13'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.098375,
  -82.456277,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'bbf9be58-2ac4-8225-fdb2-533596b0fa57',
  'Sharon Rocher',
  'Sharon R.',
  5,
  'Septic Tank Man was heaven sent. Don''t hesitate to call them for service. They are a family owned business.',
  '2020-12-11'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.101899,
  -82.453098,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '77b34f8a-8570-5425-66a7-cf2bf7900177',
  'Tommy Fraccalvieri',
  'Tommy F.',
  5,
  'Best guy to call when you have a problem!',
  '2020-12-09'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.098096,
  -82.452386,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '2beb00be-c9a7-3138-6ef8-210ca57e4c36',
  'Carrie rhoades',
  'Carrie R.',
  5,
  'I had my septic system pumped out 2 years ago by another company and it backed up. They are awesome and very informative!!',
  '2020-12-05'::timestamptz,
  'approved',
  'Bradenton',
  'FL',
  27.500513,
  -82.577213,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"bradenton","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'cd0a92ea-23be-ef6e-bd33-1fc1a29f903f',
  'joyce sobczyk',
  'joyce S.',
  5,
  'Had a great experience with the two young guys that came out to check a septic tank for an inspection. They were professional.',
  '2020-11-24'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.931437,
  -82.04343,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '93cf672f-b7fa-1f62-29c3-a6222c5ebcd9',
  'Marie Norton',
  'Marie N.',
  5,
  'Wonderful company! We had a new septic tank installed this past June. Septic Tank Man provided a fair and honest quote.',
  '2020-11-14'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.102205,
  -82.453263,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '33be77e2-1c6c-6b5f-7183-c9e9bb469b48',
  'Jordan Janeiro',
  'Jordan J.',
  5,
  'Originally left 1 star due to not getting a response, but this time they were responsive and did an excellent job.',
  '2020-10-30'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.928864,
  -82.042926,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'dab58bcc-a2d6-3663-70eb-f1c924435151',
  'Kev N',
  'Kev N.',
  5,
  'What a pleasure dealing with this company. Easy to schedule an appointment, the service tech called a few minutes out.',
  '2020-09-25'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.978753,
  -82.091421,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'b8403056-c5ba-6c05-18b1-7a4fd5f99b3d',
  'Melina Frederick',
  'Melina F.',
  5,
  'Not only did they respond to email but they responded to text. Loved this because I was working and could not take calls.',
  '2020-09-02'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.338774,
  -82.531268,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '364122c2-1073-b6ad-1f98-01200ba03dca',
  'Izzy Torres',
  'Izzy T.',
  5,
  'By far the best pricing and services in town, Thank you Slade !! 100 % recommended',
  '2020-08-26'::timestamptz,
  'approved',
  'Bradenton',
  'FL',
  27.496568,
  -82.573684,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"bradenton","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '9cce1416-db1c-2ed0-872d-c37283faa23f',
  'Danielle Whiteaker',
  'Danielle W.',
  5,
  'Highly recommended! Plus they have the coolest looking trucks around!!',
  '2020-07-10'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.976797,
  -82.093288,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '5ed8ec8d-c67f-6678-685e-f31cb2a1646c',
  'Eniko Jarmer',
  'Eniko J.',
  5,
  'Called Septic Tank Man Friday get scheduled for Tuesday for an annual pump out. Great communication and service.',
  '2020-06-17'::timestamptz,
  'approved',
  'North Port',
  'FL',
  27.043258,
  -82.233281,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"north-port","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '89cfa3fd-2911-3249-fff9-ead4fd5c3a3b',
  'Alberto Gonzalez',
  'Alberto G.',
  5,
  'I could not be happier with the professionalism that Mr. Slade showed us. Slade is very professional and knowledgeable.',
  '2020-05-21'::timestamptz,
  'approved',
  'Sarasota',
  'FL',
  27.335631,
  -82.528037,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"sarasota","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '087d1007-0a77-90bf-8709-70ac252d645e',
  'Tracy Russett',
  'Tracy R.',
  5,
  'Very nice, quick reliable. Number 1 in the number 2 business.',
  '2020-05-11'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.974936,
  -82.08833,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'c9b5d770-aa59-8043-8ceb-0f5780795827',
  'Jess Chua',
  'Jess C.',
  5,
  'Very prompt, professional, and reliable. Diagnosed the issue quickly and gave us peace of mind. Got to our home within a few hours.',
  '2020-05-06'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.099939,
  -82.457271,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'b82e194a-47c9-2e21-d879-9ec628f23551',
  'Tara Rajala',
  'Tara R.',
  5,
  'Excellent and prompt service. Came out next morning after I called regarding problems with my system. Very knowledgeable.',
  '2020-04-18'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.098332,
  -82.456336,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '00b1dcba-f3cf-c375-cb66-0c6ea9c98ec4',
  'Dirk Johnson',
  'Dirk J.',
  5,
  'The gentleman Joel that came to pump my septic was very professional. I had questions and Joel answered all of them.',
  '2020-04-16'::timestamptz,
  'approved',
  'Bradenton',
  'FL',
  27.49764,
  -82.572435,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"bradenton","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '7bbbfa8f-084f-20f3-dd22-248b4fac3ff2',
  'Nelson Seelye',
  'Nelson S.',
  5,
  'Had them come and pump out my tank yesterday did a great job. Professional and thorough.',
  '2020-04-07'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.099175,
  -82.456918,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '1b7711eb-1894-be89-a092-a8d68e95acee',
  'Lesley Miles Waite',
  'Lesley Miles W.',
  5,
  'We couldn''t have been happier with the service we received. Professional, friendly, and competitively priced!',
  '2020-03-30'::timestamptz,
  'approved',
  'Venice',
  'FL',
  27.101622,
  -82.452254,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"venice","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'c2bb2df2-186b-71cf-6f28-7c22686e166c',
  'Valhalla MMA',
  'Valhalla M.',
  5,
  'We would like to extend our 5 star appreciation, in response to your fantastic service.',
  '2020-03-19'::timestamptz,
  'approved',
  'Bradenton',
  'FL',
  27.496397,
  -82.575772,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"bradenton","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'c00855ef-2033-2ed0-df03-7bf1a87bad84',
  'Jim Gouvellis',
  'Jim G.',
  5,
  'They showed up on time and did a great job. I would recommend them to anyone. Prompt, reliable and professional.',
  '2020-03-04'::timestamptz,
  'approved',
  'Port Charlotte',
  'FL',
  26.975351,
  -82.087983,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"port-charlotte","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'c4359dcf-0c54-d2eb-ea78-bfc9281326de',
  'Tim Carter',
  'Tim C.',
  5,
  'I moved to North Port in 1987 and its nice to have a company like septic tank man that is reliable and trustworthy.',
  '2020-02-11'::timestamptz,
  'approved',
  'Punta Gorda',
  'FL',
  26.928796,
  -82.047815,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"punta-gorda","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  '0fae394b-0b63-b346-6488-fed63cf51321',
  'Jessica Smith',
  'Jessica S.',
  5,
  'We''re in the process of purchasing a new home and Sydney and Slade Copeland of Septic Tank Man could not have been more helpful.',
  '2020-01-16'::timestamptz,
  'approved',
  'North Port',
  'FL',
  27.044928,
  -82.23875,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"north-port","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

INSERT INTO reviews (
  id, reviewer_display_name, public_reviewer_name, rating, review_text,
  review_created_at, match_status, public_city, public_state, public_lat, public_lng,
  match_metadata, approved_at, is_seed, created_at, updated_at
) VALUES (
  'fade27b9-40fb-1484-c647-72b2bab60617',
  'You Too',
  'You T.',
  5,
  'We had never had to have a septic pump out in decades of several Florida home ownings. They made the process easy.',
  '2020-01-15'::timestamptz,
  'approved',
  'North Port',
  'FL',
  27.041927,
  -82.235811,
  '{"manualImport":true,"reviewSource":"google_manual","launchPublish":true,"locationSource":"service_area_estimate","serviceAreaId":"north-port","geocodingProvider":"nominatim","geocodePrecision":"service_area"}'::jsonb,
  NOW(), false, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  reviewer_display_name = EXCLUDED.reviewer_display_name,
  public_reviewer_name = EXCLUDED.public_reviewer_name,
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  review_created_at = EXCLUDED.review_created_at,
  match_status = EXCLUDED.match_status,
  public_city = EXCLUDED.public_city,
  public_state = EXCLUDED.public_state,
  public_lat = EXCLUDED.public_lat,
  public_lng = EXCLUDED.public_lng,
  match_metadata = EXCLUDED.match_metadata,
  approved_at = EXCLUDED.approved_at,
  updated_at = NOW();

-- Verify
SELECT match_status, match_metadata->>'locationSource' AS location_source, COUNT(*) FROM reviews GROUP BY 1,2 ORDER BY 1,2;
SELECT COUNT(*) AS approved_on_map FROM reviews WHERE match_status = 'approved' AND public_lat IS NOT NULL;
COMMIT;