import {
  interventionScheduler,
  metricsCollector,
  behaviorMonitor,
} from "./behaviour";
import { IntegrationManager } from "./behaviour/integration-manager";

// Simple rate limiter: max 3 notifications per hour
const notificationHistory: number[] = [];
const notifyIfAllowed = (
  id: string,
  options: chrome.notifications.NotificationOptions & {
    type: "basic" | "image" | "list" | "progress";
  },
) => {
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

  // Ensure iconUrl is resolvable from extension package
  const opts: typeof options = { ...options };
  if (typeof opts.iconUrl === 'string' && !/^chrome-extension:/.test(opts.iconUrl)) {
    opts.iconUrl = chrome.runtime.getURL(opts.iconUrl);
  }
  // @ts-expect-error - TS lib types differ across environments
  chrome.notifications.create(id, opts);
};

const openSidePanelForTab = (tabId: number) => {
  if (!("sidePanel" in chrome) || !chrome.sidePanel) {
    throw new Error("Side panel API unavailable in this browser version");
  }

  chrome.sidePanel
    .setOptions({
      tabId,
      path: "side-panel/index.html",
      enabled: true,
    })
    .catch((error: unknown) => {
      console.error("[Kaizen] Failed to configure side panel options:", error);
    });

  chrome.sidePanel.open({ tabId }).catch((error: unknown) => {
    console.error("[Kaizen] Failed to open side panel:", error);
  });
};

const ENABLE_OS_NOTIFICATIONS = false;

