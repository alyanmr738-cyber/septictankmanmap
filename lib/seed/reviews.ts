import { anonymizeCoordinates } from "@/lib/privacy/anonymizeCoordinates";
import { lookupCityCentroid } from "@/lib/integrations/geocoding/cityCentroids";
import type {
  MatchCandidate,
  MatchStatus,
  ReviewMatchCandidateRecord,
  ReviewRecord,
} from "@/lib/types";

type SeedReviewInput = {
  id: string;
  letter?: string;
  city: string;
  rating: number;
  review: string;
  date: string;
  status: MatchStatus;
  displayName: string;
  publicName?: string;
  confidence?: number;
  ghlContactId?: string | null;
  candidates?: MatchCandidate[];
};

const now = "2026-08-20T00:00:00.000Z";

function cityCoords(city: string) {
  const match = lookupCityCentroid(city);
  if (!match) {
    throw new Error(`Missing city centroid for seed city: ${city}`);
  }
  return match;
}

function createReview(input: SeedReviewInput): ReviewRecord {
  const place = cityCoords(input.city);
  const publicCoords =
    input.status === "approved"
      ? anonymizeCoordinates(place.lat, place.lng, input.id)
      : null;

  return {
    id: input.id,
    googleReviewId: `seed-google-${input.id}`,
    reviewerDisplayName: input.displayName,
    publicReviewerName: input.publicName ?? `Test Customer ${input.letter ?? "X"}.`,
    rating: input.rating,
    reviewText: input.review,
    reviewCreatedAt: input.date,
    ghlContactId: input.status === "approved" ? null : (input.ghlContactId ?? null),
    matchStatus: input.status,
    matchConfidence: input.confidence ?? (input.status === "approved" ? 100 : null),
    publicCity: input.status === "approved" || input.status === "matched" ? place.city : null,
    publicState: input.status === "approved" || input.status === "matched" ? place.state : null,
    publicLat: publicCoords?.lat ?? null,
    publicLng: publicCoords?.lng ?? null,
    matchMetadata: { autoMatchLocked: input.status === "approved" },
    approvedAt: input.status === "approved" ? input.date : null,
    rejectedAt: input.status === "rejected" ? input.date : null,
    isSeed: true,
    createdAt: now,
    updatedAt: now,
  };
}

