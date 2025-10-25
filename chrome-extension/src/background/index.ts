import {
  interventionScheduler,
  metricsCollector,
  behaviorMonitor,
} from "./behaviour";
import { IntegrationManager } from "./behaviour/integration-manager";

// Simple rate limiter: max 3 notifications per hour
const notificationHistory: number[] = [];
const notifyIfAllowed = (options: chrome.notifications.NotificationOptions & { type: "basic" | "image" | "list" | "progress" }) => {
  const now = Date.now();
  // prune > 1h
  while (notificationHistory.length && now - notificationHistory[0] > 60 * 60 * 1000) {
    notificationHistory.shift();
  }
  if (notificationHistory.length >= 3) {
    console.warn('[Kaizen] Notification suppressed due to rate limit');
    return;
  }
  notificationHistory.push(now);
  // @ts-expect-error - TS lib types differ across environments
  chrome.notifications.create(options);
};

const handleIntervention = (alarm: chrome.alarms.Alarm) => {
  console.log("Executing intervention logic for:", alarm.name);
  
  // Handle different intervention types
  if (alarm.name === "limitExceeded") {
    notifyIfAllowed({
      type: "basic",
      iconUrl: "icon128.png",
      title: "Usage Limit Reached",
      message: "You have visited this site frequently. Time for a break?",
    });
  } else if (alarm.name === "timeLimitExceeded") {
    notifyIfAllowed({
      type: "basic",
      iconUrl: "icon128.png",
      title: "Time Limit Exceeded",
      message: "You've been browsing for a while. Consider taking a break!",
    });
  } else if (alarm.name === "shoppingImpulse") {
    notifyIfAllowed({
      type: "basic",
      iconUrl: "icon128.png",
      title: "Shopping Reminder",
      message: "Multiple visits to shopping sites detected. Take a moment to think.",
    });
  } else if (alarm.name === "doomscrolling") {
    notifyIfAllowed({
      type: "basic",
      iconUrl: "icon128.png",
      title: "Mindful Scrolling",
      message: "You've been scrolling for a while. Consider a mindful break.",
    });
  } else if (alarm.name.startsWith("pattern-")) {
    notifyIfAllowed({
      type: "basic",
      iconUrl: "icon128.png",
      title: "Behavior Pattern Detected",
      message: "A behavior pattern has been detected. Check your dashboard for insights.",
    });
  }
};

// Initialize scheduler
const scheduler = new interventionScheduler.InterventionScheduler(
  handleIntervention,
);

// Initialize legacy metrics collector
const metrics = new metricsCollector.MetricsCollector(scheduler);

// Initialize integration manager (brings together detectors and knowledge)
const integrationManager = new IntegrationManager(scheduler);

// Initialize behavior monitor with integration manager handlers
const monitor = new behaviorMonitor.BehaviorMonitor(
  (tabId: number) => {
    console.log(`Tab ${tabId} activated`);
    integrationManager.handleTabActivated(tabId);
  },
  async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    console.log(`Tab ${tabId} updated: ${tab.url}`);
    
    // Handle through legacy metrics collector
    await metrics.handleTabUpdate(tab);
    
    // Handle through integration manager
    await integrationManager.handleTabUpdate(tab);
  },
  (tabId: number) => {
    console.log(`Tab ${tabId} removed`);
    integrationManager.handleTabRemoved(tabId);
  }
);

console.log("Background service worker started and modules initialized.");
console.log("Integration manager:", {
  detectors: ["TimeTracker", "ShoppingDetector", "DoomScrolling", "PatternAnalyzer"],
  knowledge: ["KnowledgeGraph", "EmbeddingService", "RAGEngine"],
});

// Handle scroll events and page loads from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle scroll events
  if (message.type === 'SCROLL_EVENT' && sender.tab?.id) {
    console.log(`[Kaizen] Scroll event received: ${message.scrollAmount}px on tab ${sender.tab.id}`);
    integrationManager.handleScroll(sender.tab.id, message.scrollAmount, message.url);
    sendResponse({ success: true });
  }
  
  // Handle page load events
  if (message.type === 'PAGE_LOAD' && sender.tab?.id && sender.tab.url) {
    console.log(`[Kaizen] Page load event: ${sender.tab.url}`);
    integrationManager.handleTabUpdate(sender.tab);
    sendResponse({ success: true });
  }

  // Handle RAG context requests from UI
  if (message.type === 'GET_RAG_CONTEXT') {
    console.log('RAG context requested from UI');
    try {
      const context = integrationManager.generateContextForNudge();
      sendResponse({ success: true, context });
    } catch (error) {
      console.error('Failed to generate RAG context:', error);
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Handle productivity stats requests
  if (message.type === 'GET_PRODUCTIVITY_STATS') {
    console.log('Productivity stats requested from UI');
    try {
      const stats = {
        productivityScore: integrationManager.getProductivityScore(),
        todayStats: integrationManager.getTodayStats(),
        knowledgeGraphStats: integrationManager.getKnowledgeGraphStats(),
        activeSessions: integrationManager.getActiveSessions(),
      };
      sendResponse({ success: true, stats });
    } catch (error) {
      console.error('Failed to get productivity stats:', error);
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  return true; // Keep the message channel open for async response
});

export default {
  scheduler,
  metrics,
  monitor,
  integrationManager,
};
