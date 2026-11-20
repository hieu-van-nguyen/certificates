// Converts certificate preview images in public/images/ to resized WebP.
//
//   npm run images
//
// Every .png/.jpg/.jpeg in public/images/ is resized to at most MAX_WIDTH px
// wide (never upscaled), saved as <name>.webp next to it, and the original is
// deleted so it doesn't ship with the site. (Originals stay in git history.)
// Remember to point `img` in src/data.js at the new .webp file.
//
// MAX_WIDTH = 2x the widest the image is ever displayed: on phones the card is
// one column, up to 25rem (400px) wide (see .menu-item / .photo in index.css).
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const MAX_WIDTH = 800;
const QUALITY = 80;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = path.join(root, "public", "images");
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

const files = (await fs.readdir(imagesDir)).filter((f) =>
  /\.(png|jpe?g)$/i.test(f)
);

if (files.length === 0) {
  console.log("No PNG/JPEG images to convert in public/images/.");
  process.exit(0);
}

let before = 0;
let after = 0;

for (const file of files) {
  const src = path.join(imagesDir, file);
  const dest = path.join(imagesDir, file.replace(/\.(png|jpe?g)$/i, ".webp"));

  const { size: srcSize } = await fs.stat(src);
  const info = await sharp(src)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(dest);
  await fs.unlink(src);

  before += srcSize;
  after += info.size;
  console.log(
    `${file} -> ${path.basename(dest)}  ${info.width}x${info.height}  ` +
      `${kb(srcSize)} -> ${kb(info.size)}`
  );
}

console.log(
  `\nTotal: ${kb(before)} -> ${kb(after)} ` +
    `(${(100 - (after / before) * 100).toFixed(0)}% smaller)`
);
