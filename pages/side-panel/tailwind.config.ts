import { withUI } from "@extension/ui";
import deepmerge from "deepmerge";
import baseTheme from "../../packages/tailwindcss-config/tailwind.config";

export default deepmerge(baseTheme as unknown as import("tailwindcss").Config, withUI({
  content: ["index.html", "src/**/*.tsx"],
}));
