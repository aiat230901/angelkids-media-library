import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

test("marks the current breadcrumb for the shared vertical alignment treatment", () => {
  render(<Breadcrumb items={[{ label: "Home", href: "/learning" }, { label: "Watch", href: "/learning/watch" }, { label: "Animated Stories" }]} />);

  expect(screen.getByText("Animated Stories")).toHaveClass("breadcrumb-current");
  expect(screen.getByText("Animated Stories").parentElement).toHaveClass("breadcrumb-item");
});
