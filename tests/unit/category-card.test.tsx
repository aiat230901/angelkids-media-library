import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { CategoryCard } from "@/components/learning/CategoryCard";

test("marks only an opted-in category for natural media framing", () => {
  render(<CategoryCard href="/learning/watch" name="Watch" description="Xem và khám phá" illustrationUrl="/illustrations/watch.png" hideDescriptionOnMobile />);

  expect(screen.getByText("Xem và khám phá")).toHaveClass("category-description");
  expect(screen.getByRole("link")).toHaveClass("watch-natural-media");
  expect(screen.getByRole("link")).toHaveClass("watch-stack-on-tablet");
  expect(screen.getByText("– Luyện xem")).toHaveClass("learning-label-translation");
  expect(screen.getByText("– Luyện xem").parentElement).toHaveClass("learning-label-stacked");
});

test("marks an opted-in featured card to fill media on desktop", () => {
  render(<CategoryCard href="/learning/print-and-plays" name="Print and Plays" description="Print description" illustrationUrl="/illustrations/print-and-plays.png" featured fillMediaOnDesktop />);

  expect(screen.getByRole("link")).toHaveClass("fill-media-on-desktop");
});
