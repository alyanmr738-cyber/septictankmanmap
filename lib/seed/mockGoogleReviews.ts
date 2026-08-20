import type { GoogleReview } from "@/lib/types";

export const MOCK_GOOGLE_REVIEWS: GoogleReview[] = [
  {
    reviewId: "mock-google-john-smith",
    reviewerDisplayName: "John Smith",
    rating: 5,
    comment: "Excellent service and very professional.",
    createTime: "2026-08-17T20:17:00.000Z",
    updateTime: "2026-08-17T20:17:00.000Z",
  },
  {
    reviewId: "mock-google-mike-johnson",
    reviewerDisplayName: "Mike Johnson",
    rating: 5,
    comment: "They diagnosed the drain field issue quickly and explained every option.",
    createTime: "2026-08-11T16:04:00.000Z",
    updateTime: "2026-08-11T16:04:00.000Z",
  },
  {
    reviewId: "mock-google-david",
    reviewerDisplayName: "David",
    rating: 4,
    comment: "Good pumping service. Would use again.",
    createTime: "2026-08-09T13:22:00.000Z",
    updateTime: "2026-08-09T13:22:00.000Z",
  },
  {
    reviewId: "mock-google-maria-gonzalez",
    reviewerDisplayName: "Maria Gonzalez",
    rating: 5,
    comment: "Showed up on time and left the yard cleaner than they found it.",
    createTime: "2026-08-13T19:41:00.000Z",
    updateTime: "2026-08-13T19:41:00.000Z",
  },
  {
    reviewId: "mock-google-casey-example",
    reviewerDisplayName: "Casey Example",
    rating: 5,
    comment: "Fast emergency response after a weekend backup.",
    createTime: "2026-08-09T09:12:00.000Z",
    updateTime: "2026-08-09T09:12:00.000Z",
  },
];
