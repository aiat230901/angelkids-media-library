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
  expect(new Set(groups.flat().map((item) => item.slug)).size).toBe(148);
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

test("November songs appear in their route and all three filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const songs = await listResources({ categorySlug: "songs" });
  const november = getFilterOptions(songs).curriculumUnits.find((unit) => unit.displayLabel === "11 - Nghề nghiệp | Bé tài năng");
  expect(november).toBeDefined();

  for (const [slug, assetName, videoId, levelCode] of [
    ["build-build-build", "Build_Build_Build", "vnrZxo273ng", "L12"],
    ["song-float-or-sink", "Song Float or Sink", "6iNwGNJ2W0s", "L3"],
    ["lets-clean-up", "Lets Clean Up", "GROQAxlpCQQ", "L4"],
    ["my-little-house", "My Little House", "fdgZTzKXZwI", "L5"],
  ]) {
    const matches = filterResources(songs, { levelCode, query: assetName, curriculumUnitId: november!.id });
    expect(matches.map((resource) => resource.slug)).toEqual([slug]);
    expect(matches[0]).toMatchObject({
      externalUrl: `https://youtu.be/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      levels: [{ code: levelCode }],
    });
    expect(await getVideoResource({ categorySlug: "songs" }, slug)).toEqual(matches[0]);
  }
});

test("November poems appear in their route and all three filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const songs = await listResources({ categorySlug: "songs" });
  const november = getFilterOptions(songs).curriculumUnits.find((unit) => unit.displayLabel === "11 - Nghề nghiệp | Bé tài năng");
  expect(november).toBeDefined();

  for (const [slug, assetName, videoId, levelCode] of [
    ["poem-i-want-to-try", "Poem_I want to try", "nTDrOOi2CG4", "L12"],
    ["poem-what-job-do-you-play", "Poem_What job do you play?", "ijEyPY1YdDQ", "L3"],
    ["poem-i-am-an-environment-proctector", "Poem_I am an environment proctector", "PVfkFfIdwmc", "L4"],
    ["poem-little-inventor", "Poem_Little inventor", "dCHT8nGlL8c", "L5"],
  ]) {
    const matches = filterResources(songs, { levelCode, query: assetName, curriculumUnitId: november!.id });
    expect(matches.map((resource) => resource.slug)).toEqual([slug]);
    expect(matches[0]).toMatchObject({
      externalUrl: `https://youtu.be/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      levels: [{ code: levelCode }],
    });
    expect(await getVideoResource({ categorySlug: "songs" }, slug)).toEqual(matches[0]);
  }
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

test("November Virtual Teacher Guides appear in their route and all three filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const guides = await listResources({ categorySlug: "watch", contentTypeSlug: "virtual-teacher-guide" });
  const november = getFilterOptions(guides).curriculumUnits.find((unit) => unit.displayLabel === "11 - Nghề nghiệp | Bé tài năng");
  expect(november).toBeDefined();

  for (const [slug, assetName, videoId, levelCode] of [
    ["meet-our-community-helpers", "Meet Our Community Helpers", "z_BHKTagNn0", "L3"],
    ["guess-who-they-are", "Guess Who They Are!", "mbtq9i1n2aI", "L3"],
    ["listen-move-and-do", "Listen, Move, and Do!", "_gJIZSpc4GI", "L3"],
    ["what-do-they-do", "What do they do?", "s7kt99pI_Hc", "L4"],
    ["lets-talk-about-jobs", "Let’s Talk About Jobs", "TTBLWo77sdg", "L4"],
    ["who-does-what", "Who Does What?", "p1nLyIgZu0U", "L5"],
  ]) {
    const matches = filterResources(guides, { levelCode, query: assetName, curriculumUnitId: november!.id });
    expect(matches.map((resource) => resource.slug)).toEqual([slug]);
    expect(matches[0]).toMatchObject({
      externalUrl: `https://youtu.be/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      levels: [{ code: levelCode }],
    });
    expect(await getVideoResource({ categorySlug: "watch", contentTypeSlug: "virtual-teacher-guide" }, slug)).toEqual(matches[0]);
  }
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

test("November stories appear in their route and all three filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const stories = await listResources({ categorySlug: "watch", contentTypeSlug: "stories" });
  const november = getFilterOptions(stories).curriculumUnits.find((unit) => unit.displayLabel === "11 - Nghề nghiệp | Bé tài năng");
  expect(november).toBeDefined();

  for (const [slug, assetName, videoId, levelCode] of [
    ["bins-big-dreams", "Bin’s Big Dreams", "r8UrVXDKZlM", "L12"],
    ["the-funny-little-town", "The Funny Little Town", "iCUQFfcJCMM", "L3"],
    ["oops-wrong-tool", "Oops! Wrong Tool!", "gfe82NdKhP0", "L4"],
    ["the-day-all-the-jobs-disappeared", "The Day All the Jobs Disappeared", "AvIgQ0321ho", "L5"],
  ]) {
    const matches = filterResources(stories, { levelCode, query: assetName, curriculumUnitId: november!.id });
    expect(matches.map((resource) => resource.slug)).toEqual([slug]);
    expect(matches[0]).toMatchObject({
      externalUrl: `https://youtu.be/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      levels: [{ code: levelCode }],
    });
    expect(await getVideoResource({ categorySlug: "watch", contentTypeSlug: "stories" }, slug)).toEqual(matches[0]);
  }
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

test("November dialogue appears in its route and all three filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const dialogues = await listResources({ categorySlug: "watch", contentTypeSlug: "dialogues" });
  const november = getFilterOptions(dialogues).curriculumUnits.find((unit) => unit.displayLabel === "11 - Nghề nghiệp | Bé tài năng");
  expect(november).toBeDefined();

  const matches = filterResources(dialogues, {
    levelCode: "L3",
    query: "Bin’s Little Job Adventures",
    curriculumUnitId: november!.id,
  });
  expect(matches).toHaveLength(1);
  expect(matches[0]).toMatchObject({
    slug: "bins-little-job-adventures",
    externalUrl: "https://youtu.be/QhQKCyEBaw8",
    thumbnailUrl: "https://i.ytimg.com/vi/QhQKCyEBaw8/hqdefault.jpg",
    levels: [{ code: "L3" }],
  });
  expect(await getVideoResource(
    { categorySlug: "watch", contentTypeSlug: "dialogues" },
    "bins-little-job-adventures",
  )).toEqual(matches[0]);
});

test("new November dialogues appear in their route and all three filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const dialogues = await listResources({ categorySlug: "watch", contentTypeSlug: "dialogues" });
  const november = getFilterOptions(dialogues).curriculumUnits.find((unit) => unit.displayLabel === "11 - Nghề nghiệp | Bé tài năng");
  expect(november).toBeDefined();

  for (const [slug, assetName, videoId] of [
    ["what-do-you-want-to-be", "What Do You Want to Be?", "vkI9lc4oOAc"],
    ["when-i-grow-up", "When I Grow Up", "y9mMQ5f7_vc"],
    ["guess-what-i-can-do", "Guess What I Can Do!", "xC4UHgIQS1A"],
    ["jobs-in-action", "Jobs in Action", "VAOokv-nvsk"],
  ]) {
    const matches = filterResources(dialogues, { levelCode: "L3", query: assetName, curriculumUnitId: november!.id });
    expect(matches.map((resource) => resource.slug)).toEqual([slug]);
    expect(matches[0]).toMatchObject({
      externalUrl: `https://youtu.be/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      levels: [{ code: "L3" }],
    });
    expect(await getVideoResource({ categorySlug: "watch", contentTypeSlug: "dialogues" }, slug)).toEqual(matches[0]);
  }
});

test("November Level 4 dialogues appear in their route and all three filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const dialogues = await listResources({ categorySlug: "watch", contentTypeSlug: "dialogues" });
  const november = getFilterOptions(dialogues).curriculumUnits.find((unit) => unit.displayLabel === "11 - Nghề nghiệp | Bé tài năng");
  expect(november).toBeDefined();

  for (const [slug, assetName, videoId] of [
    ["my-future-my-dream", "My Future, My Dream", "vX9Wt25lbCQ"],
    ["bins-job-tool-box", "Bin’s Job Tool Box", "_SOA503cMEU"],
    ["mias-little-job-tour", "Mia’s Little Job Tour", "h2NBM3_JnKQ"],
    ["who-am-i-at-work", "Who Am I at Work?", "Q-4xmCpn6mM"],
  ]) {
    const matches = filterResources(dialogues, { levelCode: "L4", query: assetName, curriculumUnitId: november!.id });
    expect(matches.map((resource) => resource.slug)).toEqual([slug]);
    expect(matches[0]).toMatchObject({
      externalUrl: `https://youtu.be/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      levels: [{ code: "L4" }],
    });
    expect(await getVideoResource({ categorySlug: "watch", contentTypeSlug: "dialogues" }, slug)).toEqual(matches[0]);
  }
});

