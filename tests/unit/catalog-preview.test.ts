import { afterEach, expect, test, vi } from "vitest";
import { listCategories, listContentTypes, listResources, getVideoResource } from "@/server/repositories/learning";

vi.mock("@/server/db", () => ({ getPrisma: () => { throw new Error("Database path reached"); } }));
afterEach(() => vi.unstubAllEnvs());

test("development serves every configured learning resource group", async () => {
  vi.stubEnv("NODE_ENV", "development");
  expect((await listCategories()).map((item) => item.slug)).toEqual(["watch", "read", "songs", "digital-flashcards", "print-and-plays"]);
  expect((await listContentTypes("watch")).map((item) => item.slug)).toEqual(["stories", "dialogues", "virtual-teacher-guide"]);
  expect((await listContentTypes("read")).map((item) => item.slug)).toEqual(["storybooks", "dialogue-books"]);
  const scopes = [
    { categorySlug: "watch", contentTypeSlug: "stories" },
    { categorySlug: "watch", contentTypeSlug: "dialogues" },
    { categorySlug: "watch", contentTypeSlug: "virtual-teacher-guide" },
    { categorySlug: "read", contentTypeSlug: "storybooks" },
    { categorySlug: "read", contentTypeSlug: "dialogue-books" },
    { categorySlug: "songs" }, { categorySlug: "digital-flashcards" }, { categorySlug: "print-and-plays" },
  ];
  const groups = await Promise.all(scopes.map(listResources));
  expect(new Set(groups.flat().map((item) => item.slug)).size).toBe(36);
  expect(groups.every((items) => items.length > 0)).toBe(true);
  expect(await getVideoResource(scopes[0], groups[0][0].slug)).toEqual(groups[0][0]);
  expect(await listResources({ categorySlug: "missing" })).toEqual([]);
});

test("development exposes the replacement songs with their filter metadata", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const songs = await listResources({ categorySlug: "songs" });

  expect(songs.map((item) => ({
    slug: item.slug,
    assetName: item.assetName,
    externalUrl: item.externalUrl,
    thumbnailUrl: item.thumbnailUrl,
    levelCodes: item.levels.map((level) => level.code),
    topic: item.curriculumUnit?.displayLabel,
  }))).toEqual([
    ["our-happy-class", "Our Happy Class.", "bU0w1jEMzM0", ["L12"]],
    ["hello-and-goodbye-poem", "Hello and Goodbye - Poem.", "bnLn0RvJ4Mk", ["L12"]],
    ["poem-fun-at-school", "Poem - Fun at School!", "nFW7u6S8e20", ["L3"]],
    ["learn-and-play-together", "Learn and Play Together.", "nq-yKDRbJe0", ["L3"]],
    ["hi-teacher-see-you-mom-dad", "Hi Teacher, See you Mom, Dad", "SSdh8Wub-Ho", ["L3", "L4", "L5"]],
    ["poem-a-happy-school-day", "Poem - A Happy School Day.", "knF24v2mtLc", ["L4"]],
    ["happy-class-rules", "Happy Class Rules", "S5VekqBBwJ4", ["L4"]],
    ["poem-ready-set-learn", "Poem - Ready, Set, Learn!", "c8KOG7R697I", ["L5"]],
    ["line-up-little-friends", "Line Up, Little Friends.", "JoYF6jnpDVw", ["L5"]],
  ].map(([slug, assetName, videoId, levelCodes]) => ({
    slug,
    assetName,
    externalUrl: `https://youtu.be/${videoId}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    levelCodes,
    topic: "09 - Trường học | Chào năm học mới",
  })));
});

test("development exposes the new Virtual Teacher Guide videos with their filter metadata", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const guides = await listResources({ categorySlug: "watch", contentTypeSlug: "virtual-teacher-guide" });

  expect(guides.map((item) => ({
    slug: item.slug,
    assetName: item.assetName,
    externalUrl: item.externalUrl,
    thumbnailUrl: item.thumbnailUrl,
    levelCodes: item.levels.map((level) => level.code),
    topic: item.curriculumUnit?.displayLabel,
  }))).toEqual([
    ["my-body-can-talk", "My Body Can Talk!", "pC_GJtjBKdk", ["L5"]],
    ["your-turn", "Your turn!", "ny0lv7h5XcM", ["L3", "L4", "L5"]],
    ["what-do-i-want", "What Do I Want", "pM57TVzQgpE", ["L3", "L4"]],
  ].map(([slug, assetName, videoId, levelCodes]) => ({
    slug,
    assetName,
    externalUrl: `https://youtu.be/${videoId}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    levelCodes,
    topic: "09 - Trường học | Chào năm học mới",
  })));
});

