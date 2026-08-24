import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { PrintAndPlayCard } from "@/components/learning/PrintAndPlayCard";
import type { PublicResource } from "@/domain/public-resource";

const resource: PublicResource = {
  slug: "print-and-play-september",
  assetName: "Print and Play",
  description: null,
  resourceFormat: "PRINT_AND_PLAY_COLLECTION",
  provider: "GOOGLE_DRIVE",
  externalUrl: "https://drive.google.com/drive/folders/1pJlinV0vYOMjNNYH5DUkkbR7AhdHLmRt?usp=drive_link",
  thumbnailUrl: "/print-and-plays/09.png",
  altText: "Minh họa Print and Play tháng 09",
  levels: [],
  curriculumUnit: { id: "u09", monthNumber: "09", displayLabel: "09 - Trường học | Chào năm học mới", sortOrder: 90 },
};

test("shows the collection title and curriculum unit, and opens Drive in a new tab", () => {
  render(<PrintAndPlayCard resource={resource} />);

  expect(screen.getByText("Print and Play")).toBeInTheDocument();
  expect(screen.getByText("09 - Trường học | Chào năm học mới")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /xem học liệu 09/i })).toHaveAttribute("target", "_blank");
});
