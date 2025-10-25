// Tracks time spent on various websites to help users understand their digital habits with real-time monitoring.

export interface TimeTrackerConfig {
  trackingInterval: number; // in seconds
  excludedSites: string[]; // websites to ignore
  alertThresholdMinutes: number; // time in minutes before nudges
  realTimeCheckInterval: number; // interval in ms for real-time checks
  sessionTimeout: number; // timeout for inactive sessions
  productivitySites: string[]; // sites considered productive
  entertainmentSites: string[]; // sites considered entertainment
}

export interface TabSession {
  url: string;
  tabId: number;
  startTime: number;
  accumulatedTime: number;
  lastActiveTime: number;
  domain: string;
  category: "productive" | "entertainment" | "neutral" | "unknown";
}

export interface TimeTrackingEvent {
  tabId: number;
  url: string;
  domain: string;
  category: string;
  timeSpent: number;
  severity: "low" | "medium" | "high";
  timestamp: number;
}

export class TimeTracker {
  private sessions: Map<number, TabSession> = new Map();
  private config: TimeTrackerConfig;
  private eventListeners: ((event: TimeTrackingEvent) => void)[] = [];
  private checkInterval?: NodeJS.Timeout;
  private dailyStats: Map<
    string,
    { productive: number; entertainment: number; neutral: number }
  > = new Map();

  constructor(config?: Partial<TimeTrackerConfig>) {
    this.config = {
      trackingInterval: 60,
      excludedSites: [],
      alertThresholdMinutes: 30,
      realTimeCheckInterval: 10000, // 10 seconds
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      productivitySites: [
        "github.com",
        "stackoverflow.com",
        "docs.google.com",
        "notion.so",
        "trello.com",
        "asana.com",
        "slack.com",
        "zoom.us",
        "teams.microsoft.com",
        "linkedin.com",
        "coursera.org",
        "udemy.com",
        "khanacademy.org",
        "wikipedia.org",
        "medium.com",
      ],
      entertainmentSites: [
        "youtube.com",
        "netflix.com",
        "hulu.com",
        "disney.com",
        "twitch.tv",
        "reddit.com",
        "x.com",
        "twitter.com",
        "facebook.com",
        "instagram.com",
        "tiktok.com",
        "snapchat.com",
        "pinterest.com",
        "tumblr.com",
        "discord.com",
        "spotify.com",
      ],
      ...config,
    };
  }

  startTabSession(tabId: number, url: string) {
    if (this.config.excludedSites.some((site) => url.includes(site))) return;

    const domain = this.extractDomain(url);
    const category = this.categorizeDomain(domain);

    if (!this.sessions.has(tabId)) {
      this.sessions.set(tabId, {
        tabId,
        url,
        startTime: Date.now(),
        accumulatedTime: 0,
        lastActiveTime: Date.now(),
        domain,
        category,
      });
    } else {
      // Update existing session
      const session = this.sessions.get(tabId)!;
      session.url = url;
      session.domain = domain;
      session.category = category;
      session.startTime = Date.now();
      session.lastActiveTime = Date.now();
      this.sessions.set(tabId, session);
    }
  }

  /**
   * Update tab activity (called when tab becomes active)
   */
  updateTabActivity(tabId: number) {
    const session = this.sessions.get(tabId);
    if (session) {
      session.lastActiveTime = Date.now();
      this.sessions.set(tabId, session);
    }
  }

  /**
   * Update tab URL
   */
  updateTabUrl(tabId: number, url: string) {
    const session = this.sessions.get(tabId);
    if (session) {
      session.url = url;
      session.domain = this.extractDomain(url);
      session.category = this.categorizeDomain(session.domain);
      session.lastActiveTime = Date.now();
      this.sessions.set(tabId, session);
    }
  }

  stopTabSession(tabId: number) {
    const session = this.sessions.get(tabId);
    if (session) {
      const timeSpent = Date.now() - session.startTime;
      session.accumulatedTime += timeSpent;
      session.lastActiveTime = Date.now();
      this.sessions.set(tabId, session);

      // Update daily stats
      this.updateDailyStats(session.domain, session.category, timeSpent);

      // Check for time threshold alerts
      this.checkTimeThreshold(tabId, session);
    }
  }

