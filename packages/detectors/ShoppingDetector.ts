// Detects Impulsive Shopping behavior based on browsing and purchasing patterns with real-time monitoring.

export interface ShoppingDetectorConfig {
  visitThreshold: number; // number of visits within time window to trigger nudge
  timeWindow: number; // time window in ms to count visits
  monitoredDomains: string[]; // domains to monitor for shopping activity
  realTimeCheckInterval: number; // interval in ms for real-time checks
  sessionTimeout: number; // timeout for inactive sessions
  childBurstWindowMs: number; // window for child-link burst detection (e.g., 60s)
  childBurstThreshold: number; // unique child paths within window to flag impulse (e.g., 15)
  childBurstCooldownMs: number; // cooldown between bursts per domain
}

export interface ShoppingSession {
  visitCount: number;
  startTime: number;
  lastVisitTime: number;
  totalTimeSpent: number;
  urls: string[]; // track visited URLs
  recentPaths: Array<{ path: string; timestamp: number }>; // for burst detection
  lastBurstAt?: number; // last time a burst alert was emitted
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
      childBurstWindowMs: 60 * 1000,
      childBurstThreshold: 15,
      childBurstCooldownMs: 2 * 60 * 1000,
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
   * Update configuration at runtime
   */
  updateConfig(patch: Partial<ShoppingDetectorConfig>) {
    this.config = { ...this.config, ...patch };
  }

  /**
   * Record a tab visit with enhanced tracking
   * @param tabId - Chrome tab ID
   * @param url - current tab URL
   */
  recordVisit(tabId: number, url: string) {
    const domain = this.extractDomain(url);
    // If monitoredDomains is empty, monitor ALL domains; else restrict to the list
    if (this.config.monitoredDomains.length > 0 && !this.config.monitoredDomains.includes(domain)) return;

    const now = Date.now();
    const session = this.sessions.get(domain) || {
      visitCount: 0,
      startTime: now,
      lastVisitTime: now,
      totalTimeSpent: 0,
      urls: [],
      recentPaths: [],
    };

    // Reset session if time window exceeded
    if (now - session.startTime > this.config.timeWindow) {
      session.visitCount = 0;
      session.startTime = now;
      session.totalTimeSpent = 0;
      session.urls = [];
      session.recentPaths = [];
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

    // Track child-link bursts within time window
    const path = this.extractPath(url);
    if (path && this.isLikelyProductPath(path, url)) {
      // Keep only recent items within window
      const windowStart = now - this.config.childBurstWindowMs;
      session.recentPaths = session.recentPaths.filter((p) => p.timestamp >= windowStart);
      session.recentPaths.push({ path, timestamp: now });

      const uniqueCount = new Set(session.recentPaths.map((p) => p.path)).size;
      const inCooldown = !!session.lastBurstAt && now - session.lastBurstAt < this.config.childBurstCooldownMs;
      if (!inCooldown && uniqueCount >= this.config.childBurstThreshold) {
        // Emit immediate high-severity event
        const event: ShoppingEvent = {
          domain,
          url,
          tabId,
          severity: "high",
          timestamp: now,
          visitCount: session.visitCount,
          timeSpent: session.totalTimeSpent,
        };
        this.eventListeners.forEach((listener) => listener(event));
        session.lastBurstAt = now;
      }
    }

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
    const allow = this.config.monitoredDomains.length === 0 || this.config.monitoredDomains.includes(domain);
    if (allow) {
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
    // Use unique product-like paths within the burst window
    const now = Date.now();
    const windowStart = now - this.config.childBurstWindowMs;
    const unique = new Set(
      (session.recentPaths || []).filter(p => p.timestamp >= windowStart).map(p => p.path)
    ).size;
    return unique >= this.config.childBurstThreshold;
  }

  /**
   * Get shopping severity level
   * @param domain - domain to check
   */
  getShoppingSeverity(domain: string): "low" | "medium" | "high" | null {
    const session = this.sessions.get(domain);
    if (!session) return null;

    const now = Date.now();
    const windowStart = now - this.config.childBurstWindowMs;
    const unique = new Set(
      (session.recentPaths || []).filter(p => p.timestamp >= windowStart).map(p => p.path)
    ).size;

    if (unique >= this.config.childBurstThreshold) return "high";
    if (unique >= Math.ceil(this.config.childBurstThreshold * 0.66)) return "medium";
    if (unique >= Math.ceil(this.config.childBurstThreshold * 0.33)) return "low";
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

  private extractPath(url: string): string {
    try {
      const u = new URL(url);
      const basePath = u.pathname.replace(/\/$/, "");
      // Preserve an identifying query token if present
      const importantKeys = ["id", "sku", "product", "pid", "item", "model"]; 
      for (const k of importantKeys) {
        const v = u.searchParams.get(k);
        if (v) return `${basePath}?${k}=${v}`;
      }
      return basePath;
    } catch {
      return "";
    }
  }

  /** Heuristic: treat only deep or explicitly identified paths as product pages */
  private isLikelyProductPath(path: string, url: string): boolean {
    try {
      const clean = path.split("?")[0];
      const segs = clean.split("/").filter(Boolean);
      if (segs.length >= 2) return true; // e.g., /dp/B0.. or /p/xyz
      // If id-like query token exists, we already included it in path string above
      return /\?(id|sku|product|pid|item|model)=/.test(path);
    } catch {
      return false;
    }
  }
}
