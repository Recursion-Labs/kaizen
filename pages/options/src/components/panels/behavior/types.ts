import type React from "react";

export type ThemeVariant = "light" | "dark";

export interface DashboardProps {
  theme: ThemeVariant;
}

export type BehaviorView =
  | "overview"
  | "activity"
  | "reports"
  | "remarks"
  | "goals";

export interface DashboardStats {
  totalTimeToday: number;
  patternsDetected: number;
  nudgesReceived: number;
  productivityScore: number;
  activeFocusTabs: number;
  shoppingAlerts: number;
}

export interface TodayMetrics {
  date: string;
  totalTime: number;
  productiveTime: number;
  distractedTime: number;
  sitesVisited: number;
  focusSessions: number;
  shoppingAlerts: number;
  doomscrollSessions: number;
}

export interface ProductivityInsight {
  description: string;
  severity: string;
  type: string;
  timestamp: number;
}

export interface ProductivityStatsPayload {
  productivityScore: number;
  todayStats: {
    productive: number;
    entertainment: number;
    neutral: number;
  };
  knowledgeGraphStats: {
    nodeCount: number;
    edgeCount: number;
    nodeTypes?: Record<string, number>;
    edgeTypes?: Record<string, number>;
  };
  sessionCounts?: {
    time: number;
    shopping: number;
    doomscrolling: number;
  };
  insights?: ProductivityInsight[];
}

export interface ProductivityStatsResponse {
  success: boolean;
  stats?: ProductivityStatsPayload;
  error?: string;
}

export interface InsightSummary {
  description: string;
  severity: string;
}

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  theme: ThemeVariant;
  color: "blue" | "purple" | "green" | "orange" | "pink" | "indigo";
}

export interface MetricItemProps {
  label: string;
  value: number | string;
  theme: ThemeVariant;
}

export interface GoalsPanelProps {
  theme: ThemeVariant;
}

export type GoalFrequency = "daily" | "weekly" | "monthly";

export type GoalUnit = "minutes" | "hours" | "sessions" | "sites";

export interface BehaviorGoal {
  id: string;
  title: string;
  description: string;
  type: GoalFrequency;
  target: number;
  current: number;
  unit: GoalUnit;
  createdAt: number;
  deadline?: number;
  completed: boolean;
}

export interface GoalCardProps {
  goal: BehaviorGoal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  theme: ThemeVariant;
}

export interface NewGoalDraft {
  title: string;
  description: string;
  type: GoalFrequency;
  target: number;
  unit: GoalUnit;
}

export interface RemarksPanelProps {
  theme: ThemeVariant;
}

export type RemarkMood = "positive" | "neutral" | "negative";

export type RemarkCategory =
  | "goal"
  | "reflection"
  | "achievement"
  | "challenge"
  | "note";

export interface BehaviorRemark {
  id: string;
  timestamp: number;
  content: string;
  tags: string[];
  mood?: RemarkMood;
  category?: RemarkCategory;
}

export interface MoodButtonProps {
  mood: RemarkMood;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  theme: ThemeVariant;
}

export interface RemarkCardProps {
  remark: BehaviorRemark;
  theme: ThemeVariant;
}

export interface ActivityChartProps {
  theme: ThemeVariant;
}

export type TimeRange = "day" | "week" | "month";

export type ChartType = "line" | "bar" | "area";

export interface ChartDataPoint {
  label: string;
  value: number;
  productiveTime: number;
  distractedTime: number;
}

export interface TimeRangeButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  theme: ThemeVariant;
}

export interface SummaryItemProps {
  label: string;
  value: string;
  theme: ThemeVariant;
}

export interface ReportsPanelProps {
  theme: ThemeVariant;
}

export type ReportType = "daily" | "weekly" | "monthly";

export type ExportFormat = "pdf" | "html" | "json";

export interface BehaviorReport {
  id: string;
  type: ReportType;
  generatedAt: number;
  period: { start: string; end: string };
  summary: {
    totalTime: number;
    productiveTime: number;
    topSites: Array<{ url: string; time: number }>;
  };
}

export interface ReportTypeButtonProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  theme: ThemeVariant;
}

export interface ReportCardProps {
  report: BehaviorReport;
  onExport: (reportId: string, format: ExportFormat) => void;
  theme: ThemeVariant;
}
