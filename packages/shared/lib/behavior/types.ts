/**
 * Behavior Engine - Core Type Definitions
 * Privacy-first behavioral analytics system for Kaizen Extension
 */

// ============================================================================
// Behavior Detection Types
// ============================================================================

export type BehaviorType =
  | "doomscrolling"
  | "impulsive-shopping"
  | "excessive-browsing"
  | "productive-work"
  | "research-mode"
  | "distraction"
  | "focus-session";

export interface BehaviorPattern {
  id: string;
  type: BehaviorType;
  confidence: number; // 0-1
  startTime: number;
  endTime: number;
  metadata: {
    url?: string;
    domain?: string;
    scrollEvents?: number;
    tabsOpened?: number;
    clickCount?: number;
    focusLost?: number;
    averageScrollSpeed?: number;
    contentEngagement?: number;
    [key: string]: unknown;
  };
}

// ============================================================================
// Metrics & Analytics Types
// ============================================================================

export interface BehaviorMetrics {
  date: string; // YYYY-MM-DD
  totalTime: number; // minutes
  productiveTime: number;
  distractedTime: number;
  sitesVisited: number;
  tabsSwitched: number;
  interventionCount: number;
  behaviors: BehaviorPattern[];
}

export interface SiteActivity {
  url: string;
  domain: string;
  title: string;
  visitCount: number;
  totalTime: number; // seconds
  lastVisit: number;
  category?: SiteCategory;
  favicon?: string;
}

export type SiteCategory =
  | "work"
  | "social"
  | "news"
  | "shopping"
  | "entertainment"
  | "research"
  | "other";

// ============================================================================
// Detection Results
// ============================================================================

export interface DoomscrollAnalysis {
  isDoomscrolling: boolean;
  confidence: number;
  duration: number; // minutes
  scrollCount: number;
  averageScrollSpeed: number; // px/sec
  variance: number;
  recommendation: string;
}

export interface ShoppingAnalysis {
  isImpulsiveShopping: boolean;
  confidence: number;
  sitesVisited: number;
  cartActions: number;
  priceComparisons: number;
  timeSpent: number;
  isLateNight: boolean;
  recommendation: string;
}

export interface FocusAnalysis {
  isFocused: boolean;
  duration: number;
  distractions: number;
  productivity: number; // 0-100
  peakHours: number[]; // Hours of day
}

// ============================================================================
// Intervention Types
// ============================================================================

export type NotificationType =
  | "nudge"
  | "reminder"
  | "insight"
  | "celebration"
  | "warning";

export type NotificationPriority = "low" | "medium" | "high";

export interface NotificationPayload {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
  priority: NotificationPriority;
  expiresAt?: number;
  behaviorId?: string;
}

export interface InterventionSettings {
  enabled: boolean;
  quietHours: {
    enabled: boolean;
    start: number; // Hour (0-23)
    end: number; // Hour (0-23)
  };
  maxPerHour: number;
  avoidDuringFocus: boolean;
  respectDND: boolean;
  deliveryMethods: ("chrome-notification" | "badge" | "sidepanel-popup")[];
}

// ============================================================================
// Remarks & User Notes
// ============================================================================

export type RemarkMood = "positive" | "neutral" | "negative";

export type RemarkCategory =
  | "goal"
  | "reflection"
  | "achievement"
  | "challenge"
  | "note";

export interface Remark {
  id: string;
  timestamp: number;
  behaviorId?: string; // Link to specific behavior
  content: string;
  tags: string[];
  mood?: RemarkMood;
  category?: RemarkCategory;
}

// ============================================================================
// Reports
// ============================================================================

export interface BehaviorReport {
  id: string;
  generatedAt: number;
  period: {
    start: number;
    end: number;
  };
  summary: {
    totalTime: number;
    productiveTime: number;
    topSites: Array<{ url: string; time: number; domain: string }>;
    behaviorBreakdown: Record<BehaviorType, number>;
    interventionsTriggered: number;
    goalsAchieved: number;
  };
  insights: string[];
  recommendations: string[];
  charts: {
    dailyActivity: Array<{ date: string; minutes: number }>;
    categoryBreakdown: Array<{ category: string; percentage: number }>;
    focusHeatmap?: Array<{ hour: number; day: number; value: number }>;
  };
}

// ============================================================================
// Storage Types
// ============================================================================

export interface StoredBehaviorData {
  metrics: Record<string, BehaviorMetrics>; // Key: YYYY-MM-DD
  patterns: BehaviorPattern[];
  sites: Record<string, SiteActivity>; // Key: domain
  remarks: Remark[];
  reports: BehaviorReport[];
}

// ============================================================================
// Event Types
// ============================================================================

export interface ScrollEvent {
  timestamp: number;
  delta: number; // Scroll distance
  speed: number; // px/sec
  direction: "up" | "down";
  url: string;
}

export interface TabEvent {
  type: "created" | "activated" | "updated" | "removed";
  tabId: number;
  url?: string;
  timestamp: number;
}

export interface BehaviorEvent {
  type: "detection" | "intervention" | "metric-update";
  data: unknown;
  timestamp: number;
}

// ============================================================================
// Detector Configuration
// ============================================================================

export interface DoomscrollCriteria {
  minDuration: number; // minutes
  minScrollEvents: number;
  maxContentRetention: number; // percentage
  domains: string[];
}

export interface ShoppingCriteria {
  minSitesVisited: number;
  maxTimeBetweenCart: number; // seconds
  lateNightHours: [number, number]; // [start, end]
  shoppingDomains: string[];
}

// ============================================================================
// Goal Tracking
// ============================================================================

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly";
  target: number;
  current: number;
  unit: string;
  createdAt: number;
  deadline?: number;
  completed: boolean;
}

// ============================================================================
// Configuration
// ============================================================================

export interface BehaviorEngineConfig {
  enabled: boolean;
  detectors: {
    doomscroll: boolean;
    shopping: boolean;
    timeTracking: boolean;
    focus: boolean;
  };
  interventions: InterventionSettings;
  analytics: {
    enabled: boolean;
    retentionDays: number;
  };
}
