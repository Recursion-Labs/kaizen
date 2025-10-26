import { resolve } from "node:path";
import { withPageConfig } from "@extension/vite-config";

const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, "src");

export default withPageConfig({
  resolve: {
    alias: {
      "@src": srcDir,
      "@extension/ui": resolve(rootDir, "..", "..", "packages", "ui"),
      "@extension/content-ui": resolve(rootDir, "..", "content-ui", "src"),
      "@extension/shared": resolve(rootDir, "..", "..", "packages", "shared"),
      "@extension/storage": resolve(rootDir, "..", "..", "packages", "storage"),
      "@extension/i18n": resolve(rootDir, "..", "..", "packages", "i18n"),
    },
  },
  publicDir: resolve(rootDir, "public"),
  build: {
    outDir: resolve(rootDir, "..", "..", "dist", "side-panel"),
  },
});
