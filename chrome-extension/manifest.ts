import { readFileSync } from "node:fs";
import type { ManifestType } from "@extension/shared";

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));

/**
 * @prop default_locale
 * if you want to support multiple languages, you can use the following reference
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
 *
 * @prop browser_specific_settings
 * Must be unique to your extension to upload to addons.mozilla.org
 * (you can delete if you only want a chrome extension)
 *
 * @prop permissions
 * Firefox doesn't support sidePanel (It will be deleted in manifest parser)
 *
 * @prop content_scripts
 * css: ['content.css'], // public folder
 */
const manifest = {
  manifest_version: 3,
  default_locale: "en",
  name: "__MSG_extensionName__",
  browser_specific_settings: {
    gecko: {
      id: "kaizen@kaizen.com",
      strict_min_version: "109.0",
    },
  },
  version: packageJson.version,
  description: "__MSG_extensionDescription__",
  host_permissions: ["<all_urls>"],
  permissions: [
    "storage",
    "scripting",
    "tabs",
    "notifications",
    "sidePanel",
    "contextMenus",
    "alarms",
  ],
  trial_tokens: [
    "A8kuLbqI8jFb/3TxrBgIifoHcSjb4lHYx4TG8QHs852LOkGyztGVENErpVqkPkF+Ce3M+jAqmutDyFqMB5OOzQsAAACPeyJvcmlnaW4iOiJjaHJvbWUtZXh0ZW5zaW9uOi8vZWdqbWRsZGJoZW5ramtoZm5wcGxjZm9wcGRla2RubWMiLCJmZWF0dXJlIjoiQUlQcm9tcHRBUElNdWx0aW1vZGFsSW5wdXQiLCJleHBpcnkiOjE3NzQzMTA0MDAsImlzVGhpcmRQYXJ0eSI6dHJ1ZX0=",
    "A88y3+tJI65RmD+6E71+p7qcAYUq8+J2hjTUTQ9ATzcpPX6oaO1VGMM+h4m1EZNChbnE2I2516mifT5GX8eiIQYAAACFeyJvcmlnaW4iOiJjaHJvbWUtZXh0ZW5zaW9uOi8vZWdqbWRsZGJoZW5ramtoZm5wcGxjZm9wcGRla2RubWMiLCJmZWF0dXJlIjoiQUlQcm9vZnJlYWRlckFQSSIsImV4cGlyeSI6MTc3OTE0ODgwMCwiaXNUaGlyZFBhcnR5Ijp0cnVlfQ==",
    "A4fGsXg2ahT741tuEPYapnUrdV/f3DwU1+Dcx02J7nqxXCbg2t1iZP6UixZTziu/tAFG/2mU8nJHMabCZ0IrbA8AAACCeyJvcmlnaW4iOiJjaHJvbWUtZXh0ZW5zaW9uOi8vZWdqbWRsZGJoZW5ramtoZm5wcGxjZm9wcGRla2RubWMiLCJmZWF0dXJlIjoiQUlSZXdyaXRlckFQSSIsImV4cGlyeSI6MTc2OTQ3MjAwMCwiaXNUaGlyZFBhcnR5Ijp0cnVlfQ==",
    "A8i+2bjL6SC4GXLQa4dy2nkhkKYJUnefTNwfZe7K6hDn0tqU/giYPQWROGKa3aOgHRLPYxQE+YORPIuoE2OGLA8AAACAeyJvcmlnaW4iOiJjaHJvbWUtZXh0ZW5zaW9uOi8vZWdqbWRsZGJoZW5ramtoZm5wcGxjZm9wcGRla2RubWMiLCJmZWF0dXJlIjoiQUlXcml0ZXJBUEkiLCJleHBpcnkiOjE3Njk0NzIwMDAsImlzVGhpcmRQYXJ0eSI6dHJ1ZX0=",
  ],
  options_page: "options/index.html",
  background: {
    service_worker: "background.js",
    type: "module",
  },
  action: {
    default_icon: "icon-34.png",
  },
  icons: {
    "128": "icon-128.png",
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["content/all.iife.js"],
    },
    {
      matches: ["https://example.com/*"],
      js: ["content/example.iife.js"],
    },
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["content-ui/all.iife.js"],
    },
    {
      matches: ["https://example.com/*"],
      js: ["content-ui/example.iife.js"],
    },
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      css: ["content.css"],
    },
  ],
  devtools_page: "devtools/index.html",
  web_accessible_resources: [
    {
      resources: ["*.js", "*.css", "*.svg", "icon-128.png", "icon-34.png"],
      matches: ["*://*/*"],
    },
  ],
  side_panel: {
    default_path: "side-panel/index.html",
  },
} satisfies ManifestType;

export default manifest;
