/**
 * Tab Grouping Service
 * Automatically organizes tabs into groups based on domain, category, and behavior patterns
 */

export interface TabGroup {
  id: number;
  title: string;
  color: chrome.tabGroups.Color;
  collapsed: boolean;
  tabIds: number[];
}

export interface GroupingRule {
  type: 'domain' | 'category' | 'pattern';
  value: string;
  groupName: string;
  color: chrome.tabGroups.Color;
}

const DOMAIN_CATEGORIES: Record<string, { category: string; color: chrome.tabGroups.Color }> = {
  // Social Media
  'twitter.com': { category: 'Social Media', color: 'blue' as chrome.tabGroups.Color },
  'facebook.com': { category: 'Social Media', color: 'blue' as chrome.tabGroups.Color },
  'instagram.com': { category: 'Social Media', color: 'blue' as chrome.tabGroups.Color },
  'linkedin.com': { category: 'Social Media', color: 'blue' as chrome.tabGroups.Color },
  'reddit.com': { category: 'Social Media', color: 'blue' as chrome.tabGroups.Color },
  'tiktok.com': { category: 'Social Media', color: 'blue' as chrome.tabGroups.Color },
  
  // Video Streaming
  'youtube.com': { category: 'Video', color: 'red' as chrome.tabGroups.Color },
  'netflix.com': { category: 'Video', color: 'red' as chrome.tabGroups.Color },
  'twitch.tv': { category: 'Video', color: 'red' as chrome.tabGroups.Color },
  'vimeo.com': { category: 'Video', color: 'red' as chrome.tabGroups.Color },
  
  // Shopping
  'amazon.com': { category: 'Shopping', color: 'orange' as chrome.tabGroups.Color },
  'ebay.com': { category: 'Shopping', color: 'orange' as chrome.tabGroups.Color },
  'etsy.com': { category: 'Shopping', color: 'orange' as chrome.tabGroups.Color },
  'walmart.com': { category: 'Shopping', color: 'orange' as chrome.tabGroups.Color },
  'aliexpress.com': { category: 'Shopping', color: 'orange' as chrome.tabGroups.Color },
  
  // News
  'news.google.com': { category: 'News', color: 'grey' as chrome.tabGroups.Color },
  'bbc.com': { category: 'News', color: 'grey' as chrome.tabGroups.Color },
  'cnn.com': { category: 'News', color: 'grey' as chrome.tabGroups.Color },
  'nytimes.com': { category: 'News', color: 'grey' as chrome.tabGroups.Color },
  
  // Development
  'github.com': { category: 'Development', color: 'purple' as chrome.tabGroups.Color },
  'stackoverflow.com': { category: 'Development', color: 'purple' as chrome.tabGroups.Color },
  'gitlab.com': { category: 'Development', color: 'purple' as chrome.tabGroups.Color },
  'dev.to': { category: 'Development', color: 'purple' as chrome.tabGroups.Color },
  
  // Productivity
  'mail.google.com': { category: 'Productivity', color: 'green' as chrome.tabGroups.Color },
  'docs.google.com': { category: 'Productivity', color: 'green' as chrome.tabGroups.Color },
  'notion.so': { category: 'Productivity', color: 'green' as chrome.tabGroups.Color },
  'trello.com': { category: 'Productivity', color: 'green' as chrome.tabGroups.Color },
  'asana.com': { category: 'Productivity', color: 'green' as chrome.tabGroups.Color },
};

const AVAILABLE_COLORS: chrome.tabGroups.Color[] = [
  'grey' as chrome.tabGroups.Color,
  'blue' as chrome.tabGroups.Color,
  'red' as chrome.tabGroups.Color,
  'yellow' as chrome.tabGroups.Color,
  'green' as chrome.tabGroups.Color,
  'pink' as chrome.tabGroups.Color,
  'purple' as chrome.tabGroups.Color,
  'cyan' as chrome.tabGroups.Color,
  'orange' as chrome.tabGroups.Color
];

export class TabGroupingService {
  private static instance: TabGroupingService;
  private groupingEnabled: boolean = false;
  private autoGroupOnCreate: boolean = false;
  private customRules: GroupingRule[] = [];

  private constructor() {
    this.loadSettings();
    this.setupListeners();
  }

