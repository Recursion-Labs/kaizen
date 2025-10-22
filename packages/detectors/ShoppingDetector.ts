// Detects Impulsive Shopping behavior based on browsing and purchasing patterns with real-time monitoring.

export interface ShoppingDetectorConfig {
  visitThreshold: number; // number of visits within time window to trigger nudge
  timeWindow: number; // time window in ms to count visits
  monitoredDomains: string[]; // domains to monitor for shopping activity
  realTimeCheckInterval: number; // interval in ms for real-time checks
  sessionTimeout: number; // timeout for inactive sessions
}

export interface ShoppingSession {
  visitCount: number;
  startTime: number;
  lastVisitTime: number;
  totalTimeSpent: number;
  urls: string[]; // track visited URLs
}

export interface ShoppingEvent {
  domain: string;
  url: string;
  tabId: number;
  severity: "low" | "medium" | "high";
  timestamp: number;
  visitCount: number;
  timeSpent: number;
}

export class ShoppingDetector {
  private sessions: Map<string, ShoppingSession> = new Map();
  private config: ShoppingDetectorConfig;
  private eventListeners: ((event: ShoppingEvent) => void)[] = [];
  private checkInterval?: NodeJS.Timeout;
  private tabSessions: Map<number, { domain: string; startTime: number }> = new Map();

  constructor(config?: Partial<ShoppingDetectorConfig>) {
    this.config = {
      visitThreshold: 3,
      timeWindow: 10 * 60 * 1000,
      realTimeCheckInterval: 5000, // 5 seconds
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      monitoredDomains: [
        "amazon.com",
        "flipkart.com",
        "ebay.com",
        "myntra.com",
        "snapdeal.com",
        "ajio.com",
        "walmart.com",
        "target.com",
        "bestbuy.com",
        "aliexpress.com",
        "shopify.com",
        "etsy.com",
        "zappos.com",
        "overstock.com",
        "wayfair.com",
      ],
      ...config,
    };
  }

  /** Getter to access monitored domains safely */
  getMonitoredDomains(): string[] {
    return this.config.monitoredDomains;
  }

  /**
   * Record a tab visit with enhanced tracking
   * @param tabId - Chrome tab ID
   * @param url - current tab URL
   */
  recordVisit(tabId: number, url: string) {
    const domain = this.extractDomain(url);
    if (!this.config.monitoredDomains.includes(domain)) return;

    const now = Date.now();
    const session = this.sessions.get(domain) || {
      visitCount: 0,
      startTime: now,
      lastVisitTime: now,
      totalTimeSpent: 0,
      urls: [],
    };

    // Reset session if time window exceeded
    if (now - session.startTime > this.config.timeWindow) {
      session.visitCount = 0;
      session.startTime = now;
      session.totalTimeSpent = 0;
      session.urls = [];
    }

    // Track time spent if this is a continuation of a tab session
    const tabSession = this.tabSessions.get(tabId);
    if (tabSession && tabSession.domain === domain) {
      const timeSpent = now - tabSession.startTime;
      session.totalTimeSpent += timeSpent;
    }

    session.visitCount += 1;
    session.lastVisitTime = now;
    session.urls.push(url);
    this.sessions.set(domain, session);

    // Update tab session
    this.tabSessions.set(tabId, { domain, startTime: now });

    // Check for impulsive behavior in real-time
    this.checkImpulsiveBehaviorRealTime(domain, url, tabId);
  }

  /**
   * Start tab session tracking
   * @param tabId - Chrome tab ID
   * @param url - current tab URL
   */
  startTabSession(tabId: number, url: string) {
    const domain = this.extractDomain(url);
    if (this.config.monitoredDomains.includes(domain)) {
      this.tabSessions.set(tabId, { domain, startTime: Date.now() });
    }
  }

  /**
   * End tab session tracking
   * @param tabId - Chrome tab ID
   */
  endTabSession(tabId: number) {
    const tabSession = this.tabSessions.get(tabId);
    if (tabSession) {
      const domain = tabSession.domain;
      const session = this.sessions.get(domain);
      if (session) {
        const timeSpent = Date.now() - tabSession.startTime;
        session.totalTimeSpent += timeSpent;
        this.sessions.set(domain, session);
      }
      this.tabSessions.delete(tabId);
    }
  }

  isImpulsive(domain: string): boolean {
    const session = this.sessions.get(domain);
    if (!session) return false;
    return session.visitCount >= this.config.visitThreshold;
  }

  /**
   * Get shopping severity level
   * @param domain - domain to check
   */
  getShoppingSeverity(domain: string): "low" | "medium" | "high" | null {
    const session = this.sessions.get(domain);
    if (!session) return null;

    const visitRatio = session.visitCount / this.config.visitThreshold;
    const timeRatio = session.totalTimeSpent / (this.config.timeWindow / 2); // half the time window

    if (visitRatio >= 2 || timeRatio >= 0.8) return "high";
    if (visitRatio >= 1.5 || timeRatio >= 0.5) return "medium";
    if (visitRatio >= 1) return "low";
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
   * Add event listener for shopping events
   */
  addEventListener(listener: (event: ShoppingEvent) => void) {
    this.eventListeners.push(listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(listener: (event: ShoppingEvent) => void) {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): Map<string, ShoppingSession> {
    return new Map(this.sessions);
  }

  /**
   * Get session details for a domain
   */
  getSessionDetails(domain: string): ShoppingSession | null {
    return this.sessions.get(domain) || null;
  }

  /**
   * Clean up old sessions
   */
  cleanupOldSessions() {
    const now = Date.now();
    for (const [domain, session] of this.sessions.entries()) {
      if (now - session.lastVisitTime > this.config.sessionTimeout) {
        this.sessions.delete(domain);
      }
    }
  }

  /**
   * Reset session for a domain
   */
  reset(domain: string) {
    this.sessions.delete(domain);
  }

  /**
   * Reset all sessions
   */
  resetAll() {
    this.sessions.clear();
    this.tabSessions.clear();
  }

  /**
   * Check impulsive behavior in real-time
   */
  private checkImpulsiveBehaviorRealTime(
    domain: string,
    url: string,
    tabId: number,
  ) {
    const severity = this.getShoppingSeverity(domain);
    if (severity) {
      const session = this.sessions.get(domain)!;
      const event: ShoppingEvent = {
        domain,
        url,
        tabId,
        severity,
        timestamp: Date.now(),
        visitCount: session.visitCount,
        timeSpent: session.totalTimeSpent,
      };
      this.eventListeners.forEach((listener) => listener(event));
    }
  }

  /**
   * Perform periodic real-time check
   */
  private performRealTimeCheck() {
    this.cleanupOldSessions();
    for (const [domain, session] of this.sessions.entries()) {
      if (this.isImpulsive(domain)) {
        const severity = this.getShoppingSeverity(domain);
        if (severity) {
          const event: ShoppingEvent = {
            domain,
            url: session.urls[session.urls.length - 1] || "",
            tabId: 0, // Not available in periodic check
            severity,
            timestamp: Date.now(),
            visitCount: session.visitCount,
            timeSpent: session.totalTimeSpent,
          };
          this.eventListeners.forEach((listener) => listener(event));
        }
      }
    }
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "";
    }
  }
}
