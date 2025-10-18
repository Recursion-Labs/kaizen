// Detects Impulsive Shopping behavior based on browsing and purchasing patterns.

export interface ShoppingDetectorConfig {
  visitThreshold: number; // number of visits within time window to trigger nudge
  timeWindow: number; // time window in ms to count visits
  monitoredDomains: string[]; // domains to monitor for shopping activity
}

export interface ShoppingSession {
  visitCount: number;
  startTime: number;
}

export class ShoppingDetector {
  private sessions: Map<string, ShoppingSession> = new Map();
  private config: ShoppingDetectorConfig;

  constructor(config?: Partial<ShoppingDetectorConfig>) {
    this.config = {
      visitThreshold: 3,
      timeWindow: 10 * 60 * 1000,
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
        "aliexpress.com"
      ],
      ...config,
    };
  }

  /** Getter to access monitored domains safely */
  getMonitoredDomains(): string[] {
    return this.config.monitoredDomains;
  }

  /**
   * Record a tab visit
   * @param tabId - Chrome tab ID
   * @param url - current tab URL
   */
  recordVisit(tabId: number, url: string) {
    const domain = this.extractDomain(url);
    if (!this.config.monitoredDomains.includes(domain)) return;

    const now = Date.now();
    const session = this.sessions.get(domain) || { visitCount: 0, startTime: now };

    // Reset session if time window exceeded
    if (now - session.startTime > this.config.timeWindow) {
      session.visitCount = 0;
      session.startTime = now;
    }

    session.visitCount += 1;
    this.sessions.set(domain, session);
  }

  isImpulsive(domain: string): boolean {
    const session = this.sessions.get(domain);
    if (!session) return false;
    return session.visitCount >= this.config.visitThreshold;
  }

  reset(domain: string) {
    this.sessions.delete(domain);
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "";
    }
  }
}
