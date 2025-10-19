import env, { IS_DEV, IS_PROD } from "@extension/env";
import { watchRebuildPlugin } from "@extension/hmr";
import react from "@vitejs/plugin-react-swc";
import deepmerge from "deepmerge";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import type { UserConfig } from "vite";

export const watchOption = IS_DEV
  ? {
      chokidar: {
        awaitWriteFinish: true,
      },
    }
  : undefined;

export const withPageConfig = (config: UserConfig) =>
  defineConfig(
    deepmerge(
      {
        define: {
          "process.env": env,
        },
        base: "",
        plugins: [
          react(),
          IS_DEV && watchRebuildPlugin({ refresh: true }),
          nodePolyfills(),
          // Inject minimal chrome API stubs in dev so pages work outside extension context
          IS_DEV && {
            name: "inject-chrome-stub",
            transformIndexHtml() {
              return [
                {
                  tag: "script",
                  attrs: { type: "module" },
                  injectTo: "head",
                  children: `
                    // Minimal dev-only chrome API stubs for Vite preview
                    const g = globalThis;
                    if (!('chrome' in g)) g.chrome = {} as any;
                    const c: any = g.chrome;
                    c.runtime = c.runtime ?? {
                      getURL: (p: string) => p,
                      openOptionsPage: () => {},
                    };
                    c.tabs = c.tabs ?? {
                      create: async () => ({}),
                      query: async () => ([]),
                    };
                    const makeArea = () => ({
                      async get() { return {}; },
                      async set() { /* no-op */ },
                    });
                    c.storage = c.storage ?? {
                      local: { ...makeArea(), onChanged: { addListener() {} } },
                      session: { ...makeArea(), onChanged: { addListener() {} } },
                      sync: { ...makeArea(), onChanged: { addListener() {} } },
                    };
                  `,
                },
              ];
            },
          },
        ],
        build: {
          sourcemap: IS_DEV,
          minify: IS_PROD,
          reportCompressedSize: IS_PROD,
          emptyOutDir: IS_PROD,
          watch: watchOption,
          rollupOptions: {
            external: ["chrome"],
          },
        },
      },
      config
    )
  );
