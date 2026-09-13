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

test("featured Print and Plays stays full-width at a 440px mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 440, height: 956 });
  await page.goto("/learning");

  const widths = await page.getByRole("link", { name: /Print and Plays/ }).evaluate((card) => ({
    card: card.getBoundingClientRect().width,
    art: card.querySelector(".category-art")?.getBoundingClientRect().width ?? 0,
  }));

  expect(widths.art / widths.card).toBeGreaterThan(0.9);
});

for (const [path, heading] of [
  ["/learning/watch", "Xem và khám phá"],
  ["/learning/read", "Lật mở từng trang sách"],
  ["/learning/watch/stories", "Animated Stories"],
  ["/learning/watch/dialogues", "Animated Dialogues"],
  ["/learning/read/storybooks", "Digital Storybooks"],
  ["/learning/read/dialogue-books", "Digital Dialogue Books"],
  ["/learning/songs", "Songs & Poems – Bài hát & Thơ"],
  ["/learning/digital-flashcards", "Flashcards – Thẻ học tập"],
  ["/learning/print-and-plays", "Print and Plays – Tài liệu in & Chơi cùng con"],
] as const) {
  test(`${path} renders its scoped page`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: heading, exact: true }).first()).toBeVisible();
  });
}
