# Septic Tank Man — Customer Review Map

Interactive customer review map for the [Septic Tank Man contact page](https://theseptictankman.com/contact-us/). This app is hosted on Vercel and embedded into WordPress/Elementor with an iframe. WordPress keeps the header, quote form, and footer. This app owns the map, matching, geocoding, privacy transformation, and admin approval.

## What this app does

- Public map at `/map` for the WordPress iframe
- Public dataset at `GET /api/map`
- Admin approval queue at `/admin`
- Google review sync and GoHighLevel matching adapters
- Approximate, privacy-safe pin locations — never exact home addresses

## Local setup

```bash
npm install
cp .env.example .env.local
```

Set at least:

```bash
MOCK_MODE=true
AUTH_SECRET=a-long-random-string-at-least-16-chars
ADMIN_PASSWORD=a-strong-local-password
WORDPRESS_ORIGIN=https://theseptictankman.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Then:

```bash
npm run dev
```

Open:

- Public map: [http://localhost:3000/map](http://localhost:3000/map)
- Embed preview (720×720): [http://localhost:3000/map/embed-preview](http://localhost:3000/map/embed-preview)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)
- Public API: [http://localhost:3000/api/map](http://localhost:3000/api/map)

Run tests:

```bash
npm test
```

## Mock mode

`MOCK_MODE=true` runs the app without Google or GoHighLevel credentials.

- `/map` shows about 25 labeled seed locations around Southwest Florida
- `/admin` includes sample pending, needs-review, unmatched, and rejected cards
- Seed names are labeled `Test Customer A.`, `Test Customer B.`, and similar so they cannot be mistaken for real customers
- Admin matching uses mock GHL contacts such as the John Smith / Mike Johnson / David examples from the spec

Mock mode does **not** silently activate in production. If `MOCK_MODE` is false and there is no database of approved reviews, the map shows “Customer locations are being added.”

Without `DATABASE_URL`, data lives in memory. The public map still works because approved seed records are loaded with the app. Admin approvals will reset when the server restarts or when a new serverless instance starts. Add Postgres/Supabase when you want persistence.

## Database

Schema: `lib/database/schema.sql`

Create a Supabase project (or any Postgres database), then run that SQL in the SQL editor. Put the pooled connection string in `DATABASE_URL`.

Local helpers:

```bash
npm run db:apply              # applies lib/database/schema.sql
npm run db:test-persistence   # writes + re-reads an approved review row
npm run ghl:diagnostic -- "First Last" "Another Name"
```

When `DATABASE_URL` is set, `/admin` approvals persist in Postgres instead of the in-memory seed store. Set `MOCK_MODE=false` once you are ready to stop showing demo pins on `/map`.

This app does not store emails, phones, or full street addresses. GHL contact IDs stay in the private `reviews` table and are never returned by `/api/map`.

## Vercel deployment

1. Push this repository and import it into Vercel.
2. Add environment variables from `.env.example`.
3. For a Phase 1 visual launch, set `MOCK_MODE=true`.
4. Set `WORDPRESS_ORIGIN=https://theseptictankman.com`.
5. Set `NEXT_PUBLIC_APP_URL` to the Vercel URL, for example `https://your-app.vercel.app`.
6. Set `AUTH_SECRET`, `ADMIN_PASSWORD`, and `CRON_SECRET`.
7. Deploy.

After deploy, confirm:

- `https://your-app.vercel.app/map` fills the viewport
- `https://your-app.vercel.app/api/map` returns only public fields
- `https://your-app.vercel.app/admin` requires a password

Vercel Cron is configured in `vercel.json` to call `/api/sync/reviews` once per day at 09:00 UTC. Vercel sends `Authorization: Bearer $CRON_SECRET`. Leave Google/GHL unset until those integrations are approved; the map does not wait on sync.

**Hobby plan note:** Vercel Hobby only allows cron jobs that run **once per day**. More frequent schedules (for example every six hours) will fail deployment. Upgrade to [Pro](https://vercel.com/docs/cron-jobs/usage-and-pricing) for sub-daily sync, or trigger sync manually:

```bash
curl -X POST https://YOUR-APP.vercel.app/api/sync/reviews \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## WordPress / Elementor integration

Replace the left-column photograph on the contact page. Do not rebuild the WordPress site.

1. Open the Contact page in Elementor.
2. Find the image widget in the left column beside the quote form.
3. Remove that image widget.
4. Add an HTML widget in the same column.
5. Paste the iframe code below, using your Vercel domain.
6. Set the column/widget height to about 700px so it matches the current photo area.
7. Test desktop.
8. Test tablet.
9. Test mobile. The contact page may stack the map above the form; the iframe is built for widths down to 320px and should not cause horizontal overflow.

```html
<div class="stm-review-map-wrapper">
  <iframe
    src="https://YOUR-VERCEL-DOMAIN.vercel.app/map"
    title="Septic Tank Man Customer Reviews Map"
    loading="lazy"
    allowfullscreen
  ></iframe>
</div>

<style>
  .stm-review-map-wrapper {
    width: 100%;
    height: 100%;
    min-height: 700px;
    overflow: hidden;
  }

  .stm-review-map-wrapper iframe {
    width: 100%;
    height: 100%;
    min-height: 700px;
    border: 0;
    display: block;
    max-width: 100%;
  }

  @media (max-width: 767px) {
    .stm-review-map-wrapper,
    .stm-review-map-wrapper iframe {
      min-height: 560px;
    }
  }
</style>
```

`WORDPRESS_ORIGIN` is used in `Content-Security-Policy: frame-ancestors` so only that site can embed `/map`. Other routes send `X-Frame-Options: DENY`.

## Admin workflow

1. A Google review is synced or created in mock data.
2. The matching engine scores GHL candidates. It never auto-selects the first name hit.
3. High-confidence matches go to **Pending**. Ambiguous names go to **Needs Review**. Weak names go to **Unmatched**.
4. An admin confirms a customer and clicks **Approve**.
5. The backend loads the CRM address, geocodes it, anonymizes the coordinates, and stores only the public city plus approximate lat/lng.
6. The pin appears on `/map` as `John S.` in Bradenton, FL, with “Approximate customer location”.

Nothing is auto-published in this version, even at 96% confidence.

## Production integrations still required

These adapters are implemented against current public docs, but they have **not** been tested with live credentials.

### Google Business Profile

- Create a Google Cloud project and enable the Google My Business API.
- Complete the [Google Business Profile API access request](https://developers.google.com/my-business/content/basic-setup) if Google still requires it.
- OAuth client with scope `https://www.googleapis.com/auth/business.manage`
- Env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_BUSINESS_REFRESH_TOKEN`, `GOOGLE_BUSINESS_ACCOUNT_ID`, `GOOGLE_BUSINESS_LOCATION_ID`
- Endpoint used: `GET https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews`

Google reviews do not include private emails. Matching is name- and activity-based, never email-based.

### GoHighLevel

- Create a Private Integration token for the location: [Private Integrations](https://help.gohighlevel.com/support/solutions/articles/155000003054-private-integrations-everything-you-need-to-know)
- Docs: [HighLevel API](https://marketplace.gohighlevel.com/docs/)
- Env: `GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID`
- Endpoints used:
  - `POST https://services.leadconnectorhq.com/contacts/search` with `Version: 2021-07-28`
  - `GET https://services.leadconnectorhq.com/contacts/:contactId`
- Review-request SMS timing is an adapter (`lib/integrations/ghl/activitySignals.ts`) and is not assumed to exist yet.

### Geocoder

Set `GEOCODING_PROVIDER` to `google`, `mapbox`, or `nominatim`, plus `GEOCODING_API_KEY` when required. Only approved matches are geocoded. Exact coordinates are transformed with `anonymizeCoordinates()` before storage.

### Database

Postgres/Supabase via `DATABASE_URL`. Required before turning `MOCK_MODE` off.

## Security and privacy

- WordPress never receives API credentials, emails, phones, street addresses, exact coordinates, or GHL IDs
- `/api/map` returns only approved public fields
- Public names use `toPublicReviewerName()` (`John Smith` → `John S.`)
- Pins are snapped to a stable ~1.6 km privacy grid derived from the review id
- Admin session cookie is HTTP-only, `SameSite=lax`, `Secure` in production, and server-validated
- Server logs redact tokens, emails, phones, and addresses
- Public page loads never call Google or GHL

## Project structure

```text
app/map                 Public iframe map
app/admin               Approval dashboard
app/api/map             Public map dataset
app/api/sync/reviews    Protected review sync
app/api/admin           Login and approval actions
components/map          Leaflet map UI
components/admin        Admin UI
lib/privacy             Name + coordinate anonymization
lib/matching            Candidate scoring
lib/integrations        GHL, Google, geocoding adapters
lib/database            Postgres + mock memory store
```
