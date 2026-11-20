# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A small React single-page app (Create React App) that showcases professional certificates. It is deployed as a static site to GitHub Pages at `https://hieu-van-nguyen.github.io/certificates/`. There is no backend: all content comes from `src/data.js` plus static files in `public/`.

## Commands

| Task | Command | Notes |
|------|---------|-------|
| Dev server | `npm start` | http://localhost:3000/certificates |
| Tests (single run) | `CI=true npm test` or `npm test -- --watchAll=false` | **Plain `npm test` starts watch mode and never exits. Don't use it from an agent.** |
| Tests + coverage | `npm run test:coverage` | Single run; HTML report goes to `coverage/lcov-report/` (gitignored) |
| Single test file | `npm test -- --watchAll=false src/__tests__/Menu.test.js` | |
| Production build | `npm run build` | Output goes to `build/` |
| Deploy | `npm run deploy` | Builds, then pushes `build/` to the `gh-pages` branch. **This publishes the live site. Only run it when the user asks.** |

Never run `npm run eject`.

## Architecture

```
src/
  index.js        Entry point. Imports Bootstrap CSS *before* index.css so custom styles win.
  App.js          Holds the filtered-items state; builds the category list from data.js.
  Categories.js   Filter buttons ("all" plus each unique category).
  Menu.js         Certificate cards: image, title, description, "View Certificate" link.
  data.js         The single source of truth for certificate metadata.
  index.css       All styling (CSS variables in :root). There are no other stylesheets.
  setupTests.js   jest-dom setup. CRA requires this exact path, so don't move it.
  __tests__/      All tests (App, Menu, data).
public/
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
  img: "/images/item-6.png",                // path under public/, leading slash
  desc: "Short description",
  certificate: "Certificate-Name.pdf"       // filename inside public/pdf/
}
```

## Rules for future development

### Assets & paths
- **Static files go in `public/`, never `src/`.** PDFs go in `public/pdf/` and images in `public/images/`. Don't go back to importing PDFs into components.
- **Always prefix public paths with `process.env.PUBLIC_URL`.** The site is served from the `/certificates/` subpath (`homepage` in `package.json`), so a bare `/pdf/x.pdf` link works on localhost but breaks on GitHub Pages.
- Filenames are case-sensitive on GitHub Pages even though Windows ignores case. `certificate` and `img` in `data.js` must match the file exactly.
- Keep preview images small: about 450 px wide, WebP preferred. The current PNGs are about 500 KB each, which is too large (see IMPROVEMENTS.md 3.1).

### Adding or changing a certificate
1. Put the PDF in `public/pdf/` and the preview image in `public/images/`.
2. Add one entry to `src/data.js`. No component changes are needed.
3. Run `CI=true npm test`. `data.test.js` fails if an id is duplicated, a field is missing, or a referenced image or PDF doesn't exist.

### Components & accessibility
- **"View Certificate" is a plain `<a className="btn btn-success" target="_blank" rel="noopener noreferrer">`.** Don't swap it for `react-bootstrap`'s `Button`: with an `href` it adds `role="button"`, which hides the link role from screen readers and breaks `getByRole("link")` in the tests.
- `react-bootstrap` is no longer used in `src/`. Bootstrap is used **only** for its CSS (`btn` classes and the reboot styles). Prefer the existing CSS variables in `index.css` over adding new Bootstrap components.
- Interactive elements must be real `<button>` or `<a href>` elements. Don't use click handlers on non-focusable elements.
- Every `<img>` needs meaningful `alt` text (currently the certificate title).
- List keys must be stable values (`id`, category name), not array indexes.
- The category name `"all"` is reserved for the show-everything filter. Don't use it as a real category.

### Testing
- Tests live in `src/__tests__/`. CRA's Jest only discovers tests under `src/`, so a top-level `test/` folder would be silently ignored.
- Use `fireEvent` from `@testing-library/react`. **Don't use `userEvent` (v13) for clicks:** with React 18 its events aren't wrapped in `act()` and state updates don't apply, so tests fail without an obvious reason.
- Query by role and accessible name (`getByRole("link", { name: /view certificate/i })`) rather than by class or test id.
- In Jest, `process.env.PUBLIC_URL` is `""`. Build expected URLs with it instead of hard-coding `/certificates/`.
- Component files are at 100% coverage. Keep them there: new behaviour needs a test in the same change.

### Housekeeping
- Keep `README.md` and this file in sync when the workflow, structure or scripts change.
- `IMPROVEMENTS.md` is the prioritized backlog (P1/P2/P3). Check it before starting enhancement work, and update an item's status when you complete it.
- CRA is deprecated. A move to Vite is planned (IMPROVEMENTS.md 2.4). Don't add CRA-specific tooling that would make that move harder.