  checkLongSessions(): number[] {
    const now = Date.now();
    const longTabs: number[] = [];
    this.sessions.forEach((session) => {
      const totalTime = session.accumulatedTime + (now - session.startTime);
      if (totalTime / 60000 >= this.config.alertThresholdMinutes) {
        longTabs.push(session.tabId);
      }
    });
    return longTabs;
  }

  /**
   * Get time spent by category for today
   */
  getTodayStats(): {
    productive: number;
    entertainment: number;
    neutral: number;
  } {
    const today = new Date().toDateString();
    const base = this.dailyStats.get(today) || {
      productive: 0,
      entertainment: 0,
      neutral: 0,
    };

    // Add live time from active sessions
    const now = Date.now();
    for (const session of this.sessions.values()) {
      const live = session.accumulatedTime + (now - session.startTime);
      switch (session.category) {
        case 'productive':
          base.productive += live;
          break;
        case 'entertainment':
          base.entertainment += live;
          break;
        case 'neutral':
          base.neutral += live;
          break;
      }
    }

    return base;
  }

  /**
   * Get productivity score (0-1)
   */
  getProductivityScore(): number {
    const stats = this.getTodayStats();
    const total = stats.productive + stats.entertainment + stats.neutral;
    if (total === 0) return 0.5; // neutral if no data

    return stats.productive / total;
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
   * Add event listener for time tracking events
   */
  addEventListener(listener: (event: TimeTrackingEvent) => void) {
    this.eventListeners.push(listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(listener: (event: TimeTrackingEvent) => void) {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): Map<number, TabSession> {
    return new Map(this.sessions);
  }

  /**
   * Clean up old sessions
   */
  cleanupOldSessions() {
    const now = Date.now();
    for (const [tabId, session] of this.sessions.entries()) {
      if (now - session.lastActiveTime > this.config.sessionTimeout) {
        this.sessions.delete(tabId);
      }
    }
  }

  resetTabSession(tabId: number) {
    this.sessions.delete(tabId);
  }

  /**
   * Reset all sessions
   */
  resetAllSessions() {
    this.sessions.clear();
  }

  /**
   * Categorize domain based on configuration
   */
  private categorizeDomain(
    domain: string,
  ): "productive" | "entertainment" | "neutral" | "unknown" {
    if (this.config.productivitySites.some((site) => domain.includes(site))) {
      return "productive";
    }
    if (this.config.entertainmentSites.some((site) => domain.includes(site))) {
      return "entertainment";
    }
    return "neutral";
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "";
    }
  }

  /**
   * Update daily statistics
   */
  private updateDailyStats(
    domain: string,
    category: string,
    timeSpent: number,
  ) {
    const today = new Date().toDateString();
    const stats = this.dailyStats.get(today) || { productive: 0, entertainment: 0, neutral: 0 };

    switch (category) {
      case "productive":
        stats.productive += timeSpent;
        break;
      case "entertainment":
        stats.entertainment += timeSpent;
        break;
      case "neutral":
        stats.neutral += timeSpent;
        break;
    }

    this.dailyStats.set(today, stats);
  }

  /**
   * Check if time threshold is exceeded and trigger events
   */
  private checkTimeThreshold(tabId: number, session: TabSession) {
    const totalTime = session.accumulatedTime + (Date.now() - session.startTime);
    const timeInMinutes = totalTime / 60000;

    if (timeInMinutes >= this.config.alertThresholdMinutes) {
      let severity: "low" | "medium" | "high" = "low";
      if (timeInMinutes >= this.config.alertThresholdMinutes * 2)
        severity = "high";
      else if (timeInMinutes >= this.config.alertThresholdMinutes * 1.5)
        severity = "medium";

      const event: TimeTrackingEvent = {
        tabId,
        url: session.url,
        domain: session.domain,
        category: session.category,
        timeSpent: totalTime,
        severity,
        timestamp: Date.now(),
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
      this.checkTimeThreshold(tabId, session);
    }
  }
}
