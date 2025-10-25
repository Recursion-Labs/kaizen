export class BehaviorMonitor {
  constructor(
    onTabActivated: (tabId: number) => void,
    onTabUpdated: (
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab,
    ) => void,
    onTabRemoved?: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void,
  ) {
    this.setupListeners(onTabActivated, onTabUpdated, onTabRemoved);
  }

  private setupListeners(
    onTabActivated: (tabId: number) => void,
    onTabUpdated: (
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab,
    ) => void,
    onTabRemoved?: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void,
  ): void {
    chrome.tabs.onActivated.addListener((activeInfo) => {
      console.log(`Tab ${activeInfo.tabId} was activated.`);
      onTabActivated(activeInfo.tabId);
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === "complete" && tab.url) {
        console.log(`Tab ${tabId} finished loading: ${tab.url}`);
        onTabUpdated(tabId, changeInfo, tab);
      }
    });

    if (onTabRemoved) {
      chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
        console.log(`Tab ${tabId} removed (isWindowClosing=${removeInfo.isWindowClosing}).`);
        onTabRemoved(tabId, removeInfo);
      });
    }

    console.log("Behavior monitor initialized.");
  }
}
