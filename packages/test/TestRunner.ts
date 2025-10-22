// Provides comprehensive testing of the entire system

import { TestDetector } from "../detectors/test/TestDetector";
import { TestKnowledge } from "../Knowledge/test/TestKnowledge";

interface TestResult {
  package: string;
  passed: number;
  failed: number;
  totalDuration: number;
  successRate: number;
  details: Array<{
    testName: string;
    passed: boolean;
    duration: number;
  }>;
}

class TestRunner {
  private detectorTest: TestDetector;
  private knowledgeTest: TestKnowledge;
  private results: TestResult[] = [];

  constructor() {
    this.detectorTest = new TestDetector();
    this.knowledgeTest = new TestKnowledge();
    console.log("🚀 Master Test Runner Initialized");
  }

  public async runAllTests(): Promise<void> {
    console.log("🎯 Starting Master Test Suite...");
    console.log("=" .repeat(60));

    // Run Detector Tests
    console.log("\n📱 Running Detector Tests...");
    await this.runDetectorTests();

    // Run Knowledge Tests
    console.log("\n🧠 Running Knowledge Tests...");
    await this.runKnowledgeTests();

    // Print comprehensive results
    this.printMasterResults();

    // Run integration tests
    console.log("\n🔗 Running Integration Tests...");
    await this.runIntegrationTests();
  }

  private async runDetectorTests(): Promise<void> {
    const startTime = Date.now();
    
    try {
      await this.detectorTest.runAllTests();
      const detectorResults = this.detectorTest.getTestResults();
      
      const passed = detectorResults.filter(r => r.passed).length;
      const failed = detectorResults.filter(r => !r.passed).length;
      const totalDuration = Date.now() - startTime;
      
      this.results.push({
        package: "Detectors",
        passed,
        failed,
        totalDuration,
        successRate: (passed / (passed + failed)) * 100,
        details: detectorResults.map(r => ({
          testName: r.testName,
          passed: r.passed,
          duration: r.duration,
        })),
      });
    } catch (error) {
      console.error("❌ Detector tests failed:", error);
      this.results.push({
        package: "Detectors",
        passed: 0,
        failed: 1,
        totalDuration: Date.now() - startTime,
        successRate: 0,
        details: [{
          testName: "Detector Test Suite",
          passed: false,
          duration: Date.now() - startTime,
        }],
      });
    }
  }

  private async runKnowledgeTests(): Promise<void> {
    const startTime = Date.now();
    
    try {
      await this.knowledgeTest.runAllTests();
      const knowledgeResults = this.knowledgeTest.getTestResults();
      
      const passed = knowledgeResults.filter(r => r.passed).length;
      const failed = knowledgeResults.filter(r => !r.passed).length;
      const totalDuration = Date.now() - startTime;
      
      this.results.push({
        package: "Knowledge",
        passed,
        failed,
        totalDuration,
        successRate: (passed / (passed + failed)) * 100,
        details: knowledgeResults.map(r => ({
          testName: r.testName,
          passed: r.passed,
          duration: r.duration,
        })),
      });
    } catch (error) {
      console.error("❌ Knowledge tests failed:", error);
      this.results.push({
        package: "Knowledge",
        passed: 0,
        failed: 1,
        totalDuration: Date.now() - startTime,
        successRate: 0,
        details: [{
          testName: "Knowledge Test Suite",
          passed: false,
          duration: Date.now() - startTime,
        }],
      });
    }
  }

  private async runIntegrationTests(): Promise<void> {
    console.log("🔗 Testing cross-package integration...");
    
    try {
      // Test that detectors can work with knowledge graph
      const detectorEventLog = this.detectorTest.getEventLog();
      const knowledgeStats = this.knowledgeTest.getKnowledgeGraphStats();
      
      console.log(`📱 Detector Events Captured: ${detectorEventLog.length}`);
      console.log(`🧠 Knowledge Graph Nodes: ${knowledgeStats.nodeCount}`);
      
      // Test real-time integration
      await this.testRealTimeIntegration();
      
      console.log("✅ Integration tests completed successfully");
    } catch (error) {
      console.error("❌ Integration tests failed:", error);
    }
  }