test("development exposes the replacement stories with their filter metadata", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const stories = await listResources({ categorySlug: "watch", contentTypeSlug: "stories" });

  expect(stories.map((item) => ({
    slug: item.slug,
    externalUrl: item.externalUrl,
    thumbnailUrl: item.thumbnailUrl,
    levelCodes: item.levels.map((level) => level.code),
    month: item.curriculumUnit?.monthNumber,
    topic: item.curriculumUnit?.displayLabel,
  }))).toEqual([
    {
      slug: "the-little-seeds-story",
      externalUrl: "https://youtu.be/59Os2LQaWE8",
      thumbnailUrl: "https://i.ytimg.com/vi/59Os2LQaWE8/hqdefault.jpg",
      levelCodes: ["L3", "L4"],
      month: "09",
      topic: "09 - Trường học | Chào năm học mới",
    },
    {
      slug: "where-is-my-pencil",
      externalUrl: "https://youtu.be/HMaQm8pSZ8s",
      thumbnailUrl: "https://i.ytimg.com/vi/HMaQm8pSZ8s/hqdefault.jpg",
      levelCodes: ["L4", "L5"],
      month: "09",
      topic: "09 - Trường học | Chào năm học mới",
    },
    {
      slug: "thank-you-helpers",
      externalUrl: "https://youtu.be/6NknxAJsfQY",
      thumbnailUrl: "https://i.ytimg.com/vi/6NknxAJsfQY/hqdefault.jpg",
      levelCodes: ["L5"],
      month: "09",
      topic: "09 - Trường học | Chào năm học mới",
    },
  ]);
});

test("development exposes the replacement dialogues with their filter metadata", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const dialogues = await listResources({ categorySlug: "watch", contentTypeSlug: "dialogues" });

  expect(dialogues.map((item) => ({
    slug: item.slug,
    assetName: item.assetName,
    externalUrl: item.externalUrl,
    thumbnailUrl: item.thumbnailUrl,
    levelCodes: item.levels.map((level) => level.code),
    topic: item.curriculumUnit?.displayLabel,
  }))).toEqual([
    ["mias-happy-classroom", "Mia's happy classroom", "oJW3vA0PZFo", ["L3"]],
    ["a-day-of-kind-words", "A Day of Kind Words", "49Lq3D3bzIE", ["L3"]],
    ["my-happy-classroom", "My Happy Classroom", "cqooqdE9cIc", ["L3"]],
    ["can-we-play-together", "Can We Play Together", "dmdn92aL2Og", ["L3"]],
    ["i-say-what-i-want", "I say what I want", "kCS2MOXv0_M", ["L3"]],
    ["lets-play-and-learn", "Let’s Play and Learn!", "r3CGnQPNpiw", ["L3", "L4"]],
    ["tell-me-more", "Tell me more", "wOylWRzWx8k", ["L4", "L5"]],
    ["what-can-it-do", "What Can It Do", "PPgY8pBrQIA", ["L5"]],
  ].map(([slug, assetName, videoId, levelCodes]) => ({
    slug,
    assetName,
    externalUrl: `https://youtu.be/${videoId}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    levelCodes,
    topic: "09 - Trường học | Chào năm học mới",
  })));
});

test("production keeps database reads instead of silently using the manifest", async () => {
  vi.stubEnv("NODE_ENV", "production");
  await expect(listCategories()).rejects.toThrow("Database path reached");
  await expect(listContentTypes("watch")).rejects.toThrow("Database path reached");
  await expect(listResources({ categorySlug: "digital-flashcards" })).rejects.toThrow("Database path reached");
});
