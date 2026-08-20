import type { CustomerActivitySignals, GhlContact } from "@/lib/types";

export const MOCK_GHL_CONTACTS: Array<GhlContact & CustomerActivitySignals> = [
  {
    id: "mock-ghl-john-smith",
    firstName: "John",
    lastName: "Smith",
    name: "John Smith",
    city: "Bradenton",
    state: "FL",
    address1: "Mock street (not a real address)",
    lastActivity: "2026-08-14T15:00:00.000Z",
    serviceCompletedAt: "2026-08-14T15:00:00.000Z",
    reviewRequestAt: "2026-08-16T18:43:00.000Z",
  },
  {
    id: "mock-ghl-mike-johnson-bradenton",
    firstName: "Mike",
    lastName: "Johnson",
    name: "Mike Johnson",
    city: "Bradenton",
    state: "FL",
    address1: "Mock street (not a real address)",
    lastActivity: "2026-07-02T12:00:00.000Z",
    serviceCompletedAt: "2026-07-02T12:00:00.000Z",
  },
  {
    id: "mock-ghl-mike-johnson-sarasota",
    firstName: "Mike",
    lastName: "Johnson",
    name: "Mike Johnson",
    city: "Sarasota",
    state: "FL",
    address1: "Mock street (not a real address)",
    lastActivity: "2026-08-10T12:00:00.000Z",
    serviceCompletedAt: "2026-08-10T12:00:00.000Z",
  },
  {
    id: "mock-ghl-michael-johnson-venice",
    firstName: "Michael",
    lastName: "Johnson",
    name: "Michael Johnson",
    city: "Venice",
    state: "FL",
    address1: "Mock street (not a real address)",
    lastActivity: "2026-05-18T12:00:00.000Z",
  },
  {
    id: "mock-ghl-maria-gonzalez",
    firstName: "Maria",
    lastName: "Gonzalez",
    name: "Maria Gonzalez",
    city: "Venice",
    state: "FL",
    address1: "Mock street (not a real address)",
    lastActivity: "2026-08-12T16:00:00.000Z",
    serviceCompletedAt: "2026-08-12T16:00:00.000Z",
    reviewRequestAt: "2026-08-13T14:00:00.000Z",
  },
  {
    id: "mock-ghl-david-1",
    firstName: "David",
    lastName: "Nguyen",
    name: "David Nguyen",
    city: "Sarasota",
    state: "FL",
  },
  {
    id: "mock-ghl-david-2",
    firstName: "David",
    lastName: "Patel",
    name: "David Patel",
    city: "Port Charlotte",
    state: "FL",
  },
  {
    id: "mock-ghl-david-3",
    firstName: "David",
    lastName: "Brooks",
    name: "David Brooks",
    city: "North Port",
    state: "FL",
  },
  {
    id: "mock-ghl-casey-example",
    firstName: "Casey",
    lastName: "Example",
    name: "Casey Example",
    city: "Englewood",
    state: "FL",
    address1: "Mock street (not a real address)",
    lastActivity: "2026-08-08T11:00:00.000Z",
    serviceCompletedAt: "2026-08-08T11:00:00.000Z",
  },
];

export function searchMockGhlContacts(query: string): GhlContact[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return MOCK_GHL_CONTACTS;
  }
  return MOCK_GHL_CONTACTS.filter((contact) => {
    const haystack = [contact.name, contact.firstName, contact.lastName, contact.city]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

export function getMockGhlContact(id: string): GhlContact | null {
  return MOCK_GHL_CONTACTS.find((contact) => contact.id === id) ?? null;
}
