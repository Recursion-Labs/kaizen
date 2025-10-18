// RAG based Pattern Analyzer for detecting specific user behaviors based on browsing data.

import { TimeTracker } from "./TimeTracker";
import { DoomScrolling } from "./Doomscrolling";
import { ShoppingDetector } from "./ShoppingDetector";

export type InsightSeverity = "low" | "medium" | "high";

export interface PatternInsight {
  type: "focusLoss" | "doomscrollingHabit" | "shoppingImpulse" | "multiTabOveruse";
  description: string;
  severity: InsightSeverity;
  timestamp: number;
}

export interface PatternAnalyzerConfig {
  analysisIntervalMinutes: number; // how often to analyze
  longSessionThresholdMinutes: number; // threshold for long tab sessions
  doomscrollingWeight?: number; // optional weight for severity calculation
  shoppingWeight?: number; // optional weight for severity calculation
}

export class PatternAnalyzer {
  private timeTracker: TimeTracker;
  private doomScrolling: DoomScrolling;
  private shoppingDetector: ShoppingDetector;
  private insights: PatternInsight[] = [];
  private config: PatternAnalyzerConfig;

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
      doomscrollingWeight: 0.7,
      shoppingWeight: 0.5,
      ...config,
    };
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
      });
    }

    // Check doomscrolling behavior
    longTabs.forEach(tabId => {
      if (this.doomScrolling.isDoomScrolling(tabId)) {
        newInsights.push({
          type: "doomscrollingHabit",
          description: `Extended scrolling detected in tab ${tabId}.`,
          severity: "high",
          timestamp: now,
        });
      }
    });

    // Check impulsive shopping behavior
    this.shoppingDetector.getMonitoredDomains().forEach(domain => {
      if (this.shoppingDetector.isImpulsive(domain)) {
        newInsights.push({
          type: "shoppingImpulse",
          description: `Impulsive shopping detected on ${domain}.`,
          severity: "medium",
          timestamp: now,
        });
      }
    });

    // Detect combined focus loss
    const shoppingTabsCount = this.shoppingDetector.getMonitoredDomains().filter(d => this.shoppingDetector.isImpulsive(d)).length;
    if (longTabs.length > 2 && shoppingTabsCount > 1) {
      newInsights.push({
        type: "focusLoss",
        description: "Signs of focus loss detected due to multiple long tabs and shopping impulses.",
        severity: "high",
        timestamp: now,
      });
    }

    this.insights.push(...newInsights);
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
}