const APPROVED: SeedReviewInput[] = [
  { id: "seed-approved-01", letter: "A", city: "Bradenton", rating: 5, date: "2026-07-12T14:00:00.000Z", status: "approved", displayName: "Test Customer A", review: "They pumped the tank the same day and explained exactly what they found." },
  { id: "seed-approved-02", letter: "B", city: "Palmetto", rating: 5, date: "2026-06-03T15:10:00.000Z", status: "approved", displayName: "Test Customer B", review: "Professional crew and fair pricing. The inspection report was easy to understand." },
  { id: "seed-approved-03", letter: "C", city: "Lakewood Ranch", rating: 5, date: "2026-05-22T18:40:00.000Z", status: "approved", displayName: "Test Customer C", review: "Great communication from quote to finished repair." },
  { id: "seed-approved-04", letter: "D", city: "Sarasota", rating: 5, date: "2026-08-01T12:05:00.000Z", status: "approved", displayName: "Test Customer D", review: "Showed up quickly and took care of a backup before it became a bigger problem." },
  { id: "seed-approved-05", letter: "E", city: "Siesta Key", rating: 4, date: "2026-04-18T16:22:00.000Z", status: "approved", displayName: "Test Customer E", review: "Solid maintenance visit. Would schedule them again next year." },
  { id: "seed-approved-06", letter: "F", city: "Osprey", rating: 5, date: "2026-03-29T11:15:00.000Z", status: "approved", displayName: "Test Customer F", review: "Drain field work was neat, and they protected the landscaping." },
  { id: "seed-approved-07", letter: "G", city: "Venice", rating: 5, date: "2026-07-30T09:48:00.000Z", status: "approved", displayName: "Test Customer G", review: "Honest recommendation instead of pushing an expensive replacement." },
  { id: "seed-approved-08", letter: "H", city: "Nokomis", rating: 5, date: "2026-02-14T13:33:00.000Z", status: "approved", displayName: "Test Customer H", review: "The technician was on time and walked us through the whole system." },
  { id: "seed-approved-09", letter: "I", city: "Englewood", rating: 5, date: "2026-06-21T17:09:00.000Z", status: "approved", displayName: "Test Customer I", review: "Emergency service on a Saturday. Could not have been happier." },
  { id: "seed-approved-10", letter: "J", city: "Port Charlotte", rating: 5, date: "2026-08-05T10:27:00.000Z", status: "approved", displayName: "Test Customer J", review: "Local team that actually knows Charlotte County soils and permits." },
  { id: "seed-approved-11", letter: "K", city: "Punta Gorda", rating: 5, date: "2026-01-19T15:55:00.000Z", status: "approved", displayName: "Test Customer K", review: "Clean installation and a thorough walkthrough when they finished." },
  { id: "seed-approved-12", letter: "L", city: "North Port", rating: 4, date: "2026-05-02T12:44:00.000Z", status: "approved", displayName: "Test Customer L", review: "Pump-out was fast. Office staff made scheduling easy." },
  { id: "seed-approved-13", letter: "M", city: "Rotonda West", rating: 5, date: "2026-07-08T08:18:00.000Z", status: "approved", displayName: "Test Customer M", review: "They found the tank lids quickly and left the yard in good shape." },
  { id: "seed-approved-14", letter: "N", city: "Ellenton", rating: 5, date: "2026-03-11T19:02:00.000Z", status: "approved", displayName: "Test Customer N", review: "Used them before closing on a house. Inspection was detailed and fair." },
  { id: "seed-approved-15", letter: "O", city: "Fruitville", rating: 5, date: "2026-04-27T14:36:00.000Z", status: "approved", displayName: "Test Customer O", review: "Repair quote matched the work they performed. No surprises." },
  { id: "seed-approved-16", letter: "P", city: "Gulf Gate", rating: 5, date: "2026-06-16T11:51:00.000Z", status: "approved", displayName: "Test Customer P", review: "Friendly crew and excellent follow-up after the service." },
  { id: "seed-approved-17", letter: "Q", city: "Bee Ridge", rating: 4, date: "2026-02-28T16:07:00.000Z", status: "approved", displayName: "Test Customer Q", review: "Good preventative maintenance. System is running quieter now." },
  { id: "seed-approved-18", letter: "R", city: "South Venice", rating: 5, date: "2026-07-19T13:29:00.000Z", status: "approved", displayName: "Test Customer R", review: "They handled a stubborn clog and explained how to avoid the next one." },
  { id: "seed-approved-19", letter: "S", city: "Venice Gardens", rating: 5, date: "2026-05-30T09:14:00.000Z", status: "approved", displayName: "Test Customer S", review: "Arrived in the service window and finished ahead of schedule." },
  { id: "seed-approved-20", letter: "T", city: "Deep Creek", rating: 5, date: "2026-08-08T18:20:00.000Z", status: "approved", displayName: "Test Customer T", review: "Very knowledgeable about older tanks in this neighborhood." },
  { id: "seed-approved-21", letter: "U", city: "Harbour Heights", rating: 5, date: "2026-01-08T12:12:00.000Z", status: "approved", displayName: "Test Customer U", review: "Replacement project stayed on budget and the site was kept tidy." },
  { id: "seed-approved-22", letter: "V", city: "Warm Mineral Springs", rating: 5, date: "2026-04-04T15:47:00.000Z", status: "approved", displayName: "Test Customer V", review: "Clear answers, no pressure, and quality work." },
  { id: "seed-approved-23", letter: "W", city: "Longboat Key", rating: 5, date: "2026-03-21T10:03:00.000Z", status: "approved", displayName: "Test Customer W", review: "Coordinated access and finished the pump-out without any hassle." },
  { id: "seed-approved-24", letter: "X", city: "Holmes Beach", rating: 4, date: "2026-06-09T17:26:00.000Z", status: "approved", displayName: "Test Customer X", review: "Reliable maintenance visit. Would recommend to neighbors." },
  { id: "seed-approved-25", letter: "Y", city: "Anna Maria", rating: 5, date: "2026-07-02T08:55:00.000Z", status: "approved", displayName: "Test Customer Y", review: "Courteous team and a thorough cleaning. System is back to normal." },
];

const johnReasons = [
  { code: "exact_name", label: "Exact full-name match", points: 50 },
  { code: "unique_name", label: "Only matching contact", points: 25 },
  { code: "recent_service", label: "Recent completed service", points: 15 },
  { code: "recent_review_request", label: "Recent review request", points: 20 },
  { code: "valid_address", label: "Valid customer address", points: 10 },
];

const mikeCandidates: MatchCandidate[] = [
  {
    ghlContactId: "mock-ghl-mike-johnson-bradenton",
    displayName: "Mike Johnson",
    city: "Bradenton",
    state: "FL",
    hasAddress: true,
    lastCustomerActivity: "2026-07-02T12:00:00.000Z",
    serviceCompletedAt: "2026-07-02T12:00:00.000Z",
    reviewRequestAt: null,
    score: 72,
    confidence: "review",
    reasons: [
      { code: "exact_name", label: "Exact full-name match", points: 50 },
      { code: "duplicate_name", label: "Multiple identical names", points: -30 },
      { code: "valid_address", label: "Valid customer address", points: 10 },
    ],
  },
  {
    ghlContactId: "mock-ghl-mike-johnson-sarasota",
    displayName: "Mike Johnson",
    city: "Sarasota",
    state: "FL",
    hasAddress: true,
    lastCustomerActivity: "2026-08-10T12:00:00.000Z",
    serviceCompletedAt: "2026-08-10T12:00:00.000Z",
    reviewRequestAt: null,
    score: 80,
    confidence: "review",
    reasons: [
      { code: "exact_name", label: "Exact full-name match", points: 50 },
      { code: "duplicate_name", label: "Multiple identical names", points: -30 },
      { code: "recent_service", label: "Recent completed service", points: 15 },
      { code: "valid_address", label: "Valid customer address", points: 10 },
    ],
  },
  {
    ghlContactId: "mock-ghl-michael-johnson-venice",
    displayName: "Michael Johnson",
    city: "Venice",
    state: "FL",
    hasAddress: true,
    lastCustomerActivity: "2026-05-18T12:00:00.000Z",
    serviceCompletedAt: null,
    reviewRequestAt: null,
    score: 55,
    confidence: "low",
    reasons: [
      { code: "close_name", label: "Close name match", points: 20 },
      { code: "valid_address", label: "Valid customer address", points: 10 },
    ],
  },
];

