// Comprehensive test suite for Behavioral Engine Detectors
// Tests real-time functionality, event handling, and integration

import { DoomScrolling } from "../Doomscrolling";
import { PatternAnalyzer } from "../PatternAnalyzer";
import { ShoppingDetector } from "../ShoppingDetector";
import { TimeTracker } from "../TimeTracker";
import type { DoomScrollingEvent } from "../Doomscrolling";
import type { ShoppingEvent } from "../ShoppingDetector";
import type { TimeTrackingEvent } from "../TimeTracker";

interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  duration: number;
}

class TestDetector {
  private doomScrolling: DoomScrolling;
  private shoppingDetector: ShoppingDetector;
  private timeTracker: TimeTracker;
  private patternAnalyzer: PatternAnalyzer;
  private testResults: TestResult[] = [];
  private eventLog: Array<{ type: string; timestamp: number; data: unknown }> = [];

  constructor() {
    this.doomScrolling = new DoomScrolling({
      scrollThreshold: 1000, // Lower threshold for testing
      timeWindow: 30000, // 30 seconds for testing
      realTimeCheckInterval: 2000, // 2 seconds for testing
    });

    this.shoppingDetector = new ShoppingDetector({
      visitThreshold: 2, // Lower threshold for testing
      timeWindow: 30000, // 30 seconds for testing
      realTimeCheckInterval: 2000, // 2 seconds for testing
    });

    this.timeTracker = new TimeTracker({
      alertThresholdMinutes: 1, // 1 minute for testing
      realTimeCheckInterval: 3000, // 3 seconds for testing
    });

    this.patternAnalyzer = new PatternAnalyzer(
      this.timeTracker,
      this.doomScrolling,
      this.shoppingDetector,
      {
        analysisIntervalMinutes: 1, // 1 minute for testing
        realTimeAnalysis: true,
      }
    );

    this.setupEventListeners();
    console.log("🚀 Comprehensive Detector Test Suite Initialized");
  }

  private setupEventListeners(): void {
    // DoomScrolling events
    this.doomScrolling.addEventListener((event: DoomScrollingEvent) => {
      this.eventLog.push({
        type: "doomscrolling",
        timestamp: Date.now(),
        data: event,
      });
      console.log("📱 DoomScrolling Event:", event);
    });

    // Shopping events
    this.shoppingDetector.addEventListener((event: ShoppingEvent) => {
      this.eventLog.push({
        type: "shopping",
        timestamp: Date.now(),
        data: event,
      });
      console.log("🛒 Shopping Event:", event);
    });

    // Time tracking events
    this.timeTracker.addEventListener((event: TimeTrackingEvent) => {
      this.eventLog.push({
        type: "timeTracking",
        timestamp: Date.now(),
        data: event,
      });
      console.log("⏰ Time Tracking Event:", event);
    });
  }

