// Detect's if a user is doomscrolling based on their browsing patterns.

export interface DoomScrollingConfig {
  scrollThreshold: number; // total scroll distance in pixels before nudge
  timeWindow: number; // time window to accumulate scroll
  monitoredDomains: string[]; // list of domains to monitor for doomscrolling (optional for now)
}

export interface ScrollSession {
  accumulatedScroll: number;
  startTime: number;
}

export class DoomScrolling {
  private sessions: Map<number, ScrollSession> = new Map();
  private config: DoomScrollingConfig;

  constructor(config?: Partial<DoomScrollingConfig>) {
    this.config = {
      scrollThreshold: 5000, // default: 5000px
      timeWindow: 10 * 60 * 1000, // default: 10 minutes
      monitoredDomains: [
        "twitter.com",
        "facebook.com",
        "instagram.com",
        "reddit.com",
        "discord.com",
        "youtube.com",
        "tiktok.com",
        "linkedin.com",
        "pinterest.com",
        "snapchat.com",
        "tumblr.com",
        "medium.com",
        "quora.com",
        "netflix.com",
        "hulu.com",
        "amazon.com",
        "flipkart.com",
        "ebay.com",
      ], // default monitored domains
      ...config,
    };
  }

  /**
   * Adds scroll amount for a tab.
   * @param tabId - Chrome tab ID
   * @param scrollAmount - pixels scrolled
   * @param url - current tab URL
   */

  addScroll(tabId: number, scrollAmount: number, url: string) {
    // Ignore domains not monitored
    if (!this.isMonitoredDomain(url)) return;

    const now = Date.now();
    const session = this.sessions.get(tabId) || {
      accumulatedScroll: 0,
      startTime: now,
    };

    // Reset session if time window exceeded
    if (now - session.startTime > this.config.timeWindow) {
      session.accumulatedScroll = 0;
      session.startTime = now;
    }

    session.accumulatedScroll += scrollAmount;
    this.sessions.set(tabId, session);
  }

  /**
   * Check if a tab is currently doomscrolling
   * @param tabId - Chrome tab ID
   */
  isDoomScrolling(tabId: number): boolean {
    const session = this.sessions.get(tabId);
    if (!session) return false;
    return session.accumulatedScroll >= this.config.scrollThreshold;
  }

  /**
   * Reset scroll session for a tab
   * @param tabId - Chrome tab ID
   */
  resetScroll(tabId: number) {
    this.sessions.delete(tabId);
  }

  /**
   * Helper to check if URL belongs to a monitored domain
   */
  private isMonitoredDomain(url: string): boolean {
    try {
      const hostname = new URL(url).hostname.replace("www.", "");
      return this.config.monitoredDomains.some((domain) =>
        hostname.includes(domain),
      );
    } catch {
      return false;
    }
  }
}
