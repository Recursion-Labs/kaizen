import { resolve } from "node:path";
import { makeEntryPointPlugin } from "@extension/hmr";
import {
  getContentScriptEntries,
  withPageConfig,
} from "@extension/vite-config";
import { IS_DEV } from "@extension/env";

const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, "src");
const matchesDir = resolve(srcDir, "matches");

// For development, we'll use the main entry point
// In production, build.mts handles multiple entries
const mainEntry = resolve(matchesDir, "all", "index.ts");

export default withPageConfig({
  resolve: {
    alias: {
      "@src": srcDir,
    },
  },
  publicDir: resolve(rootDir, "public"),
  plugins: [IS_DEV && makeEntryPointPlugin()],
  build: {
    outDir: resolve(rootDir, "..", "..", "dist", "content-ui"),
    lib: IS_DEV
      ? undefined
      : {
          name: "content-ui",
          formats: ["iife"],
          entry: mainEntry,
          fileName: "all",
        },
    rollupOptions: IS_DEV
      ? {
          input: resolve(rootDir, "index.html"),
        }
      : undefined,
  },
  server: {
    host: true,
    port: 5176,
  },
});
