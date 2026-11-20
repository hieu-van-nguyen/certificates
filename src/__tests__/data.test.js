import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import items from "../data";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const publicDir = path.join(root, "public");
const pdfDir = path.join(publicDir, "pdf");

// Case-sensitive existence check. fs.existsSync ignores case on Windows/macOS,
// but GitHub Pages is case-sensitive, so compare against the real directory listing.
const fileExistsExactly = (filePath) => {
  const dir = path.dirname(filePath);
  return fs.existsSync(dir) && fs.readdirSync(dir).includes(path.basename(filePath));
};

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
      expect(img.startsWith("/")).toBe(true);
      // Run `npm run images` to convert new PNG/JPEG previews to optimized WebP.
      expect(img).toMatch(/\.webp$/);
      expect(fileExistsExactly(path.join(publicDir, img))).toBe(true);
    }
  );

  test.each(items.map((item) => [item.title, item.certificate]))(
    "%s: PDF exists in public/pdf/ (%s)",
    (_title, certificate) => {
      expect(certificate).toMatch(/\.pdf$/);
      expect(fileExistsExactly(path.join(pdfDir, certificate))).toBe(true);
    }
  );
});
