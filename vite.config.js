import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // The site is served from https://hieu-van-nguyen.github.io/certificates/
  base: "/certificates/",
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    // Keep CRA's output folder so `gh-pages -d build` and .gitignore still work.
    outDir: "build",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    include: ["src/__tests__/**/*.test.{js,jsx}"],
    coverage: {
      provider: "v8",
      // Report only files loaded by tests. With `all: true`, Windows drive-letter
      // casing (c: vs C:) makes every file appear twice, once at 0%.
      all: false,
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/__tests__/**", "src/setupTests.js", "src/index.jsx"],
    },
  },
});
