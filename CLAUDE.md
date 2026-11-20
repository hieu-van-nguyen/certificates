# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A small React 18 single-page app, built with **Vite 6** and tested with **Vitest 3**, that showcases professional certificates. It is deployed as a static site to GitHub Pages at `https://hieu-van-nguyen.github.io/certificates/`. There is no backend: all content comes from `src/data.js` plus static files in `public/`.

## Commands

| Task | Command | Notes |
|------|---------|-------|
| Dev server | `npm start` (or `npm run dev`) | http://localhost:3000/certificates/ |
| Tests (single run) | `npm run test:run` | **Plain `npm test` starts Vitest watch mode in a terminal. Use `test:run` from an agent.** |
| Tests + coverage | `npm run test:coverage` | Single run; HTML report goes to `coverage/index.html` (gitignored) |
| Single test file | `npx vitest run src/__tests__/Menu.test.jsx` | |
| Production build | `npm run build` | Output goes to `build/` (set in `vite.config.js`) |
| Preview the build | `npm run preview` | Serves `build/` at http://localhost:4173/certificates/ |
| Optimize images | `npm run images` | Converts every PNG/JPEG in `public/images/` to an 800 px-wide WebP and **deletes the original** |
| Deploy | *automatic* | `.github/workflows/deploy.yml` tests, builds and publishes to Pages on every push to `main`. PRs to `main` only run tests and the build. **Pushing to `main` publishes the live site.** |
| Manual deploy (fallback) | `npm run deploy` | Pushes `build/` to the `gh-pages` branch. Only takes effect if Pages is set to "Deploy from a branch". **Only run it when the user asks.** |

Requires Node `^18 || ^20 || >=22`. Don't upgrade to Vite 7 or Vitest 4 while the dev machine is on Node 20.17, because they need Node ≥ 20.19. For the same reason `@testing-library/jest-dom` is pinned below 6.10, which needs Node 22.

## Architecture

```
index.html        Vite entry HTML (project root, not public/). Loads /src/index.jsx.
vite.config.js    base path, dev port, build outDir, and the Vitest config (test: {...}).
src/
  index.jsx       Entry point. Imports Bootstrap CSS *before* index.css so custom styles win.
  App.jsx         Holds the filtered-items state; builds the category list from data.js.
  Categories.jsx  Filter buttons ("all" plus each unique category).
  Menu.jsx        Certificate cards: image, title, description, "View Certificate" link.
  assetUrl.js     assetUrl(path): turns a public/ path into a URL that includes the base path.
  data.js         The single source of truth for certificate metadata.
  index.css       All styling (CSS variables in :root). There are no other stylesheets.
  setupTests.js   Vitest setup (jest-dom matchers). Referenced by vite.config.js.
  __tests__/      All tests (App, Menu, data).
scripts/
  optimize-images.js  `npm run images`: PNG/JPEG → resized WebP (see Assets & paths).
public/           Copied as-is to build/ and served under the base path.
  images/         Card preview images, referenced from data.js `img`.
  pdf/            Certificate PDFs, referenced by filename from data.js `certificate`.
```

Data flow: `data.js` → `App` (filters by category) → `Menu` (renders cards). Categories are derived from the data automatically; nothing needs registering.

### Certificate entry shape (`src/data.js`)

```js
{
  id: 6,                                    // unique number; use the next integer
  title: "Certificate-Name",                // shown as the card heading (CSS capitalizes it)
  category: "AI",                           // becomes a filter button automatically
  img: "/images/item-6.webp",               // path under public/; must be .webp
  desc: "Short description",
  certificate: "Certificate-Name.pdf"       // filename inside public/pdf/
}
```

## Rules for future development

### Vite specifics
- Files that contain JSX must use the **`.jsx`** extension. Vite won't parse JSX in `.js` files.
- Use `import.meta.env.*`, not `process.env.*`. `process` doesn't exist in Vite's browser build. Custom env variables need a `VITE_` prefix.
- The package is `"type": "module"`, so config and scripts use ESM. In Node-side test code (e.g. `data.test.js`), use `import.meta.url` with `fileURLToPath` instead of `__dirname`.
- `index.html` lives at the project root and uses root-relative paths (`/favicon.ico`). Vite rewrites them with the base path at build time, so don't use `%PUBLIC_URL%`.

