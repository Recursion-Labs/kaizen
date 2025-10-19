export class BehaviorMonitor {
  constructor(
    onTabActivated: (tabId: number) => void,
    onTabUpdated: (
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab,
    ) => void,
  ) {
    this.setupListeners(onTabActivated, onTabUpdated);
  }

  private setupListeners(
    onTabActivated: (tabId: number) => void,
    onTabUpdated: (
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab,
    ) => void,
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

    console.log("Behavior monitor initialized.");
  }
}
