// src/background/behaviors/metrics-collector.ts

import type { InterventionScheduler } from "./intervention-scheduler";

// Defines the structure for our stored metrics
interface SiteMetrics {
  totalVisits: number;
  lastVisit: number; // timestamp
}

type AllMetrics = {
  [hostname: string]: SiteMetrics;
};

/**
 * Collects and aggregates metrics based on user behavior.
 */
export class MetricsCollector {
  private scheduler: InterventionScheduler;

  constructor(scheduler: InterventionScheduler) {
    this.scheduler = scheduler;
    console.log("Metrics collector initialized.");
  }

  /**
   * Processes a tab update event to log metrics.
   * @param tab - The tab object from the browser event.
   */
  public async handleTabUpdate(tab: chrome.tabs.Tab): Promise<void> {
    if (!tab.url) return;

    try {
      const url = new URL(tab.url);
      const hostname = url.hostname;

      // Ignore internal chrome pages or invalid URLs
      if (!hostname || !url.protocol.startsWith("http")) return;

      const newMetric: SiteMetrics = {
        totalVisits: 1,
        lastVisit: Date.now(),
      };

      // Get existing data from storage
      const data = await chrome.storage.local.get("siteMetrics");
      const allMetrics: AllMetrics = data.siteMetrics || {};

      // Update the metrics for the current site
      if (allMetrics[hostname]) {
        allMetrics[hostname].totalVisits += 1;
        allMetrics[hostname].lastVisit = Date.now();
      } else {
        allMetrics[hostname] = newMetric;
      }

      // Save the updated metrics back to storage
      await chrome.storage.local.set({ siteMetrics: allMetrics });
      console.log(`Metrics updated for ${hostname}:`, allMetrics[hostname]);

      // Example: Check if an intervention is needed
      if (allMetrics[hostname].totalVisits > 5) {
        console.log(`Scheduling an intervention for ${hostname}.`);
        this.scheduler.scheduleIntervention("limitExceeded", 5000); // In 5 seconds
      }
    } catch (error) {
      console.error("Failed to process tab update:", error);
    }
  }
}
