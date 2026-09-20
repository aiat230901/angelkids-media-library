import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import LearningPage from "@/app/learning/page";
import { listCategories } from "@/server/repositories/learning";

vi.mock("@/server/repositories/learning", () => ({ listCategories: vi.fn() }));

beforeEach(() => {
  vi.mocked(listCategories).mockResolvedValue([
    { id: "watch", slug: "watch", name: "Watch", description: "Watch description", illustrationUrl: "/illustrations/watch.png", sortOrder: 10 },
    { id: "read", slug: "read", name: "Read", description: "Read description", illustrationUrl: "/illustrations/read.png", sortOrder: 20 },
    { id: "songs", slug: "songs", name: "Songs", description: "Songs description", illustrationUrl: "/illustrations/songs.png", sortOrder: 30 },
    { id: "digital-flashcards", slug: "digital-flashcards", name: "Digital Flashcards", description: "Flashcards description", illustrationUrl: "/illustrations/digital-flashcards.png", sortOrder: 40 },
    { id: "print-and-plays", slug: "print-and-plays", name: "Print and Plays", description: "Print description", illustrationUrl: "/illustrations/print-and-plays.png", sortOrder: 50 },
  ] as never);
});

test("applies the compact responsive card treatment to Read", async () => {
  render(await LearningPage());

  expect(screen.getByRole("link", { name: /Read/ })).toHaveClass("watch-natural-media", "watch-stack-on-tablet");
});

test("applies the compact responsive card treatment to the remaining categories", async () => {
  render(await LearningPage());

  for (const name of ["Songs", "Flashcards", "Print and Play"]) {
    expect(screen.getByRole("link", { name: new RegExp(name) })).toHaveClass("watch-natural-media", "watch-stack-on-tablet");
  }
});

test("uses the approved presentation descriptions for learning categories", async () => {
  render(await LearningPage());

  for (const description of [
    "Stories & conversations – xem những câu chuyện và hội thoại sinh động.",
    "Flip & read along – lật mở sách, nghe và đọc theo từng trang.",
    "Learn with songs & rhymes – học từ và câu mới qua những giai điệu vui.",
    "Look, listen & practice – cùng con xem, cùng con đọc với thẻ từ vựng.",
    "Print & learn together – tải học liệu, in ra và cùng con học qua trò chơi.",
  ]) {
    expect(screen.getByText(description)).toHaveClass("category-description");
  }
});

test("uses the approved CTA on each learning category card", async () => {
  render(await LearningPage());

  expect(screen.getAllByText("Play")).toHaveLength(5);
});
