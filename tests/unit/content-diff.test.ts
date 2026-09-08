import { describe, expect, test } from "vitest";
import { diffResource, formatResourceDiffSummary, summarizeResourceDiffs } from "@/domain/content-diff";

const resource = { slug: "mia", assetName: "Mia", status: "DRAFT", levelCodes: ["L3", "L4"] };

describe("content dry-run diff", () => {
  test("reports creates and exact changed fields", () => {
    expect(diffResource(resource, undefined)).toEqual({ action: "CREATE", fields: [] });
    expect(diffResource(resource, { ...resource, assetName: "Old title" })).toEqual({ action: "UPDATE", fields: ["assetName"] });
  });

  test("ignores Level ordering and reports unchanged records", () => {
    expect(diffResource(resource, { ...resource, levelCodes: ["L4", "L3"] })).toEqual({ action: "UNCHANGED", fields: [] });
  });

  test("summarizes created, updated, unchanged and total resources", () => {
    const summary = summarizeResourceDiffs([
      { action: "CREATE" },
      { action: "UPDATE" },
      { action: "UNCHANGED" },
      { action: "UNCHANGED" },
    ]);

    expect(summary).toEqual({ created: 1, updated: 1, unchanged: 2, total: 4 });
    expect(formatResourceDiffSummary(summary)).toBe("created=1, updated=1, unchanged=2, total=4");
  });

  test("reports the expected clean-import and post-import release summaries", () => {
    expect(formatResourceDiffSummary(summarizeResourceDiffs(
      Array.from({ length: 33 }, () => ({ action: "CREATE" as const })),
    ))).toBe("created=33, updated=0, unchanged=0, total=33");
    expect(formatResourceDiffSummary(summarizeResourceDiffs(
      Array.from({ length: 33 }, () => ({ action: "UNCHANGED" as const })),
    ))).toBe("created=0, updated=0, unchanged=33, total=33");
  });
});
