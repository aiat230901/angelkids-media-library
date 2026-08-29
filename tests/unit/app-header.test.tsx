import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { AppHeader } from "@/components/layout/AppHeader";

test("opens an accessible learning navigation menu with every public route", async () => {
  const user = userEvent.setup();
  render(<AppHeader />);

  const opener = screen.getByRole("button", { name: "Mở menu điều hướng" });
  expect(opener).toHaveTextContent("Trang chủ");
  expect(opener.querySelectorAll("svg")).toHaveLength(1);
  await user.click(opener);

  const dialog = screen.getByRole("dialog", { name: "Menu điều hướng" });
  expect(dialog).toBeInTheDocument();
  expect(screen.getByRole("banner")).not.toContainElement(dialog);
  for (const [name, href] of [
    ["Trang chủ", "/learning"],
    ["Watch", "/learning/watch"],
    ["Read", "/learning/read"],
    ["Songs & Poems", "/learning/songs"],
    ["Digital Flashcards", "/learning/digital-flashcards"],
    ["Print and Plays", "/learning/print-and-plays"],
  ]) {
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
  }
});

test("closes the menu with Escape, its backdrop, or a selected destination", async () => {
  const user = userEvent.setup();
  render(<AppHeader />);
  const opener = screen.getByRole("button", { name: "Mở menu điều hướng" });

  await user.click(opener);
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog", { name: "Menu điều hướng" })).not.toBeInTheDocument();
  expect(opener).toHaveFocus();

  await user.click(opener);
  fireEvent.mouseDown(screen.getByRole("dialog", { name: "Menu điều hướng" }));
  expect(screen.queryByRole("dialog", { name: "Menu điều hướng" })).not.toBeInTheDocument();

  await user.click(opener);
  await user.click(screen.getByRole("link", { name: "Read" }));
  expect(screen.queryByRole("dialog", { name: "Menu điều hướng" })).not.toBeInTheDocument();
});
