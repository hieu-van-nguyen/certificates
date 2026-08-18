# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Develop: `npm start`
- Build: `npm run build`
- Test: `npm test`
- Deploy: `npm run deploy`

## Architecture

The project is a React application built with Create React App that showcases professional certificates.

### Structure
- `src/App.js`: Root component that manages the state for filtered certificates and handles the overall layout.
- `src/Categories.js`: UI component that renders the category filter buttons.
- `src/Menu.js`: UI component that displays the list of certificates.
- `src/data.js`: Central data store containing the metadata for all certificates (title, category, image, description, and PDF filename).
- `src/pdf/`: Directory containing the actual PDF files for the certificates.
- `public/images/`: Directory containing preview images for the certificates.

### Key Workflows
- **Adding a Certificate**: 
  1. Add the PDF file to `src/pdf/`.
  2. Add a preview image to `public/images/`.
  3. Update `src/data.js` with a new entry including the category and file paths.
- **Filtering**: The app uses a simple filter mechanism in `App.js` that updates the list of displayed items based on the selected category from `Categories.js`.