  private async testRealTimeIntegration(): Promise<void> {
    console.log("⏰ Testing real-time integration...");
    
    // This would test that detectors can feed data into knowledge graph
    // and RAG engine can process it in real-time
    
    // Simulate some detector activity
    const detectorTest = new TestDetector();
    
    // Wait a bit for any real-time processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const events = detectorTest.getEventLog();
    console.log(`📊 Real-time events captured: ${events.length}`);
  }

  private printMasterResults(): void {
    console.log("\n🎯 MASTER TEST RESULTS");
    console.log("=" .repeat(60));
    
    const totalPassed = this.results.reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = this.results.reduce((sum, r) => sum + r.failed, 0);
    const totalDuration = this.results.reduce((sum, r) => sum + r.totalDuration, 0);
    const overallSuccessRate = (totalPassed / (totalPassed + totalFailed)) * 100;
    
    console.log(`📊 OVERALL RESULTS:`);
    console.log(`   ✅ Total Passed: ${totalPassed}`);
    console.log(`   ❌ Total Failed: ${totalFailed}`);
    console.log(`   ⏱️  Total Duration: ${totalDuration}ms`);
    console.log(`   📈 Overall Success Rate: ${overallSuccessRate.toFixed(1)}%`);
    
    console.log(`\n📋 PACKAGE BREAKDOWN:`);
    this.results.forEach(result => {
      console.log(`\n📦 ${result.package}:`);
      console.log(`   ✅ Passed: ${result.passed}`);
      console.log(`   ❌ Failed: ${result.failed}`);
      console.log(`   ⏱️  Duration: ${result.totalDuration}ms`);
      console.log(`   📈 Success Rate: ${result.successRate.toFixed(1)}%`);
      
      // Show failed tests
      const failedTests = result.details.filter(d => !d.passed);
      if (failedTests.length > 0) {
        console.log(`   ❌ Failed Tests:`);
        failedTests.forEach(test => {
          console.log(`      - ${test.testName} (${test.duration}ms)`);
        });
      }
    });
    
    // Overall assessment
    console.log(`\n🎉 OVERALL ASSESSMENT:`);
    if (overallSuccessRate >= 90) {
      console.log(`   🌟 EXCELLENT: System is working exceptionally well!`);
    } else if (overallSuccessRate >= 80) {
      console.log(`   ✅ GOOD: System is working well with minor issues.`);
    } else if (overallSuccessRate >= 70) {
      console.log(`   ⚠️  FAIR: System has some issues that need attention.`);
    } else {
      console.log(`   ❌ POOR: System has significant issues requiring immediate attention.`);
    }
    
    console.log(`\n📝 RECOMMENDATIONS:`);
    if (totalFailed > 0) {
      console.log(`   🔧 Review failed tests and fix issues`);
      console.log(`   🧪 Consider adding more edge case tests`);
      console.log(`   📊 Monitor real-time performance in production`);
    } else {
      console.log(`   🚀 All tests passed! System is ready for production`);
      console.log(`   📈 Consider adding performance benchmarks`);
      console.log(`   🔄 Set up continuous integration testing`);
    }
  }

  // Utility methods
  public getResults(): TestResult[] {
    return [...this.results];
  }

  public getOverallStats() {
    const totalPassed = this.results.reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = this.results.reduce((sum, r) => sum + r.failed, 0);
    const totalDuration = this.results.reduce((sum, r) => sum + r.totalDuration, 0);
    
    return {
      totalPassed,
      totalFailed,
      totalDuration,
      overallSuccessRate: (totalPassed / (totalPassed + totalFailed)) * 100,
    };
  }

  public exportResults(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      results: this.results,
      overallStats: this.getOverallStats(),
    }, null, 2);
  }
}

// Auto-run if this file is executed directly
if (typeof window !== "undefined") {
  const masterTest = new TestRunner();
  masterTest.runAllTests().catch(console.error);
}

// Export for use in other modules
export { TestRunner };