test("November Level 5 dialogues appear in their route and all three filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const dialogues = await listResources({ categorySlug: "watch", contentTypeSlug: "dialogues" });
  const november = getFilterOptions(dialogues).curriculumUnits.find((unit) => unit.displayLabel === "11 - Nghề nghiệp | Bé tài năng");
  expect(november).toBeDefined();

  for (const [slug, assetName, videoId] of [
    ["lets-explore-jobs", "Let’s Explore Jobs!", "Zwm4TTqsTTM"],
    ["my-favorite-job", "My Favorite Job", "6cUUhKC_UCA"],
    ["a-day-at-work", "A Day at Work", "E84rk-QK53o"],
    ["when-i-grow-up-level-5", "When I Grow Up", "HvHFqyfdAu4"],
    ["tools-for-the-job", "Tools for the Job", "vU9Kb-DIiTs"],
  ]) {
    const matches = filterResources(dialogues, { levelCode: "L5", query: assetName, curriculumUnitId: november!.id });
    expect(matches.map((resource) => resource.slug)).toEqual([slug]);
    expect(matches[0]).toMatchObject({
      externalUrl: `https://youtu.be/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      levels: [{ code: "L5" }],
    });
    expect(await getVideoResource({ categorySlug: "watch", contentTypeSlug: "dialogues" }, slug)).toEqual(matches[0]);
  }
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

test("November dialogue books appear in their level, name, and curriculum filters", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const books = await listResources({ categorySlug: "read", contentTypeSlug: "dialogue-books" });
  const november = getFilterOptions(books).curriculumUnits.find((unit) => unit.displayLabel === "11 - Nghề nghiệp | Bé tài năng");
  expect(november).toBeDefined();

  for (const [slug, assetName, levelCode, thumbnailId] of [
    ["bins-little-job-adventures-dialogue-book", "Bin’s Little Job Adventures", "L3", "4caadb967039f4701151acc0cfde11773d695e5b"],
    ["what-do-you-want-to-be-dialogue-book", "What Do You Want to Be?", "L3", "d8ebe364ee254ab4fea9f032e43a35f4da0ab1f6"],
    ["when-i-grow-up-dialogue-book", "When I Grow Up", "L3", "46abd8f155bdcc55b6a57d72370d6bf681dc2c51"],
    ["guess-what-i-can-do-dialogue-book", "Guess What I Can Do!", "L3", "a74ba1c4314e32f59fe6d0ce5c25a2bc826c2fb2"],
    ["jobs-in-action-dialogue-book", "Jobs in Action", "L3", "a7b814fb1292f067bac4f761355c5dbd6d5d8b35"],
    ["my-future-my-dream-dialogue-book", "My Future, My Dream", "L4", "e4bd7cf6c0328678d54fff390452b657cfa8b6fe"],
    ["bins-job-tool-box-dialogue-book", "Bin’s Job Tool Box", "L4", "2150fe043305e67b16017ecc05c63bfa2239e39d"],
    ["mias-little-job-tour-dialogue-book", "Mia’s Little Job Tour", "L4", "bfd678b3b2719bb13356b6349bc20bcfa78cd996"],
    ["who-am-i-at-work-dialogue-book", "Who Am I at Work?", "L4", "46f216c50fd427517d701dd1c03335249e5ee27a"],
    ["lets-explore-jobs-dialogue-book", "Let’s Explore Jobs!", "L5", "e56720d7f2a97c96d695b128faf2b5ea1f7e383b"],
    ["my-favorite-job-dialogue-book", "My Favorite Job", "L5", "f995ecd266088715ad77e4e35403556e07a80f9e"],
    ["a-day-at-work-dialogue-book", "A Day at Work", "L5", "a40eb1346a439a62f7d8a182a5b8ea1d87aac55c"],
    ["when-i-grow-up-level-5-dialogue-book", "When I Grow Up", "L5", "01d7a734cc0b3041fdda713ba8afa3829a1ef2d9"],
    ["tools-for-the-job-dialogue-book", "Tools for the Job", "L5", "9b66872e2d8a80a54318552f243070e5a624d77c"],
  ]) {
    const matches = filterResources(books, { levelCode, query: assetName, curriculumUnitId: november!.id });
    expect(matches.map((resource) => resource.slug)).toEqual([slug]);
    expect(matches[0]).toMatchObject({
      thumbnailUrl: `https://cdnm.heyzine.com/files/uploaded/${thumbnailId}.pdf-thumb.jpg`,
      levels: [{ code: levelCode }],
    });
  }
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
