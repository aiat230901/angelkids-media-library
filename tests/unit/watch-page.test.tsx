import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import WatchPage from "@/app/learning/watch/page";
import { listContentTypes } from "@/server/repositories/learning";

vi.mock("@/server/repositories/learning", () => ({ listContentTypes: vi.fn() }));

beforeEach(() => {
  vi.mocked(listContentTypes).mockResolvedValue([
    { id: "stories", slug: "stories", name: "Stories", description: "Story description", illustrationUrl: "/illustrations/stories.png", sortOrder: 10 },
    { id: "dialogues", slug: "dialogues", name: "Dialogues", description: "Dialogue description", illustrationUrl: "/illustrations/dialogues.png", sortOrder: 20 },
    { id: "virtual-teacher-guide", slug: "virtual-teacher-guide", name: "Virtual Teacher Guide", description: "Teacher guide description", illustrationUrl: "/illustrations/virtual-teacher-guide.png", sortOrder: 30 },
  ] as never);
});

test("gives Watch content-type cards the compact responsive media treatment", async () => {
  render(await WatchPage());

  for (const name of ["Stories", "Dialogues", "Virtual Teacher Guide"]) {
    expect(screen.getByRole("link", { name: new RegExp(name) })).toHaveClass("watch-natural-media", "watch-stack-on-tablet", "square-media-on-desktop");
  }

  expect(screen.getByRole("link", { name: /Virtual Teacher Guide/ })).toHaveClass("fill-media-on-desktop");
  expect(screen.getByRole("link", { name: /Stories/ })).not.toHaveClass("fill-media-on-desktop");
  expect(screen.getByRole("link", { name: /Dialogues/ })).not.toHaveClass("fill-media-on-desktop");
});
