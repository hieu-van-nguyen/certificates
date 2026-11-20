import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "../App";
import items from "../data";

const cardCount = () => screen.getAllByRole("article").length;

test("renders the heading and one card per certificate", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /my certificates/i })
  ).toBeInTheDocument();
  expect(cardCount()).toBe(items.length);
});

test("filters certificates by category and resets with 'all'", () => {
  render(<App />);
  const category = items[0].category;
  const expected = items.filter((item) => item.category === category).length;

  fireEvent.click(screen.getByRole("button", { name: category }));
  expect(cardCount()).toBe(expected);

  fireEvent.click(screen.getByRole("button", { name: "all" }));
  expect(cardCount()).toBe(items.length);
});

test("marks only the selected category button as active", () => {
  render(<App />);
  const buttons = () => screen.getAllByRole("button");
  const pressed = () =>
    buttons().filter((b) => b.getAttribute("aria-pressed") === "true");

  // "all" is selected on first load.
  expect(pressed()).toHaveLength(1);
  expect(screen.getByRole("button", { name: "all", pressed: true })).toHaveClass(
    "active"
  );

  const category = items[0].category;
  fireEvent.click(screen.getByRole("button", { name: category }));

  expect(pressed()).toHaveLength(1);
  const selected = screen.getByRole("button", { name: category, pressed: true });
  expect(selected).toHaveClass("filter-btn", "active");
  expect(screen.getByRole("button", { name: "all" })).toHaveAttribute(
    "aria-pressed",
    "false"
  );
  expect(screen.getByRole("button", { name: "all" })).not.toHaveClass("active");
});

test("groups the filter buttons with an accessible label", () => {
  render(<App />);
  const group = screen.getByRole("group", {
    name: /filter certificates by category/i,
  });
  expect(within(group).getAllByRole("button")).toHaveLength(
    new Set(items.map((item) => item.category)).size + 1
  );
});

test("every certificate card has a View Certificate link", () => {
  render(<App />);
  screen.getAllByRole("article").forEach((card) => {
    const link = within(card).getByRole("link", { name: /view certificate/i });
    expect(link).toHaveAttribute("href");
  });
});
