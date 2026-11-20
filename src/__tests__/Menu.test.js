import { render, screen, within } from "@testing-library/react";
import Menu from "../Menu";
import items from "../data";

describe("Menu", () => {
  test("each View Certificate link points to that certificate's PDF", () => {
    render(<Menu items={items} />);
    const cards = screen.getAllByRole("article");

    cards.forEach((card, i) => {
      const link = within(card).getByRole("link", { name: /view certificate/i });
      const href = link.getAttribute("href");
      expect(href).toMatch(/\.pdf$/);
      expect(href).toBe(`${process.env.PUBLIC_URL}/pdf/${items[i].certificate}`);
    });
  });

  test("View Certificate links open safely in a new tab", () => {
    render(<Menu items={items} />);
    screen
      .getAllByRole("link", { name: /view certificate/i })
      .forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
  });

  test("renders an image with alt text for each certificate", () => {
    render(<Menu items={items} />);
    items.forEach(({ title, img }) => {
      const image = screen.getByAltText(title);
      expect(image.getAttribute("src")).toContain(img);
    });
  });
});