### Assets & paths
- **Static files go in `public/`, never `src/`.** PDFs go in `public/pdf/` and images in `public/images/`. Don't go back to importing PDFs into components.
- **Always build public URLs with `assetUrl()`** from `src/assetUrl.js`. The site is served from `/certificates/` (`base` in `vite.config.js`), so a bare `/pdf/x.pdf` link breaks on GitHub Pages. `assetUrl` also avoids a double slash, since `BASE_URL` ends in `/` and the `img` paths start with one.
- If the repo or Pages path ever changes, update **both** `base` in `vite.config.js` and `homepage` in `package.json`.
- Filenames are case-sensitive on GitHub Pages even though Windows ignores case. `data.test.js` checks exact case, so keep it passing.
- **Preview images must be WebP**, produced by `npm run images` (`scripts/optimize-images.js`, using `sharp`). They're 800 px wide, which is 2× the widest display size (the 400 px single-column card on phones), at quality 80, about 30 KB each. `data.test.js` fails if an `img` isn't `.webp`. If the card layout gets wider, raise `MAX_WIDTH` in the script.

### Adding or changing a certificate
1. Put the PDF in `public/pdf/` and the preview image (any size PNG/JPEG) in `public/images/`.
2. Run `npm run images` to turn it into `<name>.webp`.
3. Add one entry to `src/data.js` with `img: "/images/<name>.webp"`. No component changes are needed.
4. Run `npm run test:run`. `data.test.js` fails if an id is duplicated, a field is missing, or a referenced image or PDF doesn't exist with exactly that filename.

### Components & accessibility
- **"View Certificate" is a plain `<a className="btn btn-success" target="_blank" rel="noopener noreferrer">`.** Don't use a component that adds `role="button"` to it (e.g. `react-bootstrap`'s `Button`). That hides the link role from screen readers and breaks `getByRole("link")` in the tests.
- Bootstrap is used **only** for its CSS (`btn` classes and the reboot styles). Prefer the existing CSS variables in `index.css` over adding a component library.
- Interactive elements must be real `<button>` or `<a href>` elements. Don't use click handlers on non-focusable elements.
- Every `<img>` needs meaningful `alt` text (currently the certificate title).
- List keys must be stable values (`id`, category name), not array indexes.
- The category name `"all"` is reserved for the show-everything filter. Don't use it as a real category.

### Testing
- Tests live in `src/__tests__/` and must match `*.test.{js,jsx}`. That's the `include` pattern in `vite.config.js`, so tests elsewhere won't run.
- Vitest runs with `globals: true`, so `describe`/`test`/`expect`/`vi` are available without imports. For mocks, use `vi.fn()` / `vi.spyOn()`, not `jest.*`.
- Simulate events with `fireEvent` from `@testing-library/react`. `@testing-library/user-event` isn't installed; if you add it, use v14+ (`await user.click(...)`).
- Query by role and accessible name (`getByRole("link", { name: /view certificate/i })`) rather than by class or test id.
- In tests, `import.meta.env.BASE_URL` is `/certificates/`, same as in production.
- Coverage uses `all: false`, which works around a Windows drive-letter casing bug that otherwise lists every file twice. So only files imported by tests are reported. Every source file is at 100%. Keep it there: new behaviour needs a test in the same change.

### CI / deployment
- The workflow runs `npm ci`, so **`package-lock.json` must stay in sync with `package.json`**. Always change dependencies with `npm install`/`npm uninstall`, never by hand-editing `package.json`, and commit both files.
- CI runs on Ubuntu with Node 20. Keep the lockfile's Linux optional binaries (`@esbuild/linux-x64`, `@rollup/rollup-linux-x64-gnu`, `@img/sharp-linux-x64`). If they go missing, `npm ci` fails in CI even though it works on Windows.
- If you change the Node version, update `node-version` in the workflow and `engines` in `package.json` together.
- On Windows, `npm ci` fails with `EPERM` while a Vite dev or preview server is running, because it locks `esbuild.exe`. It also deletes most of `node_modules` before failing. Stop the servers first, or use `npm install` locally.

### Housekeeping
- Keep `README.md` and this file in sync when the workflow, structure or scripts change.
- `IMPROVEMENTS.md` is the prioritized backlog (P1/P2/P3). Check it before starting enhancement work, and update an item's status when you complete it.
