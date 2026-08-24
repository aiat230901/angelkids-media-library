import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { FlipbookReader } from "@/components/learning/FlipbookReader.client";

describe("FlipbookReader", () => {
  test("closes from its backdrop without an external navigation fallback", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<FlipbookReader title="Mia Storybook" url="https://heyzine.com/flip-book/abc" open onClose={onClose} />);
    const dialog = screen.getByRole("dialog");

    expect(dialog).toHaveAttribute("open");
    expect(screen.queryByRole("link", { name: "Mở trong tab mới" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Toàn màn hình" })).toBeInTheDocument();
    await user.click(dialog);
    expect(onClose).toHaveBeenCalledOnce();
  });

  test("closes when Escape cancels the dialog", () => {
    const onClose = vi.fn();
    render(<FlipbookReader title="Mia Storybook" url="https://heyzine.com/flip-book/abc" open onClose={onClose} />);

    fireEvent(screen.getByRole("dialog"), new Event("cancel", { bubbles: true, cancelable: true }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  test("requests fullscreen on the reader shell instead of the dialog", async () => {
    const user = userEvent.setup();
    const dialogRequestFullscreen = vi.fn();
    const shellRequestFullscreen = vi.fn();
    const originalDialogRequestFullscreen = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "requestFullscreen");
    const originalShellRequestFullscreen = Object.getOwnPropertyDescriptor(HTMLDivElement.prototype, "requestFullscreen");
    Object.defineProperty(HTMLDialogElement.prototype, "requestFullscreen", { configurable: true, value: dialogRequestFullscreen });
    Object.defineProperty(HTMLDivElement.prototype, "requestFullscreen", { configurable: true, value: shellRequestFullscreen });

    try {
      render(<FlipbookReader title="Mia Storybook" url="https://heyzine.com/flip-book/abc" open onClose={() => undefined} />);
      await user.click(screen.getByRole("button", { name: "Toàn màn hình" }));

      expect(shellRequestFullscreen).toHaveBeenCalledOnce();
      expect(dialogRequestFullscreen).not.toHaveBeenCalled();
    } finally {
      if (originalDialogRequestFullscreen) Object.defineProperty(HTMLDialogElement.prototype, "requestFullscreen", originalDialogRequestFullscreen);
      else delete (HTMLDialogElement.prototype as { requestFullscreen?: unknown }).requestFullscreen;
      if (originalShellRequestFullscreen) Object.defineProperty(HTMLDivElement.prototype, "requestFullscreen", originalShellRequestFullscreen);
      else delete (HTMLDivElement.prototype as { requestFullscreen?: unknown }).requestFullscreen;
    }
  });
});
