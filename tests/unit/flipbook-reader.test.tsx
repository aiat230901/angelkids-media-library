import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { FlipbookReader } from "@/components/learning/FlipbookReader.client";

describe("FlipbookReader", () => {
  test("provides close, fullscreen and permanent external fallback controls", async () => {
    const user = userEvent.setup();
    render(<FlipbookReader title="Mia Storybook" url="https://heyzine.com/flip-book/abc" open onClose={() => undefined} />);
    expect(screen.getByRole("dialog")).toHaveAttribute("open");
    expect(screen.getByRole("link", { name: "Mở trong tab mới" })).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("button", { name: "Toàn màn hình" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Đóng trình đọc" }));
    expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute("open");
  });
});
