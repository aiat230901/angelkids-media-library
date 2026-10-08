import { afterEach, expect, test, vi } from "vitest";
import { listCategories, listContentTypes, listResources, getVideoResource } from "@/server/repositories/learning";
import { filterResources, getFilterOptions } from "@/domain/resource-filters";

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
  expect(new Set(groups.flat().map((item) => item.slug)).size).toBe(98);
  expect(groups.every((items) => items.length > 0)).toBe(true);
  expect(await getVideoResource(scopes[0], groups[0][0].slug)).toEqual(groups[0][0]);
  expect(await listResources({ categorySlug: "missing" })).toEqual([]);
});

test("development exposes the replacement songs with their filter metadata", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const songs = (await listResources({ categorySlug: "songs" }))
    .filter((item) => item.curriculumUnit?.monthNumber === "09");

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

test("October songs appear in their level, name, and curriculum filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const songs = await listResources({ categorySlug: "songs" });
  const october = getFilterOptions(songs).curriculumUnits.find((unit) => unit.monthNumber === "10");
  expect(october).toBeDefined();
  expect(filterResources(songs, { levelCode: "L12", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual(["this-is-me-song", "me-me-me"]);
  expect(filterResources(songs, { levelCode: "L3", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual(["i-am-unique", "i-see-i-see"]);
  expect(filterResources(songs, { levelCode: "L4", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual(["i-am-shining", "were-same-but-different"]);
  expect(filterResources(songs, { levelCode: "L5", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual(["im-unique", "happy-me"]);
  expect(filterResources(songs, { levelCode: "L5", query: "unique", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual(["im-unique"]);
});

test("development exposes the new Virtual Teacher Guide videos with their filter metadata", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const guides = (await listResources({ categorySlug: "watch", contentTypeSlug: "virtual-teacher-guide" }))
    .filter((item) => item.curriculumUnit?.monthNumber === "09");

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

test("October Virtual Teacher Guides appear in their level and curriculum filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const guides = await listResources({ categorySlug: "watch", contentTypeSlug: "virtual-teacher-guide" });
  const october = getFilterOptions(guides).curriculumUnits.find((unit) => unit.displayLabel === "10 - Bản thân | Tôi khác biệt");
  expect(october).toBeDefined();
  expect(filterResources(guides, { levelCode: "L3", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual([
    "my-feelings-my-gestures", "listen-and-follow-2-steps", "show-your-feelings", "follow-the-teacher",
  ]);
  expect(filterResources(guides, { levelCode: "L4", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual([
    "this-is-me", "listen-to-my-friends", "draw-my-body", "share-with-friends", "i-can-talk-about-me-virtual-teacher-guide",
  ]);
  expect(filterResources(guides, { levelCode: "L5", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual([
    "my-body-and-what-it-does", "about-me",
  ]);
  expect(filterResources(guides, { levelCode: "L4", query: "draw", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual(["draw-my-body"]);
});

test("development exposes the replacement stories with their filter metadata", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const stories = (await listResources({ categorySlug: "watch", contentTypeSlug: "stories" }))
    .filter((item) => item.curriculumUnit?.monthNumber === "09");

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

test("October stories appear in their level, name, and curriculum filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const stories = await listResources({ categorySlug: "watch", contentTypeSlug: "stories" });
  const october = getFilterOptions(stories).curriculumUnits.find((unit) => unit.monthNumber === "10");
  expect(october).toBeDefined();
  expect(filterResources(stories, { levelCode: "L12", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual(["mia-body-says-hello"]);
  expect(filterResources(stories, { levelCode: "L3", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual(["i-am-special"]);
  expect(filterResources(stories, { levelCode: "L4", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual(["bins-special-picture"]);
  expect(filterResources(stories, { levelCode: "L5", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual(["what-do-i-like-story", "mia-and-her-little-body-friends"]);
  expect(filterResources(stories, { levelCode: "L5", query: "little body friends", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual(["mia-and-her-little-body-friends"]);
});

test("development exposes the replacement dialogues with their filter metadata", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const dialogues = (await listResources({ categorySlug: "watch", contentTypeSlug: "dialogues" }))
    .filter((item) => item.curriculumUnit?.monthNumber === "09");

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

test("October dialogues appear with working level, name, and curriculum filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const dialogues = await listResources({ categorySlug: "watch", contentTypeSlug: "dialogues" });
  const options = getFilterOptions(dialogues);
  const october = options.curriculumUnits.find((unit) => unit.displayLabel === "10 - Bản thân | Tôi khác biệt");
  expect(october).toBeDefined();
  expect(options.levels.map((level) => level.code)).toContain("L3");
  const filters = { levelCode: "L3", query: "", curriculumUnitId: october!.id };
  expect(filterResources(dialogues, filters).map((resource) => resource.slug)).toEqual([
    "my-name-my-age-my-gender",
    "me-myself-and-i",
    "what-do-i-like",
    "my-body",
    "all-about-mia",
    "who-am-i-today",
  ]);
  expect(filterResources(dialogues, { ...filters, query: "all about mia" }).map((resource) => resource.slug)).toEqual(["all-about-mia"]);
  expect(filterResources(dialogues, { ...filters, levelCode: "L12" })).toEqual([]);
  expect(filterResources(dialogues, { ...filters, query: "missing name" })).toEqual([]);
  expect(filterResources(dialogues, { ...filters, curriculumUnitId: "missing-unit" })).toEqual([]);
});

test("October Level 4 dialogues appear in their age and curriculum filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const dialogues = await listResources({ categorySlug: "watch", contentTypeSlug: "dialogues" });
  const october = getFilterOptions(dialogues).curriculumUnits.find((unit) => unit.displayLabel === "10 - Bản thân | Tôi khác biệt");
  expect(october).toBeDefined();
  const filters = { levelCode: "L4", query: "", curriculumUnitId: october!.id };
  expect(filterResources(dialogues, filters).map((resource) => resource.slug)).toEqual([
    "all-about-me-questions-who-am-i",
    "my-likes-and-feelings",
    "show-how-i-feel",
    "lets-get-to-know-each-other",
    "my-ideas-and-experiences",
    "me-and-my-family",
  ]);
  expect(filterResources(dialogues, { ...filters, query: "likes" }).map((resource) => resource.slug)).toEqual(["my-likes-and-feelings"]);
});

test("October Level 5 dialogues appear in their age and curriculum filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const dialogues = await listResources({ categorySlug: "watch", contentTypeSlug: "dialogues" });
  const october = getFilterOptions(dialogues).curriculumUnits.find((unit) => unit.displayLabel === "10 - Bản thân | Tôi khác biệt");
  expect(october).toBeDefined();
  const filters = { levelCode: "L5", query: "", curriculumUnitId: october!.id };
  expect(filterResources(dialogues, filters).map((resource) => resource.slug)).toEqual([
    "i-can-talk-about-me",
    "lets-talk-tom-and-mia",
    "my-likes-and-why",
    "my-daily-life",
    "ask-me-about-me",
  ]);
  expect(filterResources(dialogues, { ...filters, query: "daily" }).map((resource) => resource.slug)).toEqual(["my-daily-life"]);
});

test("October dialogue books appear in their level, name, and curriculum filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const books = await listResources({ categorySlug: "read", contentTypeSlug: "dialogue-books" });
  const october = getFilterOptions(books).curriculumUnits.find((unit) => unit.monthNumber === "10");
  expect(october).toBeDefined();
  expect(filterResources(books, { levelCode: "L3", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual([
    "my-name-my-age-my-gender-dialogue-book", "me-myself-and-i-dialogue-book", "what-do-i-like-dialogue-book", "my-body-dialogue-book", "all-about-mia-dialogue-book", "who-am-i-today-dialogue-book",
  ]);
  expect(filterResources(books, { levelCode: "L4", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual([
    "all-about-me-questions-who-am-i-dialogue-book", "my-likes-and-feelings-dialogue-book", "show-how-i-feel-dialogue-book", "lets-get-to-know-each-other-dialogue-book", "my-ideas-and-experiences-dialogue-book", "me-and-my-family-dialogue-book",
  ]);
  expect(filterResources(books, { levelCode: "L5", query: "", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual([
    "i-can-talk-about-me-dialogue-book", "lets-talk-tom-and-mia-dialogue-book", "my-likes-and-why-dialogue-book", "my-daily-life-dialogue-book", "ask-me-about-me-dialogue-book",
  ]);
  expect(filterResources(books, { levelCode: "L5", query: "daily life", curriculumUnitId: october!.id }).map((resource) => resource.slug)).toEqual(["my-daily-life-dialogue-book"]);
});

test("production keeps database reads instead of silently using the manifest", async () => {
  vi.stubEnv("NODE_ENV", "production");
  await expect(listCategories()).rejects.toThrow("Database path reached");
  await expect(listContentTypes("watch")).rejects.toThrow("Database path reached");
  await expect(listResources({ categorySlug: "digital-flashcards" })).rejects.toThrow("Database path reached");
});


test("additional October songs match all three filters and open their video details", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const songs = await listResources({ categorySlug: "songs" });
  const october = getFilterOptions(songs).curriculumUnits.find((unit) => unit.displayLabel === "10 - Bản thân | Tôi khác biệt");
  expect(october).toBeDefined();
  for (const [slug, name, videoId, level] of [
    ["me-me-me", "Poem - Me, me, me!", "cBe3ro5JAOs", "L12"],
    ["i-see-i-see", "Poem - I see, I see", "hgQAPpGZNME", "L3"],
    ["were-same-but-different", "Poem - We're same but different", "Rl3Kpiz1to0", "L4"],
    ["happy-me", "Poem - Happy Me", "yHITiGFo9Hk", "L5"],
  ]) {
    const matches = filterResources(songs, { levelCode: level, query: name, curriculumUnitId: october!.id });
    expect(matches.map((resource) => resource.slug)).toEqual([slug]);
    expect(matches[0]).toMatchObject({
      assetName: name,
      externalUrl: `https://youtu.be/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      resourceFormat: "LEARNING_SONG_VIDEO",
      provider: "YOUTUBE",
      levels: [{ code: level }],
    });
    expect(await getVideoResource({ categorySlug: "songs" }, slug)).toEqual(matches[0]);
    expect(filterResources(songs, { levelCode: level === "L12" ? "L3" : "L12", query: name, curriculumUnitId: october!.id })).toEqual([]);
  }
});