  public static getInstance(): TabGroupingService {
    if (!TabGroupingService.instance) {
      TabGroupingService.instance = new TabGroupingService();
    }
    return TabGroupingService.instance;
  }

  /**
   * Load grouping settings from storage
   */
  private async loadSettings(): Promise<void> {
    try {
      const result = await chrome.storage.local.get(['tabGroupingSettings']);
      const settings = result.tabGroupingSettings || {};
      
      this.groupingEnabled = settings.enabled !== false; // Default true
      this.autoGroupOnCreate = settings.autoGroupOnCreate || false;
      this.customRules = settings.customRules || [];
    } catch (error) {
      console.error('[TabGrouping] Failed to load settings:', error);
    }
  }

  /**
   * Save grouping settings
   */
  public async saveSettings(settings: Partial<{
    enabled: boolean;
    autoGroupOnCreate: boolean;
    customRules: GroupingRule[];
  }>): Promise<void> {
    try {
      const current = await chrome.storage.local.get(['tabGroupingSettings']);
      const updated = { ...current.tabGroupingSettings, ...settings };
      
      await chrome.storage.local.set({ tabGroupingSettings: updated });
      
      if (settings.enabled !== undefined) this.groupingEnabled = settings.enabled;
      if (settings.autoGroupOnCreate !== undefined) this.autoGroupOnCreate = settings.autoGroupOnCreate;
      if (settings.customRules !== undefined) this.customRules = settings.customRules;
    } catch (error) {
      console.error('[TabGrouping] Failed to save settings:', error);
    }
  }

