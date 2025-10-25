// RAG based Pattern Analyzer for detecting specific user behaviors based on browsing data with real-time analysis.

import type { DoomScrolling, DoomScrollingEvent } from "./Doomscrolling";
import type { ShoppingDetector } from "./ShoppingDetector";
import type { TimeTracker } from "./TimeTracker";

export type InsightSeverity = "low" | "medium" | "high";

export interface PatternInsight {
  type:
    | "focusLoss"
    | "doomscrollingHabit"
    | "shoppingImpulse"
    | "multiTabOveruse"
    | "rapidTabSwitching"
    | "lateNightBrowsing"
    | "productivityLoss";
  description: string;
  severity: InsightSeverity;
  timestamp: number;
  confidence: number; // 0-1 confidence score
  metadata?: Record<string, unknown>;
}

export interface PatternAnalyzerConfig {
  analysisIntervalMinutes: number; // how often to analyze
  longSessionThresholdMinutes: number; // threshold for long tab sessions
  rapidSwitchingThreshold: number; // threshold for rapid tab switching
  lateNightThreshold: number; // hour threshold for late night browsing (24h format)
  doomscrollingWeight?: number; // optional weight for severity calculation
  shoppingWeight?: number; // optional weight for severity calculation
  realTimeAnalysis: boolean; // enable real-time analysis
}

export interface AnalysisContext {
  currentTime: number;
  activeTabs: number[];
  recentInsights: PatternInsight[];
  userBehaviorHistory: Record<string, unknown>;
}

export class PatternAnalyzer {
  private timeTracker: TimeTracker;
  private doomScrolling: DoomScrolling;
  private shoppingDetector: ShoppingDetector;
  private insights: PatternInsight[] = [];
  private config: PatternAnalyzerConfig;
  private analysisInterval?: NodeJS.Timeout;
  private tabSwitchHistory: Map<number, number[]> = new Map(); // tabId -> timestamps
  private behaviorHistory: Record<string, unknown> = {};
  private eventListeners: ((insight: PatternInsight) => void)[] = [];

  constructor(
    timeTracker: TimeTracker,
    doomScrolling: DoomScrolling,
    shoppingDetector: ShoppingDetector,
    config?: Partial<PatternAnalyzerConfig>
  ) {
    this.timeTracker = timeTracker;
    this.doomScrolling = doomScrolling;
    this.shoppingDetector = shoppingDetector;

    this.config = {
      analysisIntervalMinutes: 15,
      longSessionThresholdMinutes: 30,
      rapidSwitchingThreshold: 5, // 5 switches in 2 minutes
      lateNightThreshold: 23, // 11 PM
      doomscrollingWeight: 0.7,
      shoppingWeight: 0.5,
      realTimeAnalysis: true,
      ...config,
    };

    // Set up real-time event listeners
    this.setupRealTimeListeners();
  }

