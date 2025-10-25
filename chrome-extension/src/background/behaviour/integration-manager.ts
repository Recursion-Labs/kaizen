import { DoomScrolling } from "../../../../packages/detectors/Doomscrolling";
import { PatternAnalyzer } from "../../../../packages/detectors/PatternAnalyzer";
import { ShoppingDetector } from "../../../../packages/detectors/ShoppingDetector";
import { TimeTracker } from "../../../../packages/detectors/TimeTracker";
import { EmbeddingService } from "../../../../packages/knowledge/EmbeddingService";
import { KnowledgeGraph } from "../../../../packages/knowledge/KnowledgeGraph";
import { RAGEngine } from "../../../../packages/knowledge/RAGEngine";
import type { InterventionScheduler } from "./intervention-scheduler";
import type { DoomScrollingEvent } from "../../../../packages/detectors/Doomscrolling";
import type { PatternInsight } from "../../../../packages/detectors/PatternAnalyzer";
import type { ShoppingEvent } from "../../../../packages/detectors/ShoppingDetector";
import type { TimeTrackingEvent } from "../../../../packages/detectors/TimeTracker";

/**
 * Integration manager that coordinates detectors, knowledge graph, and RAG engine
 */
export class IntegrationManager {
  private timeTracker: TimeTracker;
  private shoppingDetector: ShoppingDetector;
  private doomScrolling: DoomScrolling;
  private patternAnalyzer: PatternAnalyzer;
  private knowledgeGraph: KnowledgeGraph;
  private embeddingService: EmbeddingService;
  private ragEngine: RAGEngine;
  private scheduler: InterventionScheduler;
  private lastActiveTabId: number | null = null;
  private cooldowns: Map<string, number> = new Map();

  constructor(scheduler: InterventionScheduler) {
    this.scheduler = scheduler;

    // Initialize detectors
    this.timeTracker = new TimeTracker();
    this.shoppingDetector = new ShoppingDetector();
    this.doomScrolling = new DoomScrolling();

    // Initialize knowledge components
    this.knowledgeGraph = new KnowledgeGraph();
    
    // Note: EmbeddingService requires Node.js fs/path modules
    // For Chrome extension, we'll use Chrome storage for caching
    // Initialize with minimal config for Chrome extension
    this.embeddingService = new EmbeddingService({
      modelProvider: "gemini",
      modelName: "gemini-2.0-flash-exp",
      cacheDir: "", // Empty for Chrome extension
    });

    // Initialize pattern analyzer with detectors
    this.patternAnalyzer = new PatternAnalyzer(
      this.timeTracker,
      this.doomScrolling,
      this.shoppingDetector,
      {
        analysisIntervalMinutes: 15,
        realTimeAnalysis: true,
      }
    );

    // Initialize RAG engine
    this.ragEngine = new RAGEngine(this.knowledgeGraph, this.embeddingService);

    // Setup event listeners
    this.setupEventListeners();

    // Start monitoring
    this.startMonitoring();

    // Attempt to restore persisted detector sessions (best-effort)
    this.restorePersistedSessions();

    console.log("Integration manager initialized with all detectors and knowledge components.");
  }

  /**
   * Setup event listeners for all detectors
   */
  private setupEventListeners(): void {
    // Time tracking events
    this.timeTracker.addEventListener((event: TimeTrackingEvent) => {
      this.handleTimeTrackingEvent(event);
    });

    // Shopping events
    this.shoppingDetector.addEventListener((event: ShoppingEvent) => {
      this.handleShoppingEvent(event);
    });

    // Doomscrolling events
    this.doomScrolling.addEventListener((event: DoomScrollingEvent) => {
      this.handleDoomScrollingEvent(event);
    });

    // Pattern insights
    this.patternAnalyzer.addEventListener((insight: PatternInsight) => {
      this.handlePatternInsight(insight);
    });
  }

  /**
   * Handle time tracking events
   */
  private handleTimeTrackingEvent(event: TimeTrackingEvent): void {
    const nodeId = `time-${event.tabId}-${event.timestamp}`;
    
    // Add node to knowledge graph
    this.knowledgeGraph.addNode({
      id: nodeId,
      type: "behavior",
      metadata: {
        type: "timeTracking",
        tabId: event.tabId,
        url: event.url,
        domain: event.domain,
        category: event.category,
        timeSpent: event.timeSpent,
        severity: event.severity,
        timestamp: event.timestamp,
      },
      createdAt: event.timestamp,
      updatedAt: event.timestamp,
    });

    // Add edge to domain/tab
    this.knowledgeGraph.addEdge({
      source: `domain-${event.domain}`,
      target: nodeId,
      type: "visited",
      metadata: { timeSpent: event.timeSpent },
      createdAt: event.timestamp,
    });

    // Schedule intervention if needed
    if (event.severity === "high") {
      this.scheduleWithCooldown("timeLimitExceeded", 2000, 10 * 60 * 1000, `time:${event.domain}`);
    }

    console.log(`Time tracking event: ${event.domain} spent ${event.timeSpent}ms`);
  }

