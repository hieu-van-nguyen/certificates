# My Certificates Portfolio

A clean, lightweight React app that showcases my professional certifications. You can filter them by category and open each original certificate PDF.

**Live site:** https://hieu-van-nguyen.github.io/certificates/

## 🚀 Features

- **Category filters.** Browse by skill area (FrontEnd, BackEnd, AI, …). The filter buttons are generated automatically from the data.
- **One-click PDFs.** Each card links straight to the original certificate, which opens in a new tab.
- **Responsive layout.** One column on mobile and two columns on wide screens.
- **Data-driven.** Adding a certificate means adding two files and one data entry. No component code changes.
- **Tested.** Component tests, plus data checks that catch a missing image or PDF before deploy.

## 🧰 Tech Stack

- [React 18](https://react.dev/) built with [Vite 6](https://vite.dev/)
- [Bootstrap 5](https://getbootstrap.com/) CSS for button styling, plus custom CSS in `src/index.css`
- [Vitest 3](https://vitest.dev/) and React Testing Library for tests
- GitHub Actions for automatic testing and deployment to GitHub Pages

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18, 20, or 22+ (developed on Node 20) and npm

### Installation

```bash
git clone https://github.com/hieu-van-nguyen/certificates.git
cd certificates
npm install
```

### Running locally

```bash
npm start
```

Then open http://localhost:3000/certificates/ (it opens automatically). The app is served under `/certificates` to match GitHub Pages.

## 📜 Available Scripts

| Command | What it does |
|---------|--------------|
| `npm start` / `npm run dev` | Starts the Vite dev server with hot reload |
| `npm test` | Runs tests in watch mode |
| `npm run test:run` | Runs all tests once |
| `npm run test:coverage` | Runs all tests once and prints a coverage report (HTML in `coverage/index.html`) |
| `npm run build` | Creates an optimized production build in `build/` |
| `npm run preview` | Serves the production build locally at http://localhost:4173/certificates/ |
| `npm run images` | Converts PNG/JPEG previews in `public/images/` to optimized 800 px WebP (replaces the originals) |
| `npm run deploy` | Manual fallback: builds and pushes `build/` to the `gh-pages` branch (see Deployment) |

## 📁 Project Structure

```
index.html           Page template (title, meta tags) and Vite entry point
vite.config.js       Base path, dev server, build and test settings
scripts/
  optimize-images.js Image optimizer behind `npm run images`
public/
  images/            Card preview images
  pdf/               Certificate PDFs
src/
  data.js            Certificate metadata (the only file to edit when adding a certificate)
  App.jsx            Category filter state and page layout
  Categories.jsx     Category filter buttons
  Menu.jsx           Certificate cards and "View Certificate" links
  assetUrl.js        Builds URLs for files in public/ under the deploy base path
  index.css          All styles (theme colours are CSS variables in :root)
  __tests__/         Component and data tests
```

## 📝 Adding a New Certificate

1. Copy the certificate PDF into `public/pdf/`.
2. Copy a preview image (PNG or JPEG, any size) into `public/images/`, then run:
   ```bash
   npm run images
   ```
   This replaces it with a resized WebP of about 30 KB.
3. Add an entry to the array in `src/data.js`:
   ```javascript
   {
     id: 6,                                 // next unused number
     title: "Certificate-Name",
     category: "CategoryName",              // a new category gets its own filter button
     img: "/images/item-6.webp",            // the WebP from step 2
     desc: "Short description of the certification",
     certificate: "Certificate-Name.pdf"    // filename in public/pdf/
   }
   ```
4. Check that everything is wired up:
   ```bash
   npm run test:run
   ```
   The data tests fail if an id is duplicated, a field is missing, an image isn't WebP, or the image or PDF can't be found with that exact filename.

> Filenames are case-sensitive on GitHub Pages. Make sure `img` and `certificate` match the files exactly.

## 🧪 Testing

Tests are in `src/__tests__/`:

- **`App.test.jsx`**: the page renders one card per certificate, and the category filters work.
- **`Menu.test.jsx`**: each card links to the right PDF, opens it safely in a new tab, and has alt text on its image.
- **`data.test.js`**: certificate data is valid and every referenced image and PDF exists.

## 📦 Deployment

Deployment is automatic. The [Test & Deploy workflow](.github/workflows/deploy.yml) runs on GitHub Actions:

| Event | What happens |
|-------|--------------|
| Pull request to `main` | `npm ci` → tests with coverage → build. Nothing is published. |
| Push to `main` | The same checks, then the build is published to GitHub Pages. |
| Manual run (Actions tab → *Run workflow*) | The same as a push to `main`. |

If a test or the build fails, nothing is deployed and the live site stays as it was.

**One-time setup:** in the repository's **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.

`npm run deploy` (which pushes `build/` to the `gh-pages` branch) is kept as a manual fallback. It only affects the live site while Pages is set to *Deploy from a branch*.

The `/certificates/` base path is set by `base` in `vite.config.js`. If the repository is renamed, update it there and in `homepage` in `package.json`.

## 🗺️ Roadmap

Planned improvements, including richer certificate details (issuer, date, verification link), and CI/CD, are listed in [IMPROVEMENTS.md](IMPROVEMENTS.md).
