// Tacks time spent on various websites to help users understand their digital habits.

export interface TimeTrackerConfig {
  trackingInterval: number; // in seconds
  excludedSites: string[]; // websites to ignore
  alertThresholdMinutes: number; // time in minutes before nudges
}

export interface TabSession {
  url: string;
  tabId: number;
  startTime: number;
  accumulatedTime: number;
}

export class TimeTracker {
  private sessions: Map<number, TabSession> = new Map();
  private config: TimeTrackerConfig;

  constructor(config?: Partial<TimeTrackerConfig>) {
    this.config = {
      trackingInterval: 60,
      excludedSites: [],
      alertThresholdMinutes: 30,
      ...config,
    };
  }

  startTabSession(tabId: number, url: string) {
    if (this.config.excludedSites.some(site => url.includes(site))) return;
    if (!this.sessions.has(tabId)) {
      this.sessions.set(tabId, {
        tabId,
        url,
        startTime: Date.now(),
        accumulatedTime: 0,
      });
    }
  }

  stopTabSession(tabId: number) {
    const session = this.sessions.get(tabId);
    if (session) {
      session.accumulatedTime += Date.now() - session.startTime;
      session.startTime = Date.now();
      this.sessions.set(tabId, session);
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

  resetTabSession(tabId: number) {
    this.sessions.delete(tabId);
  }
}
