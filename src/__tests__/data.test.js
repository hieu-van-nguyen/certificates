import fs from "fs";
import path from "path";
import items from "../data";

const root = path.resolve(__dirname, "..", "..");
const publicDir = path.join(root, "public");
const pdfDir = path.join(publicDir, "pdf");

describe("certificate data", () => {
  test("has at least one certificate", () => {
    expect(items.length).toBeGreaterThan(0);
  });

  test("ids are unique", () => {
    const ids = items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every entry has all required fields", () => {
    const required = ["id", "title", "category", "img", "desc", "certificate"];
    items.forEach((item) => {
      required.forEach((field) => {
        expect(item[field]).toBeTruthy();
      });
    });
  });

  test.each(items.map((item) => [item.title, item.img]))(
    "%s: preview image exists in public/ (%s)",
    (_title, img) => {
      expect(fs.existsSync(path.join(publicDir, img))).toBe(true);
    }
  );

  test.each(items.map((item) => [item.title, item.certificate]))(
    "%s: PDF exists in public/pdf/ (%s)",
    (_title, certificate) => {
      expect(certificate).toMatch(/\.pdf$/);
      expect(fs.existsSync(path.join(pdfDir, certificate))).toBe(true);
    }
  );
});