  /**
   * Handle shopping events
   */
  private handleShoppingEvent(event: ShoppingEvent): void {
    const nodeId = `shopping-${event.domain}-${event.timestamp}`;

    // Add node to knowledge graph
    this.knowledgeGraph.addNode({
      id: nodeId,
      type: "behavior",
      metadata: {
        type: "shopping",
        domain: event.domain,
        url: event.url,
        tabId: event.tabId,
        severity: event.severity,
        visitCount: event.visitCount,
        timeSpent: event.timeSpent,
        timestamp: event.timestamp,
      },
      createdAt: event.timestamp,
      updatedAt: event.timestamp,
    });

    // Add edge to domain
    this.knowledgeGraph.addNode({
      id: `domain-${event.domain}`,
      type: "domain",
      metadata: { domain: event.domain },
      createdAt: event.timestamp,
      updatedAt: event.timestamp,
    });

    this.knowledgeGraph.addEdge({
      source: `domain-${event.domain}`,
      target: nodeId,
      type: "exhibits",
      metadata: { behaviorType: "shopping" },
      createdAt: event.timestamp,
    });

    // Schedule intervention if needed
    if (event.severity === "high") {
      this.scheduleWithCooldown("shoppingImpulse", 3000, 10 * 60 * 1000, `shop:${event.domain}`);
    }

    console.log(`Shopping event: ${event.domain} has ${event.severity} severity`);
  }

  /**
   * Handle doomscrolling events
   */
  private handleDoomScrollingEvent(event: DoomScrollingEvent): void {
    const nodeId = `doomscroll-${event.tabId}-${event.timestamp}`;

    // Add node to knowledge graph
    this.knowledgeGraph.addNode({
      id: nodeId,
      type: "behavior",
      metadata: {
        type: "doomscrolling",
        tabId: event.tabId,
        url: event.url,
        severity: event.severity,
        scrollAmount: event.scrollAmount,
        timestamp: event.timestamp,
      },
      createdAt: event.timestamp,
      updatedAt: event.timestamp,
    });

    // Add edge to tab
    this.knowledgeGraph.addNode({
      id: `tab-${event.tabId}`,
      type: "tab",
      metadata: { tabId: event.tabId },
      createdAt: event.timestamp,
      updatedAt: event.timestamp,
    });

    this.knowledgeGraph.addEdge({
      source: `tab-${event.tabId}`,
      target: nodeId,
      type: "exhibits",
      metadata: { behaviorType: "doomscrolling", severity: event.severity },
      createdAt: event.timestamp,
    });

    // Schedule intervention if needed
    if (event.severity === "high") {
      this.scheduleWithCooldown("doomscrolling", 2000, 5 * 60 * 1000, `doom:${event.tabId}`);
    }

    console.log(`Doomscrolling event: Tab ${event.tabId} has ${event.severity} severity`);
  }

  /**
   * Handle pattern insights
   */
  private handlePatternInsight(insight: PatternInsight): void {
    const nodeId = `pattern-${insight.type}-${insight.timestamp}`;

    // Add pattern node to knowledge graph
    this.knowledgeGraph.addNode({
      id: nodeId,
      type: "pattern",
      metadata: {
        type: insight.type,
        description: insight.description,
        severity: insight.severity,
        confidence: insight.confidence,
        metadata: insight.metadata,
        timestamp: insight.timestamp,
      },
      createdAt: insight.timestamp,
      updatedAt: insight.timestamp,
    });

    // Add edges to related behaviors
    if (insight.metadata?.tabIds) {
      const tabIds = Array.isArray(insight.metadata.tabIds) 
        ? insight.metadata.tabIds 
        : [insight.metadata.tabIds];
      
      tabIds.forEach((tabId: number | string) => {
        this.knowledgeGraph.addEdge({
          source: `tab-${tabId}`,
          target: nodeId,
          type: "contributesTo",
          metadata: { patternType: insight.type },
          createdAt: insight.timestamp,
        });
      });
    }

    // Schedule intervention for high severity patterns
    if (insight.severity === "high") {
      this.scheduler.scheduleIntervention(`pattern-${insight.type}`, 4000);
    }

    console.log(`Pattern insight: ${insight.type} - ${insight.description}`);
  }

  /**
   * Start monitoring for all detectors
   */
  private startMonitoring(): void {
    this.timeTracker.startRealTimeMonitoring();
    this.shoppingDetector.startRealTimeMonitoring();
    this.doomScrolling.startRealTimeMonitoring();
    this.patternAnalyzer.startRealTimeAnalysis();
  }

  /**
   * Stop monitoring for all detectors
   */
  public stopMonitoring(): void {
    this.timeTracker.stopRealTimeMonitoring();
    this.shoppingDetector.stopRealTimeMonitoring();
    this.doomScrolling.stopRealTimeMonitoring();
    this.patternAnalyzer.stopRealTimeAnalysis();
  }

