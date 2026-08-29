import { render, screen, waitFor } from "@testing-library/react";
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
    expect(screen.getByLabelText("Độ tuổi")).toHaveDisplayValue("Tất cả độ tuổi");
    expect(screen.getByRole("option", { name: "3–4 tuổi" })).toHaveValue("L3");
    await userEvent.selectOptions(screen.getByLabelText("Độ tuổi"), "L3");
    await userEvent.type(screen.getByLabelText("Tên học liệu"), "family");
    expect(screen.getByText("Không tìm thấy học liệu phù hợp")).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole("button", { name: "Đặt lại bộ lọc" })[0]);
    expect(screen.getByText("2 học liệu")).toBeInTheDocument();
  });

  test("always shows name search and hides a month-and-topic select with no options", () => {
    render(<ResourceListing resources={[resources[1]]} detailBasePath="/learning/songs" />);
    expect(screen.getByLabelText("Tên học liệu")).toBeInTheDocument();
    expect(screen.queryByLabelText("Tháng & Chủ đề học")).not.toBeInTheDocument();
  });

  test("hides resource-name search but retains age and month-topic filtering for flashcards", async () => {
    const user = userEvent.setup();
    const flashcards: PublicResource[] = [
      {
        ...resources[0],
        slug: "flashcards-level-3",
        assetName: "Digital Flashcards - Level 3",
        resourceFormat: "DIGITAL_FLASHCARD_SET",
        provider: "HEYZINE",
        externalUrl: "https://mamnonangelkids.aflip.in/419742bc48.html",
      },
      {
        ...resources[0],
        slug: "flashcards-level-4",
        assetName: "Digital Flashcards - Level 4",
        resourceFormat: "DIGITAL_FLASHCARD_SET",
        provider: "HEYZINE",
        externalUrl: "https://mamnonangelkids.aflip.in/2fc93ec7e4.html",
        levels: [{ code: "L4", name: "Level 4", sortOrder: 20 }],
      },
    ];

    render(<ResourceListing resources={flashcards} showNameFilter={false} />);

    expect(screen.queryByLabelText("Tên học liệu")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Độ tuổi")).toBeInTheDocument();
    expect(screen.getByLabelText("Tháng & Chủ đề học")).toHaveDisplayValue("Tất cả tháng & chủ đề");

    await user.selectOptions(screen.getByLabelText("Độ tuổi"), "L3");
    expect(screen.getByText("Digital Flashcards - Level 3")).toBeInTheDocument();
    expect(screen.queryByText("Digital Flashcards - Level 4")).not.toBeInTheDocument();
  });

  test("returns focus to the flashcard that opened the reader", async () => {
    const user = userEvent.setup();
    const flashcard: PublicResource = {
      ...resources[0],
      slug: "flashcards-level-3",
      assetName: "Digital Flashcards - Level 3",
      resourceFormat: "DIGITAL_FLASHCARD_SET",
      provider: "HEYZINE",
      externalUrl: "https://mamnonangelkids.aflip.in/419742bc48.html",
    };
    render(<ResourceListing resources={[flashcard]} showNameFilter={false} />);

    const card = screen.getByRole("button", { name: /Digital Flashcards - Level 3/i });
    await user.click(card);
    await user.click(screen.getByRole("button", { name: "Đóng trình đọc" }));

    await waitFor(() => expect(card).toHaveFocus());
  });
});