const QUEUE: SeedReviewInput[] = [
  {
    id: "seed-pending-john-smith",
    city: "Bradenton",
    rating: 5,
    date: "2026-08-17T20:17:00.000Z",
    status: "matched",
    displayName: "John Smith",
    publicName: "John S.",
    confidence: 96,
    ghlContactId: "mock-ghl-john-smith",
    candidates: [
      {
        ghlContactId: "mock-ghl-john-smith",
        displayName: "John Smith",
        city: "Bradenton",
        state: "FL",
        hasAddress: true,
        lastCustomerActivity: "2026-08-14T15:00:00.000Z",
        serviceCompletedAt: "2026-08-14T15:00:00.000Z",
        reviewRequestAt: "2026-08-16T18:43:00.000Z",
        score: 96,
        confidence: "high",
        reasons: johnReasons,
      },
    ],
  },
  {
    id: "seed-review-mike-johnson",
    city: "Sarasota",
    rating: 5,
    date: "2026-08-11T16:04:00.000Z",
    status: "needs_review",
    displayName: "Mike Johnson",
    publicName: "Mike J.",
    confidence: 80,
    candidates: mikeCandidates,
  },
  {
    id: "seed-unmatched-david",
    city: "Sarasota",
    rating: 4,
    date: "2026-08-09T13:22:00.000Z",
    status: "unmatched",
    displayName: "David",
    publicName: "David",
    confidence: 20,
    candidates: [
      {
        ghlContactId: "mock-ghl-david-1",
        displayName: "David Nguyen",
        city: "Sarasota",
        state: "FL",
        hasAddress: true,
        score: 20,
        confidence: "low",
        reasons: [{ code: "insufficient_name", label: "Insufficient reviewer name", points: -50 }],
      },
      {
        ghlContactId: "mock-ghl-david-2",
        displayName: "David Patel",
        city: "Port Charlotte",
        state: "FL",
        hasAddress: true,
        score: 18,
        confidence: "low",
        reasons: [{ code: "insufficient_name", label: "Insufficient reviewer name", points: -50 }],
      },
      {
        ghlContactId: "mock-ghl-david-3",
        displayName: "David Brooks",
        city: "North Port",
        state: "FL",
        hasAddress: true,
        score: 18,
        confidence: "low",
        reasons: [{ code: "insufficient_name", label: "Insufficient reviewer name", points: -50 }],
      },
    ],
  },
  {
    id: "seed-pending-maria",
    city: "Venice",
    rating: 5,
    date: "2026-08-13T19:41:00.000Z",
    status: "matched",
    displayName: "Maria Gonzalez",
    publicName: "Maria G.",
    confidence: 94,
    ghlContactId: "mock-ghl-maria-gonzalez",
    candidates: [
      {
        ghlContactId: "mock-ghl-maria-gonzalez",
        displayName: "Maria Gonzalez",
        city: "Venice",
        state: "FL",
        hasAddress: true,
        lastCustomerActivity: "2026-08-12T16:00:00.000Z",
        serviceCompletedAt: "2026-08-12T16:00:00.000Z",
        reviewRequestAt: "2026-08-13T14:00:00.000Z",
        score: 94,
        confidence: "high",
        reasons: johnReasons.map((reason) =>
          reason.code === "unique_name" ? { ...reason, label: "Only matching contact" } : reason,
        ),
      },
    ],
  },
  {
    id: "seed-rejected-casey",
    city: "Englewood",
    rating: 5,
    date: "2026-08-09T09:12:00.000Z",
    status: "rejected",
    displayName: "Casey Example",
    publicName: "Casey E.",
    confidence: 88,
    ghlContactId: "mock-ghl-casey-example",
  },
];

export const SEED_REVIEWS: ReviewRecord[] = [...APPROVED, ...QUEUE].map(createReview);

export const SEED_CANDIDATES: ReviewMatchCandidateRecord[] = QUEUE.flatMap((review) =>
  (review.candidates ?? []).map((candidate, index) => ({
    id: `${review.id}-candidate-${index + 1}`,
    reviewId: review.id,
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
    createdAt: now,
  })),
);
