import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import PrintAndPlaysPage from "@/app/learning/print-and-plays/page";
import { listResources } from "@/server/repositories/learning";
import type { PublicResource } from "@/domain/public-resource";

vi.mock("@/server/repositories/learning", () => ({ listResources: vi.fn(async (): Promise<PublicResource[]> => []) }));

test("October and November link to Drive without learning resource records", async () => {
  render(await PrintAndPlaysPage());

  const card = screen.getByRole("link", { name: "Xem học liệu 10 - Bản thân | Tôi khác biệt" });
  expect(card).toHaveAttribute("href", "https://drive.google.com/drive/folders/1Ukt9DHvoBpZfP9tT59mhlYN4zGUyIayJ?usp=drive_link");
  expect(card).toHaveAttribute("target", "_blank");
  expect(card).toHaveAttribute("rel", "noopener noreferrer");
  expect(card).toHaveTextContent("Print and Play");
  expect(card).toHaveTextContent("10 - Bản thân | Tôi khác biệt");
  expect(card).toHaveTextContent("Play →");
  expect(screen.getByRole("img", { name: "Minh họa Print and Play tháng 10: Bản thân | Tôi khác biệt" })).toHaveAttribute("src", "/print-and-plays/10.png");

  const novemberCard = screen.getByRole("link", { name: "Xem học liệu 11 - Nghề nghiệp | Bé tài năng" });
  expect(novemberCard).toHaveAttribute("href", "https://drive.google.com/drive/u/2/folders/1Ukt9DHvoBpZfP9tT59mhlYN4zGUyIayJ");
  expect(novemberCard).toHaveAttribute("target", "_blank");
  expect(novemberCard).toHaveAttribute("rel", "noopener noreferrer");
  expect(novemberCard).toHaveTextContent("Print and Play");
  expect(novemberCard).toHaveTextContent("11 - Nghề nghiệp | Bé tài năng");
  expect(screen.getByRole("img", { name: "Minh họa Print and Play tháng 11: Nghề nghiệp | Bé tài năng" })).toHaveAttribute("src", "/print-and-plays/11.png");
});


test("September and October cards open the shared Drive folder", async () => {
  vi.mocked(listResources).mockResolvedValueOnce([{
    slug: "print-and-play-september",
    assetName: "Print and Play",
    description: "09 - Trường học | Chào năm học mới",
    resourceFormat: "PRINT_AND_PLAY_COLLECTION",
    provider: "GOOGLE_DRIVE",
    externalUrl: "https://drive.google.com/drive/folders/1Ukt9DHvoBpZfP9tT59mhlYN4zGUyIayJ?usp=drive_link",
    thumbnailUrl: "/print-and-plays/09.png",
    altText: "Minh họa Print and Play tháng 09",
    levels: [],
    curriculumUnit: { id: "09-truong-hoc", monthNumber: "09", displayLabel: "09 - Trường học | Chào năm học mới", sortOrder: 10 },
  }]);
  render(await PrintAndPlaysPage());
  const cards = screen.getAllByRole("link", { name: /Xem học liệu (09|10) -/ });
  expect(cards).toHaveLength(2);
  for (const card of cards) {
    expect(card).toHaveAttribute("href", "https://drive.google.com/drive/folders/1Ukt9DHvoBpZfP9tT59mhlYN4zGUyIayJ?usp=drive_link");
    expect(card).toHaveAttribute("target", "_blank");
    expect(card).toHaveAttribute("rel", "noopener noreferrer");
  }
});
