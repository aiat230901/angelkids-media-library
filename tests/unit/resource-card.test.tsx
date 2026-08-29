import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { ResourceCard } from "@/components/learning/ResourceCard";
import type { PublicResource } from "@/domain/public-resource";

const resource: PublicResource = {
  slug: "mia",
  assetName: "Mia's Happy Classroom",
  description: null,
  resourceFormat: "ANIMATED_STORY_VIDEO",
  provider: "YOUTUBE",
  externalUrl: "https://youtu.be/dQw4w9WgXcQ",
  thumbnailUrl: "/illustrations/mia.svg",
  altText: "Mia trong lớp",
  levels: [{ code: "L3", name: "Level 3", sortOrder: 10 }],
  curriculumUnit: { id: "u09", monthNumber: "09", displayLabel: "09 - Trường học", sortOrder: 10 },
};

describe("ResourceCard", () => {
  test("renders a video as a detail link with a play label", () => {
    render(<ResourceCard resource={resource} href="/learning/watch/stories/mia" />);
    expect(screen.getByRole("link", { name: /Mia's Happy Classroom/i })).toHaveAttribute("href", "/learning/watch/stories/mia");
    expect(screen.getByLabelText("Phát video")).toBeInTheDocument();
    expect(screen.getByText("3–4 tuổi")).toBeInTheDocument();
  });

  test("renders a flipbook as a button without a play indicator", async () => {
    const onOpen = vi.fn();
    render(<ResourceCard resource={{ ...resource, provider: "HEYZINE", resourceFormat: "DIGITAL_STORYBOOK" }} onOpen={onOpen} />);
    await userEvent.click(screen.getByRole("button", { name: /Mia's Happy Classroom/i }));
    expect(onOpen).toHaveBeenCalledOnce();
    expect(screen.queryByLabelText("Phát video")).not.toBeInTheDocument();
  });

  test("gives a digital flashcard a clear open CTA", () => {
    render(<ResourceCard resource={{ ...resource, provider: "HEYZINE", resourceFormat: "DIGITAL_FLASHCARD_SET" }} onOpen={() => undefined} />);

    expect(screen.getByRole("button", { name: /Mia's Happy Classroom/i })).toHaveTextContent("Mở flashcards");
  });
});
