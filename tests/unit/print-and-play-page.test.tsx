import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import PrintAndPlaysPage from "@/app/learning/print-and-plays/page";

vi.mock("@/server/repositories/learning", () => ({ listResources: async () => [] }));

test("October links to Drive even without a learning resource record", async () => {
  render(await PrintAndPlaysPage());

  const card = screen.getByRole("link", { name: "Xem học liệu 10 - Bản thân | Tôi khác biệt" });
  expect(card).toHaveAttribute("href", "https://drive.google.com/drive/folders/1pJlinV0vYOMjNNYH5DUkkbR7AhdHLmRt?usp=sharing");
  expect(card).toHaveAttribute("target", "_blank");
  expect(card).toHaveAttribute("rel", "noopener noreferrer");
  expect(card).toHaveTextContent("Print and Play");
  expect(card).toHaveTextContent("10 - Bản thân | Tôi khác biệt");
  expect(card).toHaveTextContent("Play →");
  expect(screen.getByRole("img", { name: "Minh họa Print and Play tháng 10: Bản thân | Tôi khác biệt" })).toHaveAttribute("src", "/print-and-plays/10.png");
});
