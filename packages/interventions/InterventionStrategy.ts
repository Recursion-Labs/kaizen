// InterventionStrategy.ts
// Decides when and what nudge to trigger based on behavioral signals from detectors.

import { NudgeGenerator } from "./NudgeGenerator";
import type { Nudge } from "./NudgeGenerator";
import type { DoomScrolling } from "../detectors/Doomscrolling";
import type { ShoppingDetector } from "../detectors/ShoppingDetector";
import type { TimeTracker } from "../detectors/TimeTracker";

export interface InterventionDecision {
  trigger: boolean;
  context: {
    behaviorType: "doomscrolling" | "shopping" | "overtime" | "general";
    intensity: "low" | "moderate" | "high";
    domain?: string;
    duration?: number;
  };
}

export class InterventionStrategy {
  private doomscrolling: DoomScrolling;
  private shopping: ShoppingDetector;
  private timetracker: TimeTracker;
  private nudgeGenerator: NudgeGenerator;

  constructor(
    doomscrolling: DoomScrolling,
    shopping: ShoppingDetector,
    timetracker: TimeTracker,
  ) {
    this.doomscrolling = doomscrolling;
    this.shopping = shopping;
    this.timetracker = timetracker;
    this.nudgeGenerator = new NudgeGenerator();
  }

  /**
   * Evaluate behavioral state across detectors.
   * Returns an InterventionDecision or null if no intervention is needed.
   */
  evaluate(tabId: number, url: string): InterventionDecision | null {
    // Doomscrolling check
    if (this.doomscrolling.isDoomScrolling(tabId)) {
      return {
        trigger: true,
        context: {
          behaviorType: "doomscrolling",
          intensity: "high",
          domain: new URL(url).hostname,
        },
      };
    }

    // Shopping impulse check
    const domain = this.extractDomain(url);
    if (this.shopping.isImpulsive(domain)) {
      return {
        trigger: true,
        context: {
          behaviorType: "shopping",
          intensity: "moderate",
          domain,
        },
      };
    }

    // Time overuse check
    const longTabs = this.timetracker.checkLongSessions();
    if (longTabs.includes(tabId)) {
      return {
        trigger: true,
        context: {
          behaviorType: "overtime",
          intensity: "high",
          duration: this.getSessionDuration(tabId),
          domain: domain,
        },
      };
    }

    return null;
  }

  /**
   * Generate a nudge if intervention is triggered
   */
  async decideAndGenerate(tabId: number, url: string): Promise<Nudge | null> {
    const decision = this.evaluate(tabId, url);
    if (!decision || !decision.trigger) return null;

    return await this.nudgeGenerator.generateNudge(decision.context);
  }

  /**
   * Helper: extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "";
    }
  }

  /**
   * (Optional) Helper to get session duration in ms from TimeTracker
   */
  private getSessionDuration(tabId: number): number | undefined {
    const session = (
      this.timetracker as unknown as {
        sessions?: Map<number, { startTime: number; accumulatedTime?: number }>;
      }
    ).sessions?.get(tabId);
    if (!session) return undefined;
    return Date.now() - session.startTime + (session.accumulatedTime || 0);
  }
}
