import { afterEach, expect, test, vi } from "vitest";
import { listCategories, listContentTypes, listResources, getVideoResource } from "@/server/repositories/learning";

vi.mock("@/server/db", () => ({ getPrisma: () => { throw new Error("Database path reached"); } }));
afterEach(() => vi.unstubAllEnvs());

test("development serves navigation and all 33 resources without accessing the database", async () => {
  vi.stubEnv("NODE_ENV", "development");
  expect((await listCategories()).map((item) => item.slug)).toEqual(["watch", "read", "songs", "digital-flashcards", "print-and-plays"]);
  expect((await listContentTypes("watch")).map((item) => item.slug)).toEqual(["stories", "dialogues"]);
  expect((await listContentTypes("read")).map((item) => item.slug)).toEqual(["storybooks", "dialogue-books"]);
  const scopes = [
    { categorySlug: "watch", contentTypeSlug: "stories" },
    { categorySlug: "watch", contentTypeSlug: "dialogues" },
    { categorySlug: "read", contentTypeSlug: "storybooks" },
    { categorySlug: "read", contentTypeSlug: "dialogue-books" },
    { categorySlug: "songs" }, { categorySlug: "digital-flashcards" }, { categorySlug: "print-and-plays" },
  ];
  const groups = await Promise.all(scopes.map(listResources));
  expect(new Set(groups.flat().map((item) => item.slug)).size).toBe(33);
  expect(groups.every((items) => items.length > 0)).toBe(true);
  expect(await getVideoResource(scopes[0], groups[0][0].slug)).toEqual(groups[0][0]);
  expect(await listResources({ categorySlug: "missing" })).toEqual([]);
});

test("development exposes the two September L12 songs with official YouTube thumbnails", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const songs = await listResources({ categorySlug: "songs" });
  expect(songs.filter((item) => item.levels.some((level) => level.code === "L12")).map((item) => ({
    slug: item.slug,
    externalUrl: item.externalUrl,
    thumbnailUrl: item.thumbnailUrl,
    month: item.curriculumUnit?.monthNumber,
  }))).toEqual([
    {
      slug: "our-happy-class",
      externalUrl: "https://youtu.be/MnNF9sASw4w",
      thumbnailUrl: "https://i.ytimg.com/vi/MnNF9sASw4w/hqdefault.jpg",
      month: "09",
    },
    {
      slug: "hello-and-goodbye-poem",
      externalUrl: "https://youtu.be/7ahJrScAIfE",
      thumbnailUrl: "https://i.ytimg.com/vi/7ahJrScAIfE/hqdefault.jpg",
      month: "09",
    },
  ]);
});

test("production keeps database reads instead of silently using the manifest", async () => {
  vi.stubEnv("NODE_ENV", "production");
  await expect(listCategories()).rejects.toThrow("Database path reached");
  await expect(listContentTypes("watch")).rejects.toThrow("Database path reached");
  await expect(listResources({ categorySlug: "digital-flashcards" })).rejects.toThrow("Database path reached");
});