  /**
   * Handle tab activation
   */
  public handleTabActivated(tabId: number): void {
    // Stop previous active tab session
    if (this.lastActiveTabId !== null && this.lastActiveTabId !== tabId) {
      this.timeTracker.stopTabSession(this.lastActiveTabId);
      this.shoppingDetector.endTabSession(this.lastActiveTabId);
    }

    this.lastActiveTabId = tabId;

    // Ensure a session exists for the newly active tab
    chrome.tabs.get(tabId, (tab) => {
      if (tab?.url) {
        const hasSession = this.timeTracker.getActiveSessions().has(tabId);
        if (!hasSession) {
          this.timeTracker.startTabSession(tabId, tab.url);
        } else {
          this.timeTracker.updateTabActivity(tabId);
        }
        // Track shopping session start if applicable
        this.shoppingDetector.startTabSession(tabId, tab.url);
      }
    });

    this.patternAnalyzer.recordTabSwitch(tabId);
  }

  /**
   * Handle tab update
   */
  public async handleTabUpdate(tab: chrome.tabs.Tab): Promise<void> {
    if (!tab.url || !tab.id) return;

    const tabId = tab.id;
    const url = tab.url;

    // Start session if missing, else update
    const hasSession = this.timeTracker.getActiveSessions().has(tabId);
    if (!hasSession) {
      this.timeTracker.startTabSession(tabId, url);
    } else {
      this.timeTracker.updateTabUrl(tabId, url);
    }

    // Check for shopping
    this.shoppingDetector.recordVisit(tabId, url);

    // Check for doomscrolling domain
    if (this.doomScrolling.getMonitoredDomains().some((domain) => url.includes(domain))) {
      // Domain is monitored, tracking will happen via content script
    }

    // Update knowledge graph with domain
    this.knowledgeGraph.addNode({
      id: `domain-${new URL(url).hostname}`,
      type: "domain",
      metadata: { domain: new URL(url).hostname, url },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  /**
   * Handle scroll events (called from content script)
   */
  public handleScroll(tabId: number, scrollAmount: number, url: string): void {
    this.doomScrolling.addScroll(tabId, scrollAmount, url);

    // Persist minimal session snapshot to session storage to survive short SW sleeps
    try {
      const session = this.doomScrolling.getSession(tabId);
      if (session) {
        chrome.storage.session?.set?.({ [`doom:${tabId}`]: session });
      }
    } catch {
      // ignore if storage.session not available
    }
  }

  /**
   * Get recent insights from pattern analyzer
   */
  public getRecentInsights(limit: number = 10): PatternInsight[] {
    return this.patternAnalyzer.getRecentInsights(limit);
  }

  /**
   * Get behavior context for AI nudges
   */
  public generateContextForNudge() {
    return this.ragEngine.generateContextForNudge();
  }

  /**
   * Get productivity score
   */
  public getProductivityScore(): number {
    return this.timeTracker.getProductivityScore();
  }

  /**
   * Get today's stats
   */
  public getTodayStats() {
    return this.timeTracker.getTodayStats();
  }

  /**
   * Get knowledge graph stats
   */
  public getKnowledgeGraphStats() {
    return this.knowledgeGraph.getStats();
  }

  /**
   * Get active sessions
   */
  public getActiveSessions() {
    return {
      time: this.timeTracker.getActiveSessions(),
      shopping: this.shoppingDetector.getActiveSessions(),
      doomscrolling: this.doomScrolling.getActiveSessions(),
    };
  }

  /**
   * Restore persisted sessions from chrome.storage.session
   */
  private restorePersistedSessions() {
    try {
      chrome.storage.session?.get?.(null, (items: Record<string, unknown>) => {
        if (!items) return;
        Object.entries(items).forEach(([key, value]) => {
          if (key.startsWith('doom:')) {
            const tabId = Number(key.split(':')[1]);
            if (typeof tabId === 'number' && value && typeof value === 'object') {
              this.doomScrolling.restoreSession(tabId, value as any);
            }
          }
        });
      });
    } catch {
      // ignore if storage.session not available
    }
  }

  /**
   * Handle tab removed - cleanup sessions and graph
   */
  public handleTabRemoved(tabId: number) {
    this.timeTracker.stopTabSession(tabId);
    this.shoppingDetector.endTabSession(tabId);
    this.doomScrolling.resetScroll(tabId);
    if (this.lastActiveTabId === tabId) this.lastActiveTabId = null;
    // Optionally remove tab node from KG
    this.knowledgeGraph.removeNode(`tab-${tabId}`);
  }

  /**
   * Schedule with cooldown key to avoid spam
   */
  private scheduleWithCooldown(name: string, delayMs: number, cooldownMs: number, key: string) {
    const now = Date.now();
    const nextAllowed = this.cooldowns.get(key) || 0;
    if (now < nextAllowed) return; // still in cooldown
    this.cooldowns.set(key, now + cooldownMs);
    this.scheduler.scheduleIntervention(name, delayMs);
  }
}

