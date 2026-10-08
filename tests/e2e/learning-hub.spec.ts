import { expect, test } from "@playwright/test";

test("home presents exactly five category choices", async ({ page }) => {
  await page.goto("/learning");
  await expect(page.getByRole("heading", { name: "Hôm nay con muốn khám phá gì?" })).toBeVisible();
  await expect(page.locator(".category-grid .category-card")).toHaveCount(5);
  await expect(page.getByRole("link", { name: /Watch/ })).toHaveAttribute("href", "/learning/watch");
});

test("unknown video has a branded not-found action", async ({ page }) => {
  await page.goto("/learning/watch/stories/not-published");
  await expect(page.getByRole("heading", { name: "Không tìm thấy trang" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Về Learning Hub" })).toBeVisible();
});

test("Virtual Teacher Guide lists September and October videos", async ({ page }) => {
  await page.goto("/learning/watch");
  await expect(page.getByRole("link", { name: /Virtual Teacher Guide/ })).toHaveAttribute("href", "/learning/watch/virtual-teacher-guide");

  await page.goto("/learning/watch/virtual-teacher-guide");
  await expect(page.getByRole("heading", { name: "Virtual Teacher Guide – Hướng dẫn bài học", exact: true })).toBeVisible();
  await expect(page.locator(".resource-count")).toHaveText("14 học liệu");
  await expect(page.getByRole("link", { name: "My Body Can Talk!" })).toHaveAttribute("href", "/learning/watch/virtual-teacher-guide/my-body-can-talk");
  await expect(page.getByRole("link", { name: "Your turn!" })).toHaveAttribute("href", "/learning/watch/virtual-teacher-guide/your-turn");
  await expect(page.getByRole("link", { name: "What Do I Want" })).toHaveAttribute("href", "/learning/watch/virtual-teacher-guide/what-do-i-want");

  for (const [slug, videoId] of [["my-body-can-talk", "pC_GJtjBKdk"], ["your-turn", "ny0lv7h5XcM"], ["what-do-i-want", "pM57TVzQgpE"]]) {
    await page.goto(`/learning/watch/virtual-teacher-guide/${slug}`);
    await expect(page.locator("iframe")).toHaveAttribute("src", `https://www.youtube-nocookie.com/embed/${videoId}`);
  }
});

test("narrow viewport has no horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/learning");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("flashcard filters use a contained hybrid mobile layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/learning/digital-flashcards");

  const ageFilter = page.getByLabel("Độ tuổi");
  const topicFilter = page.getByLabel("Tháng & Chủ đề học");
  const reset = page.getByRole("button", { name: "Đặt lại bộ lọc" });
  const narrow = await Promise.all([ageFilter, topicFilter, reset].map((control) => control.boundingBox()));

  expect(narrow.every(Boolean)).toBe(true);
  expect(narrow[1]!.y).toBeGreaterThan(narrow[0]!.y);
  expect(narrow[2]!.y).toBeGreaterThan(narrow[1]!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await page.setViewportSize({ width: 440, height: 956 });
  const wide = await Promise.all([ageFilter, topicFilter, reset].map((control) => control.boundingBox()));

  expect(wide.every(Boolean)).toBe(true);
  expect(Math.abs(wide[0]!.y - wide[1]!.y)).toBeLessThan(2);
  expect(wide[2]!.y).toBeGreaterThan(wide[0]!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("Watch keeps its copy on tablet and hides only its description on mobile", async ({ page }) => {
  const watch = page.getByRole("link", { name: /Watch/ }).first();

  await page.setViewportSize({ width: 768, height: 800 });
  await page.goto("/learning");
  await expect(watch.locator("img")).toHaveAttribute("src", /watch\.png/);
  await expect(watch.locator(".category-description")).toBeVisible();

  await page.setViewportSize({ width: 390, height: 800 });
  await expect(watch.locator("strong")).toHaveText("Watch – Luyện xem");
  await expect(watch.locator(".cta")).toBeVisible();
  await expect(watch.locator(".category-description")).toBeHidden();
});

test("featured Print and Play stays full-width at a 440px mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 440, height: 956 });
  await page.goto("/learning");

  const widths = await page.getByRole("link", { name: /Print and Play/ }).evaluate((card) => ({
    card: card.getBoundingClientRect().width,
    art: card.querySelector(".category-art")?.getBoundingClientRect().width ?? 0,
  }));

  expect(widths.art / widths.card).toBeGreaterThan(0.9);
});

for (const path of ["/learning/songs", "/learning/digital-flashcards", "/learning/print-and-plays"]) {
  test(`${path} puts its Vietnamese title translation on a new line`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1 .learning-label-translation")).toHaveCSS("display", "block");
  });
}

for (const [path, heading] of [
  ["/learning/watch", "Xem và khám phá"],
  ["/learning/read", "Lật mở từng trang sách"],
  ["/learning/watch/stories", "Animated Stories"],
  ["/learning/watch/dialogues", "Animated Dialogues"],
  ["/learning/watch/virtual-teacher-guide", "Virtual Teacher Guide – Hướng dẫn bài học"],
  ["/learning/read/storybooks", "Digital Storybooks"],
  ["/learning/read/dialogue-books", "Digital Dialogue Books"],
  ["/learning/songs", "Songs & Poems – Bài hát & Thơ"],
  ["/learning/digital-flashcards", "Flashcards – Thẻ học tập"],
  ["/learning/print-and-plays", "Print and Play – Tài liệu in & Chơi cùng con"],
] as const) {
  test(`${path} renders its scoped page`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: heading, exact: true }).first()).toBeVisible();
  });
}


test("October Poems filter by age, product name, and topic and open the correct player", async ({ page }) => {
  for (const [slug, name, videoId, level] of [
    ["me-me-me", "Poem - Me, me, me!", "cBe3ro5JAOs", "L12"],
    ["i-see-i-see", "Poem - I see, I see", "hgQAPpGZNME", "L3"],
    ["were-same-but-different", "Poem - We're same but different", "Rl3Kpiz1to0", "L4"],
    ["happy-me", "Poem - Happy Me", "yHITiGFo9Hk", "L5"],
  ]) {
    await page.goto("/learning/songs");
    await page.getByLabel("Tháng & Chủ đề học").selectOption({ label: "10 - Bản thân | Tôi khác biệt" });
    await page.getByLabel("Độ tuổi").selectOption(level);
    await page.getByLabel("Tên học liệu").fill(name);
    await expect(page.locator(".resource-count")).toHaveText("1 học liệu");
    const card = page.getByRole("link", { name, exact: true });
    await expect(card).toHaveAttribute("href", `/learning/songs/${slug}`);
    await card.click();
    await expect(page.locator("iframe")).toHaveAttribute("src", `https://www.youtube-nocookie.com/embed/${videoId}`);
  }
});

test("September and October Print and Play cards use the shared Drive destination", async ({ page }) => {
  await page.goto("/learning/print-and-plays");
  const cards = page.locator(".unit-card");
  await expect(cards).toHaveCount(2);
  for (const card of await cards.all()) {
    await expect(card).toHaveAttribute("href", "https://drive.google.com/drive/folders/1Ukt9DHvoBpZfP9tT59mhlYN4zGUyIayJ?usp=drive_link");
    await expect(card).toHaveAttribute("target", "_blank");
    await expect(card).toHaveAttribute("rel", "noopener noreferrer");
  }
});