  /**
   * Runs aggregated behavior analysis and generates insights.
   */
  analyze(): PatternInsight[] {
    const now = Date.now();
    const newInsights: PatternInsight[] = [];

    // Check long browsing sessions
    const longTabs = this.timeTracker.checkLongSessions();
    if (longTabs.length > 3) {
      newInsights.push({
        type: "multiTabOveruse",
        description: `User has ${longTabs.length} long active tab sessions, possible focus fragmentation.`,
        severity: "medium",
        timestamp: now,
        confidence: Math.min(longTabs.length / 5, 1),
        metadata: { tabCount: longTabs.length, tabIds: longTabs },
      });
    }

    // Check doomscrolling behavior
    longTabs.forEach((tabId) => {
      if (this.doomScrolling.isDoomScrolling(tabId)) {
        const severity = this.doomScrolling.getDoomScrollingSeverity(tabId);
        if (severity) {
          newInsights.push({
            type: "doomscrollingHabit",
            description: `Extended scrolling detected in tab ${tabId}.`,
            severity: severity,
            timestamp: now,
            confidence: 0.8,
            metadata: { tabId, severity },
          });
        }
      }
    });

    // Check impulsive shopping behavior
    this.shoppingDetector.getMonitoredDomains().forEach((domain) => {
      if (this.shoppingDetector.isImpulsive(domain)) {
        newInsights.push({
          type: "shoppingImpulse",
          description: `Impulsive shopping detected on ${domain}.`,
          severity: "medium",
          timestamp: now,
          confidence: 0.7,
          metadata: { domain },
        });
      }
    });

    // Check for rapid tab switching
    const rapidSwitchingTabs = this.detectRapidTabSwitching();
    if (rapidSwitchingTabs.length > 0) {
      newInsights.push({
        type: "rapidTabSwitching",
        description: `Rapid tab switching detected in ${rapidSwitchingTabs.length} tabs.`,
        severity: "medium",
        timestamp: now,
        confidence: 0.6,
        metadata: { tabIds: rapidSwitchingTabs },
      });
    }

    // Check for late night browsing
    const currentHour = new Date().getHours();
    if (currentHour >= this.config.lateNightThreshold || currentHour < 6) {
      newInsights.push({
        type: "lateNightBrowsing",
        description: `Late night browsing detected at ${currentHour}:00.`,
        severity: "low",
        timestamp: now,
        confidence: 0.9,
        metadata: { hour: currentHour },
      });
    }

    // Detect combined focus loss
    const shoppingTabsCount = this.shoppingDetector
      .getMonitoredDomains()
      .filter((d) => this.shoppingDetector.isImpulsive(d)).length;
    if (longTabs.length > 2 && shoppingTabsCount > 1) {
      newInsights.push({
        type: "focusLoss",
        description:
          "Signs of focus loss detected due to multiple long tabs and shopping impulses.",
        severity: "high",
        timestamp: now,
        confidence: 0.8,
        metadata: {
          longTabs: longTabs.length,
          shoppingTabs: shoppingTabsCount,
        },
      });
    }

    // Detect productivity loss patterns
    const productivityScore = this.calculateProductivityScore();
    if (productivityScore < 0.3) {
      newInsights.push({
        type: "productivityLoss",
        description: `Low productivity score detected: ${productivityScore.toFixed(2)}`,
        severity: "high",
        timestamp: now,
        confidence: 0.7,
        metadata: { productivityScore },
      });
    }

    this.insights.push(...newInsights);
    this.updateBehaviorHistory(newInsights);
    
    // Notify listeners
    newInsights.forEach(insight => {
      this.eventListeners.forEach(listener => listener(insight));
    });
    
    return newInsights;
  }

  /**
   * Get recent insights with optional limit.
   */
  getRecentInsights(limit: number = 10): PatternInsight[] {
    return this.insights.slice(-limit);
  }

  /**
   * Clears all stored insights.
   */
  resetInsights() {
    this.insights = [];
  }

  /**
   * Start real-time analysis
   */
  startRealTimeAnalysis() {
    if (this.analysisInterval || !this.config.realTimeAnalysis) return;

    this.analysisInterval = setInterval(
      () => {
        this.analyze();
      },
      this.config.analysisIntervalMinutes * 60 * 1000
    );
  }