const handleIntervention = (alarm: chrome.alarms.Alarm) => {
  console.log("Executing intervention logic for:", alarm.name);
  
  // If OS notifications are disabled, just return after logging.
  if (!ENABLE_OS_NOTIFICATIONS) {
    return;
  }
  
  // Handle different intervention types
  if (alarm.name === "limitExceeded") {
    notifyIfAllowed(alarm.name, {
      type: "basic",
      iconUrl: "icon-128.png",
      title: "Usage Limit Reached",
      message: "You have visited this site frequently. Time for a break?",
    });
  } else if (alarm.name === "timeLimitExceeded") {
    notifyIfAllowed(alarm.name, {
      type: "basic",
      iconUrl: "icon-128.png",
      title: "Time Limit Exceeded",
      message: "You've been browsing for a while. Consider taking a break!",
    });
  } else if (alarm.name === "shoppingImpulse") {
    notifyIfAllowed(alarm.name, {
      type: "basic",
      iconUrl: "icon-128.png",
      title: "Shopping Reminder",
      message: "Multiple visits to shopping sites detected. Take a moment to think.",
    });
  } else if (alarm.name === "doomscrolling") {
    notifyIfAllowed(alarm.name, {
      type: "basic",
      iconUrl: "icon-128.png",
      title: "Mindful Scrolling",
      message: "You've been scrolling for a while. Consider a mindful break.",
    });
  } else if (alarm.name === "doomscrolling-warning") {
    notifyIfAllowed(alarm.name, {
      type: "basic",
      iconUrl: "icon-128.png",
      title: "Heavy Scrolling Detected",
      message: "Noticeable scrolling activity. Small pause can help refocus.",
    });
  } else if (alarm.name.startsWith("pattern-")) {
    notifyIfAllowed(alarm.name, {
      type: "basic",
      iconUrl: "icon-128.png",
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

const sidePanelAvailable = "sidePanel" in chrome && !!chrome.sidePanel;
const autoOpenSupported = sidePanelAvailable && typeof chrome.sidePanel?.setPanelBehavior === "function";

if (autoOpenSupported) {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: unknown) => {
      console.error("[Kaizen] Failed to configure side panel behavior:", error);
    });
}

// Handle scroll events and page loads from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "OPEN_SIDE_PANEL") {
    const tabId = sender.tab?.id ?? message.tabId;

    if (typeof tabId !== "number") {
      sendResponse({ success: false, error: "TAB_ID_UNAVAILABLE" });
      return false;
    }

    try {
      openSidePanelForTab(tabId);
      sendResponse({ success: true });
    } catch (error) {
      console.error("[Kaizen] Failed to open side panel from message:", error);
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return false;
  }

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

  // Handle knowledge graph full dump
  if (message.type === 'GET_KNOWLEDGE_GRAPH') {
    console.log('Knowledge graph requested from UI');
    try {
      const graph = integrationManager.getFullGraph();
      sendResponse({ success: true, graph });
    } catch (error) {
      console.error('Failed to get knowledge graph:', error);
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Handle knowledge graph stats only
  if (message.type === 'GET_KG_STATS') {
    console.log('KG stats requested from UI');
    try {
      const stats = integrationManager.getKnowledgeGraphStats();
      sendResponse({ success: true, stats });
    } catch (error) {
      console.error('Failed to get KG stats:', error);
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Handle recent insights
  if (message.type === 'GET_RECENT_INSIGHTS') {
    console.log('Recent insights requested from UI');
    try {
      const insights = integrationManager.getRecentInsights(10);
      sendResponse({ success: true, insights });
    } catch (error) {
      console.error('Failed to get recent insights:', error);
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Handle contextual recommendations
  if (message.type === 'GET_CONTEXTUAL_RECS') {
    console.log('Contextual recommendations requested from UI');
    try {
      const query = message.payload?.query || '';
      integrationManager.getContextualRecommendations(query).then((recs) => {
        sendResponse({ success: true, recommendations: recs });
      }).catch((err) => {
        console.error('Failed to get recommendations:', err);
        sendResponse({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
      });
    } catch (error) {
      console.error('Failed to start recommendations:', error);
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Handle productivity stats requests
  if (message.type === 'GET_PRODUCTIVITY_STATS') {
    console.log('Productivity stats requested from UI');
    try {
      const productivityScore = integrationManager.getProductivityScore();
      const todayStats = integrationManager.getTodayStats();
      const knowledgeGraphStats = integrationManager.getKnowledgeGraphStats();
      const insights = integrationManager.getRecentInsights(5);
      const activeSessions = integrationManager.getActiveSessions();

      const sessionCounts = {
        time: activeSessions.time?.size ?? 0,
        shopping: activeSessions.shopping?.size ?? 0,
        doomscrolling: activeSessions.doomscrolling?.size ?? 0,
      };

      const sessionSummaries = {
        time: Array.from(activeSessions.time?.entries() ?? []).map(
          ([tabId, session]) => ({
            tabId,
            url: session.url,
            domain: session.domain,
            category: session.category,
            startTime: session.startTime,
            accumulatedTime: session.accumulatedTime,
            lastActiveTime: session.lastActiveTime,
          }),
        ),
        shopping: Array.from(activeSessions.shopping?.entries() ?? []).map(
          ([domain, session]) => ({
            domain,
            visitCount: session.visitCount,
            lastVisitTime: session.lastVisitTime,
            totalTimeSpent: session.totalTimeSpent,
          }),
        ),
        doomscrolling: Array.from(activeSessions.doomscrolling?.entries() ?? []).map(
          ([tabId, session]) => ({
            tabId,
            accumulatedScroll: session.accumulatedScroll,
            startTime: session.startTime,
            lastScrollTime: session.lastScrollTime,
            scrollEvents: session.scrollEvents,
          }),
        ),
      };

      // Calculate doomscrolling metrics
      const doomscrollSessions = sessionSummaries.doomscrolling;
      const totalScrollDistance = doomscrollSessions.reduce((sum, s) => sum + s.accumulatedScroll, 0);
      const averageScrollPerSession = doomscrollSessions.length > 0 ? totalScrollDistance / doomscrollSessions.length : 0;
      const highSeveritySessions = doomscrollSessions.filter(s => {
        const duration = Date.now() - s.startTime;
        if (duration < 60000) return false; // less than 1 min
        const scrollRatio = s.accumulatedScroll / 5000; // threshold is 5000px
        return scrollRatio >= 2; // high severity
      }).length;

      const doomscrollMetrics = {
        totalScrollDistance,
        averageScrollPerSession: Math.round(averageScrollPerSession),
        highSeveritySessions,
      };

      const stats = {
        productivityScore,
        todayStats,
        knowledgeGraphStats,
        sessionCounts,
        sessionSummaries,
        doomscrollMetrics,
        insights,
      };
      sendResponse({ success: true, stats });
    } catch (error) {
      console.error('Failed to get productivity stats:', error);
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Handle historical activity data requests
  if (message.type === 'GET_HISTORICAL_ACTIVITY') {
    console.log('Historical activity data requested from UI');
    try {
      const timeRange = message.timeRange || 'week';
      const activityData = integrationManager.getHistoricalActivity(timeRange);
      sendResponse({ success: true, data: activityData });
    } catch (error) {
      console.error('Failed to get historical activity data:', error);
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  return true; // Keep the message channel open for async response
});

if (!autoOpenSupported
  && sidePanelAvailable
  && chrome.action?.onClicked) {
  chrome.action.onClicked.addListener((tab) => {
    const tabId = tab.id;

    if (typeof tabId !== "number") {
      console.warn("[Kaizen] Unable to open side panel: missing tab id");
      return;
    }

    try {
      openSidePanelForTab(tabId);
    } catch (error) {
      console.error("[Kaizen] Failed to open side panel from action click:", error);
    }
  });
}

export default {
  scheduler,
  metrics,
  monitor,
  integrationManager,
};
