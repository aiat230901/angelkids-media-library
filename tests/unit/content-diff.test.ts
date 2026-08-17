import { describe, expect, test } from "vitest";
import { diffResource } from "@/domain/content-diff";

const resource = { slug: "mia", assetName: "Mia", status: "DRAFT", levelCodes: ["L3", "L4"] };

describe("content dry-run diff", () => {
  test("reports creates and exact changed fields", () => {
    expect(diffResource(resource, undefined)).toEqual({ action: "CREATE", fields: [] });
    expect(diffResource(resource, { ...resource, assetName: "Old title" })).toEqual({ action: "UPDATE", fields: ["assetName"] });
  });

  test("ignores Level ordering and reports unchanged records", () => {
    expect(diffResource(resource, { ...resource, levelCodes: ["L4", "L3"] })).toEqual({ action: "UNCHANGED", fields: [] });
  });
});