  /**
   * Stop real-time analysis
   */
  stopRealTimeAnalysis() {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = undefined;
    }
  }

  /**
   * Record tab switch for rapid switching detection
   */
  recordTabSwitch(tabId: number) {
    const now = Date.now();
    const timestamps = this.tabSwitchHistory.get(tabId) || [];

    // Keep only recent timestamps (last 2 minutes)
    const recentTimestamps = timestamps.filter(
      (ts) => now - ts < 2 * 60 * 1000
    );
    recentTimestamps.push(now);

    this.tabSwitchHistory.set(tabId, recentTimestamps);
  }

  /**
   * Get analysis context for external use
   */
  getAnalysisContext(): AnalysisContext {
    return {
      currentTime: Date.now(),
      activeTabs: Array.from(this.tabSwitchHistory.keys()),
      recentInsights: this.getRecentInsights(5),
      userBehaviorHistory: this.behaviorHistory,
    };
  }

  /**
   * Add event listener for pattern insights
   */
  addEventListener(listener: (insight: PatternInsight) => void) {
    this.eventListeners.push(listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(listener: (insight: PatternInsight) => void) {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  /**
   * Setup real-time event listeners
   */
  private setupRealTimeListeners() {
    // Listen to doomscrolling events
    this.doomScrolling.addEventListener((event: DoomScrollingEvent) => {
      this.handleDoomScrollingEvent(event);
    });
  }

  /**
   * Handle doomscrolling events in real-time
   */
  private handleDoomScrollingEvent(event: DoomScrollingEvent) {
    const insight: PatternInsight = {
      type: "doomscrollingHabit",
      description: `Real-time doomscrolling detected: ${event.severity} severity`,
      severity: event.severity,
      timestamp: event.timestamp,
      confidence: 0.9,
      metadata: {
        tabId: event.tabId,
        url: event.url,
        scrollAmount: event.scrollAmount,
        realTime: true,
      },
    };

    this.insights.push(insight);
    this.updateBehaviorHistory([insight]);
    
    // Notify listeners
    this.eventListeners.forEach(listener => listener(insight));
  }

  /**
   * Detect rapid tab switching patterns
   */
  private detectRapidTabSwitching(): number[] {
    const rapidTabs: number[] = [];
    const now = Date.now();

    for (const [tabId, timestamps] of this.tabSwitchHistory.entries()) {
      const recentSwitches = timestamps.filter(
        (ts) => now - ts < 2 * 60 * 1000
      );
      if (recentSwitches.length >= this.config.rapidSwitchingThreshold) {
        rapidTabs.push(tabId);
      }
    }

    return rapidTabs;
  }

  /**
   * Calculate productivity score based on behavior patterns
   */
  private calculateProductivityScore(): number {
    let score = 1.0;

    // Reduce score for doomscrolling
    const doomscrollingInsights = this.insights.filter(
      (i) => i.type === "doomscrollingHabit"
    );
    score -= doomscrollingInsights.length * 0.1;

    // Reduce score for shopping impulses
    const shoppingInsights = this.insights.filter(
      (i) => i.type === "shoppingImpulse"
    );
    score -= shoppingInsights.length * 0.05;

    // Reduce score for rapid tab switching
    const switchingInsights = this.insights.filter(
      (i) => i.type === "rapidTabSwitching"
    );
    score -= switchingInsights.length * 0.08;

    // Reduce score for late night browsing
    const lateNightInsights = this.insights.filter(
      (i) => i.type === "lateNightBrowsing"
    );
    score -= lateNightInsights.length * 0.03;

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Update behavior history with new insights
   */
  private updateBehaviorHistory(insights: PatternInsight[]) {
    const now = Date.now();
    const today = new Date().toDateString();

    if (!this.behaviorHistory[today]) {
      this.behaviorHistory[today] = {
        insights: [],
        patterns: {},
        productivityScore: 1.0,
      };
    }

    const todayData = this.behaviorHistory[today] as {
      insights: PatternInsight[];
      patterns: Record<string, number>;
      productivityScore: number;
    };

    todayData.insights.push(...insights);

    // Update pattern counts
    insights.forEach((insight) => {
      if (!todayData.patterns[insight.type]) {
        todayData.patterns[insight.type] = 0;
      }
      todayData.patterns[insight.type]++;
    });

    // Update productivity score
    todayData.productivityScore = this.calculateProductivityScore();
    this.behaviorHistory[today] = todayData;

    // Clean up old history (keep last 30 days)
    const thirtyDaysAgo = new Date(
      now - 30 * 24 * 60 * 60 * 1000
    ).toDateString();
    Object.keys(this.behaviorHistory).forEach((date) => {
      if (date < thirtyDaysAgo) {
        delete this.behaviorHistory[date];
      }
    });
  }
}
