import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  contactMatchesReviewerName,
  extractContactNameVariants,
} from "@/lib/integrations/ghl/contactIdentity";
import { findCandidates } from "@/lib/matching/findCandidates";

describe("contactIdentity", () => {
  it("extracts names from company and custom fields", () => {
    const variants = extractContactNameVariants({
      id: "1",
      firstName: "",
      lastName: "",
      companyName: "Monika Wooten",
      customFields: [{ name: "Homeowner Name", value: "David Turner" }],
    });

    assert.ok(variants.some((variant) => variant.label === "Monika Wooten"));
    assert.ok(variants.some((variant) => variant.label === "David Turner"));
  });

  it("matches a first-name-only GHL contact to a full Google reviewer name", () => {
    const matched = contactMatchesReviewerName(
      { id: "1", firstName: "David", lastName: "" },
      "David Turner",
    );
    assert.equal(matched, true);
  });
});

describe("findCandidates discovery scoring", () => {
  it("routes weak first-name-only matches to needs_review", () => {
    const result = findCandidates({
      review: {
        reviewerDisplayName: "David Turner",
        createTime: "2026-06-11T12:00:00.000Z",
      },
      contacts: [{ id: "1", firstName: "David", lastName: "", city: "Port Charlotte", state: "FL" }],
    });

    assert.equal(result.status, "needs_review");
    assert.ok(result.candidates[0]?.score > 0);
      assert.ok(
      result.candidates[0]?.reasons.some((reason) => reason.code === "ghl_first_name_only"),
    );
    assert.ok(
      result.candidates[0]?.reasons.some((reason) => reason.label === "First name match only"),
    );
  });
});
