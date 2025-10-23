// Detects if a user is doomscrolling based on their browsing patterns with real-time monitoring.

export interface DoomScrollingConfig {
  scrollThreshold: number; // total scroll distance in pixels before nudge
  timeWindow: number; // time window to accumulate scroll
  monitoredDomains: string[]; // list of domains to monitor for doomscrolling
  realTimeCheckInterval: number; // interval in ms for real-time checks
}

export interface ScrollSession {
  accumulatedScroll: number;
  startTime: number;
  lastScrollTime: number;
  scrollEvents: number;
}

export interface DoomScrollingEvent {
  tabId: number;
  url: string;
  severity: "low" | "medium" | "high";
  timestamp: number;
  scrollAmount: number;
}

export class DoomScrolling {
  private sessions: Map<number, ScrollSession> = new Map();
  private config: DoomScrollingConfig;
  private eventListeners: ((event: DoomScrollingEvent) => void)[] = [];
  private checkInterval?: NodeJS.Timeout;

  constructor(config?: Partial<DoomScrollingConfig>) {
    this.config = {
      scrollThreshold: 5000, // default: 5000px
      timeWindow: 10 * 60 * 1000, // default: 10 minutes
      realTimeCheckInterval: 5000, // default: 5 seconds
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
   * Get monitored domains
   */
  getMonitoredDomains(): string[] {
    return this.config.monitoredDomains;
  }

  /**
   * Adds scroll amount for a tab with real-time monitoring.
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
      lastScrollTime: now,
      scrollEvents: 0,
    };

    // Reset session if time window exceeded
    if (now - session.startTime > this.config.timeWindow) {
      session.accumulatedScroll = 0;
      session.startTime = now;
      session.scrollEvents = 0;
    }

    session.accumulatedScroll += scrollAmount;
    session.lastScrollTime = now;
    session.scrollEvents += 1;
    this.sessions.set(tabId, session);

    // Check for doomscrolling in real-time
    this.checkDoomScrollingRealTime(tabId, url, scrollAmount);
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
   * Get doomscrolling severity level
   * @param tabId - Chrome tab ID
   */
  getDoomScrollingSeverity(tabId: number): "low" | "medium" | "high" | null {
    const session = this.sessions.get(tabId);
    if (!session) return null;

    const scrollRatio = session.accumulatedScroll / this.config.scrollThreshold;
    if (scrollRatio >= 2) return "high";
    if (scrollRatio >= 1.5) return "medium";
    if (scrollRatio >= 1) return "low";
    return null;
  }

  /**
   * Start real-time monitoring
   */
  startRealTimeMonitoring() {
    if (this.checkInterval) return;
    this.checkInterval = setInterval(() => {
      this.performRealTimeCheck();
    }, this.config.realTimeCheckInterval);
  }

  /**
   * Stop real-time monitoring
   */
  stopRealTimeMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
    }
  }

  /**
   * Add event listener for doomscrolling events
   */
  addEventListener(listener: (event: DoomScrollingEvent) => void) {
    this.eventListeners.push(listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(listener: (event: DoomScrollingEvent) => void) {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  /**
   * Reset scroll session for a tab
   * @param tabId - Chrome tab ID
   */
  resetScroll(tabId: number) {
    this.sessions.delete(tabId);
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): Map<number, ScrollSession> {
    return new Map(this.sessions);
  }

  /**
   * Clean up old sessions
   */
  cleanupOldSessions() {
    const now = Date.now();
    for (const [tabId, session] of this.sessions.entries()) {
      if (now - session.lastScrollTime > this.config.timeWindow * 2) {
        this.sessions.delete(tabId);
      }
    }
  }

  /**
   * Real-time doomscrolling check
   */
  private checkDoomScrollingRealTime(
    tabId: number,
    url: string,
    scrollAmount: number,
  ) {
    const severity = this.getDoomScrollingSeverity(tabId);
    if (severity) {
      const event: DoomScrollingEvent = {
        tabId,
        url,
        severity,
        timestamp: Date.now(),
        scrollAmount,
      };
      this.eventListeners.forEach((listener) => listener(event));
    }
  }

  /**
   * Perform periodic real-time check
   */
  private performRealTimeCheck() {
    this.cleanupOldSessions();
    for (const [tabId, session] of this.sessions.entries()) {
      if (this.isDoomScrolling(tabId)) {
        const severity = this.getDoomScrollingSeverity(tabId);
        if (severity) {
          const event: DoomScrollingEvent = {
            tabId,
            url: "", // URL not available in periodic check
            severity,
            timestamp: Date.now(),
            scrollAmount: session.accumulatedScroll,
          };
          this.eventListeners.forEach((listener) => listener(event));
        }
      }
    }
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
