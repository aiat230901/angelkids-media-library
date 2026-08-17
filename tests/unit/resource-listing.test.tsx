import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { ResourceListing } from "@/components/learning/ResourceListing.client";
import type { PublicResource } from "@/domain/public-resource";

const resources: PublicResource[] = [
  {
    slug: "mia",
    assetName: "Mia's Happy Classroom",
    description: null,
    resourceFormat: "ANIMATED_STORY_VIDEO",
    provider: "YOUTUBE",
    externalUrl: "https://youtu.be/dQw4w9WgXcQ",
    thumbnailUrl: "/illustrations/mia.svg",
    altText: "Mia",
    levels: [{ code: "L3", name: "Level 3", sortOrder: 10 }],
    curriculumUnit: { id: "u09", monthNumber: "09", displayLabel: "09 - Trường học", sortOrder: 10 },
  },
  {
    slug: "family",
    assetName: "My Loving Family",
    description: null,
    resourceFormat: "SCHOOL_SONG_VIDEO",
    provider: "YOUTUBE",
    externalUrl: "https://youtu.be/aaaaaaaaaaa",
    thumbnailUrl: "/illustrations/family.svg",
    altText: "Family",
    levels: [{ code: "L4", name: "Level 4", sortOrder: 20 }],
    curriculumUnit: null,
  },
];

describe("ResourceListing", () => {
  test("filters by visible labels and reset restores all resources", async () => {
    render(<ResourceListing resources={resources} detailBasePath="/learning/songs" />);
    expect(screen.getByText("2 học liệu")).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText("Level"), "L3");
    await userEvent.type(screen.getByLabelText("Tên học liệu"), "family");
    expect(screen.getByText("Không tìm thấy học liệu phù hợp")).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole("button", { name: "Đặt lại bộ lọc" })[0]);
    expect(screen.getByText("2 học liệu")).toBeInTheDocument();
  });

  test("always shows name search and hides a Curriculum Unit select with no options", () => {
    render(<ResourceListing resources={[resources[1]]} detailBasePath="/learning/songs" />);
    expect(screen.getByLabelText("Tên học liệu")).toBeInTheDocument();
    expect(screen.queryByLabelText("Curriculum Unit")).not.toBeInTheDocument();
  });
});
