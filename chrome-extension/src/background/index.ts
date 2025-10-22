import {
  interventionScheduler,
  metricsCollector,
  behaviorMonitor,
} from "./behaviour";

const handleIntervention = (alarm: chrome.alarms.Alarm) => {
  console.log("Executing intervention logic for:", alarm.name);
  if (alarm.name === "limitExceeded") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon128.png",
      title: "Usage Limit Reached",
      message: "You have visited this site frequently. Time for a break?",
    });
  }
};
const scheduler = new interventionScheduler.InterventionScheduler(
  handleIntervention,
);
const metrics = new metricsCollector.MetricsCollector(scheduler);
const monitor = new behaviorMonitor.BehaviorMonitor(
  () => {
    /* Handle tab activation if needed */
  },
  (tabId: unknown, changeInfo: unknown, tab: chrome.tabs.Tab) =>
    metrics.handleTabUpdate(tab),
);

console.log("Background service worker started and modules initialized.");

export default {
  scheduler,
  metrics,
  monitor,
};