  /**
   * Setup tab listeners for auto-grouping
   */
  private setupListeners(): void {
    if (!chrome.tabs?.onCreated) return;

    chrome.tabs.onCreated.addListener(async (tab) => {
      if (this.autoGroupOnCreate && tab.url) {
        await this.groupTab(tab.id!, tab.url);
      }
    });

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (this.autoGroupOnCreate && changeInfo.url) {
        await this.groupTab(tabId, changeInfo.url);
      }
    });
  }

  /**
   * Get category for a domain
   */
  private getCategoryForDomain(url: string): { category: string; color: chrome.tabGroups.Color } | null {
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      
      // Check exact match
      if (DOMAIN_CATEGORIES[hostname]) {
        return DOMAIN_CATEGORIES[hostname];
      }
      
      // Check if any known domain is a substring
      for (const [domain, info] of Object.entries(DOMAIN_CATEGORIES)) {
        if (hostname.includes(domain) || domain.includes(hostname)) {
          return info;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Group a single tab
   */
  private async groupTab(tabId: number, url: string): Promise<void> {
    if (!this.groupingEnabled) return;

    try {
      const categoryInfo = this.getCategoryForDomain(url);
      if (!categoryInfo) return;

      const tab = await chrome.tabs.get(tabId);
      if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) return; // Already grouped

      // Find existing group with same category
      const groups = await chrome.tabGroups.query({ windowId: tab.windowId });
      const existingGroup = groups.find(g => g.title === categoryInfo.category);

      if (existingGroup) {
        // Add to existing group
        await chrome.tabs.group({ tabIds: [tabId], groupId: existingGroup.id });
      } else {
        // Create new group
        const groupId = await chrome.tabs.group({ tabIds: [tabId] });
        await chrome.tabGroups.update(groupId, {
          title: categoryInfo.category,
          color: categoryInfo.color,
          collapsed: false,
        });
      }
    } catch (error) {
      console.error('[TabGrouping] Failed to group tab:', error);
    }
  }

  /**
   * Group all tabs in current window by category
   */
  public async groupAllTabsByCategory(): Promise<void> {
    if (!this.groupingEnabled) return;

    try {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const categoryTabs: Record<string, number[]> = {};

      // Categorize tabs
      for (const tab of tabs) {
        if (!tab.url || !tab.id) continue;
        
        const categoryInfo = this.getCategoryForDomain(tab.url);
        if (categoryInfo) {
          const category = categoryInfo.category;
          if (!categoryTabs[category]) {
            categoryTabs[category] = [];
          }
          categoryTabs[category].push(tab.id);
        }
      }

      // Create groups
      for (const [category, tabIds] of Object.entries(categoryTabs)) {
        if (tabIds.length > 0) {
          const categoryInfo = this.getCategoryForDomain(tabs.find(t => tabIds.includes(t.id!))?.url || '');
          const groupId = await chrome.tabs.group({ tabIds });
          await chrome.tabGroups.update(groupId, {
            title: category,
            color: categoryInfo?.color || ('grey' as chrome.tabGroups.Color),
            collapsed: false,
          });
        }
      }

      console.log(`[TabGrouping] Grouped tabs into ${Object.keys(categoryTabs).length} categories`);
    } catch (error) {
      console.error('[TabGrouping] Failed to group all tabs:', error);
      throw error;
    }
  }

  /**
   * Group tabs by domain (one group per domain)
   */
  public async groupAllTabsByDomain(): Promise<void> {
    if (!this.groupingEnabled) return;

    try {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const domainTabs: Record<string, number[]> = {};

      // Categorize by domain
      for (const tab of tabs) {
        if (!tab.url || !tab.id) continue;
        
        try {
          const hostname = new URL(tab.url).hostname.replace('www.', '');
          if (!domainTabs[hostname]) {
            domainTabs[hostname] = [];
          }
          domainTabs[hostname].push(tab.id);
        } catch (error) {
          continue;
        }
      }

      // Create groups for domains with multiple tabs
      let colorIndex = 0;
      for (const [domain, tabIds] of Object.entries(domainTabs)) {
        if (tabIds.length > 1) {
          const groupId = await chrome.tabs.group({ tabIds });
          await chrome.tabGroups.update(groupId, {
            title: domain,
            color: AVAILABLE_COLORS[colorIndex % AVAILABLE_COLORS.length],
            collapsed: false,
          });
          colorIndex++;
        }
      }

      console.log(`[TabGrouping] Grouped tabs by domain`);
    } catch (error) {
      console.error('[TabGrouping] Failed to group by domain:', error);
      throw error;
    }
  }

  /**
   * Ungroup all tabs in current window
   */
  public async ungroupAllTabs(): Promise<void> {
    try {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const groupedTabs = tabs.filter(tab => tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE);
      
      if (groupedTabs.length > 0) {
        const tabIds = groupedTabs.map(tab => tab.id!);
        await chrome.tabs.ungroup(tabIds);
      }

      console.log(`[TabGrouping] Ungrouped ${groupedTabs.length} tabs`);
    } catch (error) {
      console.error('[TabGrouping] Failed to ungroup tabs:', error);
      throw error;
    }
  }

  /**
   * Get all groups in current window
   */
  public async getAllGroups(): Promise<TabGroup[]> {
    try {
      const [tabs, groups] = await Promise.all([
        chrome.tabs.query({ currentWindow: true }),
        chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }),
      ]);

      return groups.map(group => ({
        id: group.id,
        title: group.title || 'Untitled',
        color: group.color as chrome.tabGroups.Color,
        collapsed: group.collapsed,
        tabIds: tabs.filter(tab => tab.groupId === group.id).map(tab => tab.id!),
      }));
    } catch (error) {
      console.error('[TabGrouping] Failed to get groups:', error);
      return [];
    }
  }

  /**
   * Collapse/expand a group
   */
  public async toggleGroupCollapse(groupId: number): Promise<void> {
    try {
      const group = await chrome.tabGroups.get(groupId);
      await chrome.tabGroups.update(groupId, { collapsed: !group.collapsed });
    } catch (error) {
      console.error('[TabGrouping] Failed to toggle group:', error);
      throw error;
    }
  }

  /**
   * Rename a group
   */
  public async renameGroup(groupId: number, title: string): Promise<void> {
    try {
      await chrome.tabGroups.update(groupId, { title });
    } catch (error) {
      console.error('[TabGrouping] Failed to rename group:', error);
      throw error;
    }
  }

  /**
   * Change group color
   */
  public async changeGroupColor(groupId: number, color: chrome.tabGroups.Color): Promise<void> {
    try {
      await chrome.tabGroups.update(groupId, { color });
    } catch (error) {
      console.error('[TabGrouping] Failed to change color:', error);
      throw error;
    }
  }

  /**
   * Close all tabs in a group
   */
  public async closeGroup(groupId: number): Promise<void> {
    try {
      const tabs = await chrome.tabs.query({ groupId });
      const tabIds = tabs.map(tab => tab.id!);
      await chrome.tabs.remove(tabIds);
    } catch (error) {
      console.error('[TabGrouping] Failed to close group:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const tabGroupingService = TabGroupingService.getInstance();
