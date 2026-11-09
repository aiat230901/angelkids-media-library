import { afterEach, expect, test, vi } from "vitest";
import { loadResourcesPreview } from "@/server/catalog-preview";

afterEach(() => vi.unstubAllEnvs());

test("loads the four September age bands from the manifest without a database", async () => {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("DATABASE_URL", "");
  const resources = (await loadResourcesPreview({ categorySlug: "digital-flashcards" }))
    .filter((resource) => resource.curriculumUnit?.monthNumber === "09");
  expect(resources.map((resource) => resource.levels.map((level) => level.code))).toEqual([
    ["L12"], ["L3"], ["L4"], ["L5"],
  ]);
  expect(resources.every((resource) => resource.curriculumUnit?.monthNumber === "09")).toBe(true);
});

test("loads November flashcards with their first-page thumbnails", async () => {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("DATABASE_URL", "");
  const resources = (await loadResourcesPreview({ categorySlug: "digital-flashcards" }))
    .filter((resource) => resource.curriculumUnit?.displayLabel === "11 - Nghề nghiệp | Bé tài năng");

  expect(resources.map(({ slug, levels, thumbnailUrl }) => ({
    slug,
    levels: levels.map((level) => level.code),
    thumbnailUrl,
  }))).toEqual([
    ["teacher-docter-builder-flashcards-level-1-2", ["L12"], "749f8a7617eedf5a11e34c5fe6c9f6b4c3787931"],
    ["little-scientists-flashcards-level-3", ["L3"], "3ded8660c76a83929fbd37a07289074e83834e7a"],
    ["environment-protectors-flashcards-level-4", ["L4"], "6413fdf39e3da405e81cac644891fd4f9b3f298f"],
    ["little-inventors-engineers-flashcards-level-5", ["L5"], "1348514686ef343334283dc81a68c94d6ed1b816"],
  ].map(([slug, levels, id]) => ({
    slug,
    levels,
    thumbnailUrl: `https://cdnm.heyzine.com/files/uploaded/${id}.pdf-thumb.jpg`,
  })));
});

test("rejects manifest preview in production", async () => {
  vi.stubEnv("NODE_ENV", "production");
  await expect(loadResourcesPreview({ categorySlug: "digital-flashcards" })).rejects.toThrow("development-only");
});
