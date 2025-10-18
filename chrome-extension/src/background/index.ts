import "webextension-polyfill";
import { exampleThemeStorage } from "@extension/storage";

exampleThemeStorage.get().then((theme) => {
  console.log("theme", theme);
});

console.log("Background loaded");
console.log(
  "Edit 'chrome-extension/src/background/index.ts' and save to reload."
);

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Add context menu to open popup as an option
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openPopup",
    title: "Open Kaizen Popup",
    contexts: ["action"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openPopup") {
    // Open popup window
    chrome.windows.create({
      url: chrome.runtime.getURL("popup/index.html"),
      type: "popup",
      width: 400,
      height: 600,
    });
  }
});
  "Edit 'chrome-extension/src/background/index.ts' and save to reload.",
);
