import { afterEach, expect, test, vi } from "vitest";
import { loadResourcesPreview } from "@/server/catalog-preview";

afterEach(() => vi.unstubAllEnvs());

test("loads the four September age bands from the manifest without a database", async () => {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("DATABASE_URL", "");
  const resources = await loadResourcesPreview({ categorySlug: "digital-flashcards" });
  expect(resources.map((resource) => resource.levels.map((level) => level.code))).toEqual([
    ["L12"], ["L3"], ["L4"], ["L5"],
  ]);
  expect(resources.every((resource) => resource.curriculumUnit?.monthNumber === "09")).toBe(true);
});

test("rejects manifest preview in production", async () => {
  vi.stubEnv("NODE_ENV", "production");
  await expect(loadResourcesPreview({ categorySlug: "digital-flashcards" })).rejects.toThrow("development-only");
});
