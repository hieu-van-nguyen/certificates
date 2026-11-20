import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import items from "./data";

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

test("every certificate has an enabled View Certificate button", () => {
  render(<App />);
  screen.getAllByRole("article").forEach((card) => {
    const button = within(card).getByText(/view certificate/i);
    expect(button).not.toHaveClass("disabled");
  });
});
