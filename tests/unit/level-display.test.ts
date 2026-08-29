import { describe, expect, test } from "vitest";
import { getLevelDisplayName } from "@/domain/level-display";

describe("getLevelDisplayName", () => {
  test("shows parent-friendly age ranges for the supported level codes", () => {
    expect(getLevelDisplayName({ code: "L3", name: "Level 3" })).toBe("3–4 tuổi");
    expect(getLevelDisplayName({ code: "L4", name: "Level 4" })).toBe("4–5 tuổi");
    expect(getLevelDisplayName({ code: "L5", name: "Level 5" })).toBe("5–6 tuổi");
  });

  test("keeps the stored name for an unmapped level code", () => {
    expect(getLevelDisplayName({ code: "L6", name: "Level 6" })).toBe("Level 6");
  });
});
