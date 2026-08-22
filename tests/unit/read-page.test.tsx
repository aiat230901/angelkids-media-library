import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import ReadPage from "@/app/learning/read/page";
import { listContentTypes } from "@/server/repositories/learning";

vi.mock("@/server/repositories/learning", () => ({ listContentTypes: vi.fn() }));

beforeEach(() => {
  vi.mocked(listContentTypes).mockResolvedValue([
    { id: "storybooks", slug: "storybooks", name: "Storybooks", description: "Storybook description", illustrationUrl: "/illustrations/storybooks.png", sortOrder: 10 },
    { id: "dialogue-books", slug: "dialogue-books", name: "Dialogue Books", description: "Dialogue book description", illustrationUrl: "/illustrations/dialogue-books.png", sortOrder: 20 },
  ] as never);
});

test("gives Read content-type cards the compact non-cropping responsive treatment", async () => {
  render(await ReadPage());

  for (const name of ["Storybooks", "Dialogue Books"]) {
    expect(screen.getByRole("link", { name: new RegExp(name) })).toHaveClass("watch-natural-media", "watch-stack-on-tablet", "square-media-on-desktop");
  }
});