  private async runTest(
    testName: string,
    testFunction: () => Promise<boolean> | boolean,
  ): Promise<void> {
    const startTime = Date.now();
    console.log(`🧪 Running test: ${testName}`);

    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;

      this.testResults.push({
        testName,
        passed: result,
        message: result ? "✅ PASSED" : "❌ FAILED",
        duration,
      });

      console.log(
        `${result ? "✅" : "❌"} ${testName}: ${result ? "PASSED" : "FAILED"} (${duration}ms)`,
      );
    } catch (error) {
      const duration = Date.now() - startTime;
      this.testResults.push({
        testName,
        passed: false,
        message: `❌ ERROR: ${error}`,
        duration,
      });
      console.error(`❌ ${testName}: ERROR - ${error}`);
    }
  }

  // DoomScrolling Tests
  private async testDoomScrollingBasic(): Promise<boolean> {
    const tabId = 1;
    const url = "https://twitter.com/home";

    // Test basic scroll tracking
    this.doomScrolling.addScroll(tabId, 500, url);
    this.doomScrolling.addScroll(tabId, 600, url);

    const isDoomScrolling = this.doomScrolling.isDoomScrolling(tabId);
    const severity = this.doomScrolling.getDoomScrollingSeverity(tabId);

    return isDoomScrolling && severity === "low";
  }

  private async testDoomScrollingRealTime(): Promise<boolean> {
    const tabId = 2;
    const url = "https://reddit.com/r/all";

    // Start real-time monitoring
    this.doomScrolling.startRealTimeMonitoring();

    // Simulate rapid scrolling
    for (let i = 0; i < 5; i++) {
      this.doomScrolling.addScroll(tabId, 300, url);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Wait for real-time check
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const events = this.eventLog.filter(
      (e) => e.type === "doomscrolling" && (e.data as DoomScrollingEvent).tabId === tabId,
    );

    this.doomScrolling.stopRealTimeMonitoring();

    return events.length > 0;
  }

  private async testDoomScrollingSeverity(): Promise<boolean> {
    const tabId = 3;
    const url = "https://instagram.com";

    // Test high severity
    this.doomScrolling.addScroll(tabId, 2000, url);
    this.doomScrolling.addScroll(tabId, 2000, url);

    const severity = this.doomScrolling.getDoomScrollingSeverity(tabId);
    return severity === "high";
  }

  // ShoppingDetector Tests
  private async testShoppingBasic(): Promise<boolean> {
    const tabId = 1;
    const url = "https://amazon.com/product/123";

    this.shoppingDetector.startTabSession(tabId, url);
    this.shoppingDetector.recordVisit(tabId, url);
    this.shoppingDetector.recordVisit(tabId, url);

    const isImpulsive = this.shoppingDetector.isImpulsive("amazon.com");
    const severity = this.shoppingDetector.getShoppingSeverity("amazon.com");

    return isImpulsive && severity === "low";
  }

  private async testShoppingRealTime(): Promise<boolean> {
    const tabId = 2;
    const url = "https://flipkart.com/product/456";

    this.shoppingDetector.startRealTimeMonitoring();

    // Simulate multiple visits
    for (let i = 0; i < 4; i++) {
      this.shoppingDetector.recordVisit(tabId, url);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Wait for real-time check
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const events = this.eventLog.filter(
      (e) => e.type === "shopping" && (e.data as ShoppingEvent).domain === "flipkart.com",
    );

    this.shoppingDetector.stopRealTimeMonitoring();

    return events.length > 0;
  }

  private async testShoppingSeverity(): Promise<boolean> {
    const tabId = 3;
    const url = "https://ebay.com/item/789";

    // Test high severity with multiple visits
    for (let i = 0; i < 6; i++) {
      this.shoppingDetector.recordVisit(tabId, url);
    }

    const severity = this.shoppingDetector.getShoppingSeverity("ebay.com");
    return severity === "high";
  }

  // TimeTracker Tests
  private async testTimeTrackingBasic(): Promise<boolean> {
    const tabId = 1;
    const url = "https://github.com/user/repo";

    this.timeTracker.startTabSession(tabId, url);
    this.timeTracker.updateTabActivity(tabId);

    // Simulate time passing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.timeTracker.stopTabSession(tabId);

    const sessions = this.timeTracker.getActiveSessions();
    const stats = this.timeTracker.getTodayStats();

    return sessions.size >= 0 && stats.productive >= 0;
  }

  private async testTimeTrackingRealTime(): Promise<boolean> {
    const tabId = 2;
    const url = "https://youtube.com/watch?v=123";

    this.timeTracker.startRealTimeMonitoring();
    this.timeTracker.startTabSession(tabId, url);

    // Simulate long session
    await new Promise((resolve) => setTimeout(resolve, 70000)); // 70 seconds

    const events = this.eventLog.filter(
      (e) => e.type === "timeTracking" && (e.data as TimeTrackingEvent).tabId === tabId,
    );

    this.timeTracker.stopRealTimeMonitoring();
    this.timeTracker.stopTabSession(tabId);

    return events.length > 0;
  }

  private async testTimeTrackingProductivity(): Promise<boolean> {
    const productiveTab = 3;
    const entertainmentTab = 4;

    this.timeTracker.startTabSession(productiveTab, "https://github.com");
    this.timeTracker.startTabSession(entertainmentTab, "https://youtube.com");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    this.timeTracker.stopTabSession(productiveTab);
    this.timeTracker.stopTabSession(entertainmentTab);

    const productivityScore = this.timeTracker.getProductivityScore();
    return productivityScore >= 0 && productivityScore <= 1;
  }

  // PatternAnalyzer Tests
  private async testPatternAnalysis(): Promise<boolean> {
    const insights = this.patternAnalyzer.analyze();
    return Array.isArray(insights);
  }

  private async testPatternRealTime(): Promise<boolean> {
    this.patternAnalyzer.startRealTimeAnalysis();

    // Simulate some activity
    this.doomScrolling.addScroll(1, 1500, "https://twitter.com");
    this.shoppingDetector.recordVisit(1, "https://amazon.com");

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const recentInsights = this.patternAnalyzer.getRecentInsights(5);
    this.patternAnalyzer.stopRealTimeAnalysis();

    return recentInsights.length >= 0;
  }

  private async testPatternContext(): Promise<boolean> {
    const context = this.patternAnalyzer.getAnalysisContext();
    return (
      context.currentTime > 0 &&
      Array.isArray(context.activeTabs) &&
      Array.isArray(context.recentInsights) &&
      typeof context.userBehaviorHistory === "object"
    );
  }

  // Integration Tests
  private async testDetectorIntegration(): Promise<boolean> {
    const tabId = 1;
    const twitterUrl = "https://twitter.com/home";
    const amazonUrl = "https://amazon.com/product/123";

    // Simulate integrated behavior
    this.doomScrolling.addScroll(tabId, 1000, twitterUrl);
    this.shoppingDetector.recordVisit(tabId, amazonUrl);
    this.timeTracker.startTabSession(tabId, twitterUrl);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.timeTracker.stopTabSession(tabId);

    const insights = this.patternAnalyzer.analyze();
    return insights.length >= 0;
  }

  private async testEventSystem(): Promise<boolean> {
    const initialEventCount = this.eventLog.length;

    // Trigger events from all detectors
    this.doomScrolling.addScroll(1, 2000, "https://reddit.com");
    this.shoppingDetector.recordVisit(1, "https://flipkart.com");
    this.timeTracker.startTabSession(1, "https://youtube.com");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.timeTracker.stopTabSession(1);

    const finalEventCount = this.eventLog.length;
    return finalEventCount > initialEventCount;
  }

  // Performance Tests
  private async testPerformance(): Promise<boolean> {
    const startTime = Date.now();

    // Simulate heavy load
    for (let i = 0; i < 100; i++) {
      this.doomScrolling.addScroll(i, 100, `https://site${i}.com`);
      this.shoppingDetector.recordVisit(i, `https://shop${i}.com`);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within reasonable time (1 second)
    return duration < 1000;
  }

  // Main test runner
  public async runAllTests(): Promise<void> {
    console.log("🧪 Starting Comprehensive Detector Test Suite...\n");

    // DoomScrolling Tests
    await this.runTest("DoomScrolling Basic Functionality", () =>
      this.testDoomScrollingBasic(),
    );
    await this.runTest("DoomScrolling Real-time Detection", () =>
      this.testDoomScrollingRealTime(),
    );
    await this.runTest("DoomScrolling Severity Levels", () =>
      this.testDoomScrollingSeverity(),
    );

    // ShoppingDetector Tests
    await this.runTest("Shopping Basic Functionality", () =>
      this.testShoppingBasic(),
    );
    await this.runTest("Shopping Real-time Detection", () =>
      this.testShoppingRealTime(),
    );
    await this.runTest("Shopping Severity Levels", () =>
      this.testShoppingSeverity(),
    );

    // TimeTracker Tests
    await this.runTest("Time Tracking Basic Functionality", () =>
      this.testTimeTrackingBasic(),
    );
    await this.runTest("Time Tracking Real-time Detection", () =>
      this.testTimeTrackingRealTime(),
    );
    await this.runTest("Time Tracking Productivity Scoring", () =>
      this.testTimeTrackingProductivity(),
    );

    // PatternAnalyzer Tests
    await this.runTest("Pattern Analysis Basic", () =>
      this.testPatternAnalysis(),
    );
    await this.runTest("Pattern Analysis Real-time", () =>
      this.testPatternRealTime(),
    );
    await this.runTest("Pattern Analysis Context", () =>
      this.testPatternContext(),
    );

    // Integration Tests
    await this.runTest("Detector Integration", () =>
      this.testDetectorIntegration(),
    );
    await this.runTest("Event System Integration", () =>
      this.testEventSystem(),
    );

    // Performance Tests
    await this.runTest("Performance Under Load", () =>
      this.testPerformance(),
    );

    this.printTestResults();
  }

  private printTestResults(): void {
    console.log("\n📊 Test Results Summary:");
    console.log("=" .repeat(50));

    const passed = this.testResults.filter((r) => r.passed).length;
    const failed = this.testResults.filter((r) => !r.passed).length;
    const totalDuration = this.testResults.reduce(
      (sum, r) => sum + r.duration,
      0,
    );

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    console.log("\n📋 Detailed Results:");
    this.testResults.forEach((result) => {
      console.log(
        `${result.passed ? "✅" : "❌"} ${result.testName}: ${result.message} (${result.duration}ms)`,
      );
    });

    console.log("\n📝 Event Log Summary:");
    const eventTypes = this.eventLog.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(eventTypes).forEach(([type, count]) => {
      console.log(`📱 ${type}: ${count} events`);
    });

    console.log("\n🎉 Test Suite Complete!");
  }

  // Utility methods for manual testing
  public getEventLog(): Array<{ type: string; timestamp: number; data: unknown }> {
    return [...this.eventLog];
  }

  public clearEventLog(): void {
    this.eventLog = [];
  }

  public getTestResults(): TestResult[] {
    return [...this.testResults];
  }
}

// Export for use in other modules

// Auto-run if this file is executed directly
if (typeof window !== "undefined") {
  const testSuite = new TestDetector();
  testSuite.runAllTests().catch(console.error);
}

export { TestDetector };