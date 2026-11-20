// Builds a URL for a file in public/ that works under the deploy base path.
// BASE_URL is "/certificates/" (see vite.config.js) and always ends with "/",
// so strip any leading slash from the path to avoid "//".
export const assetUrl = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
