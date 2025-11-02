// Detection component types and interfaces

export interface DetectionProps {
  theme?: "light" | "dark";
}

export interface DetectionConfigProps {
  // DetectionConfig doesn't need theme since it uses Tailwind's automatic dark mode
}

export interface PatternConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  confidence: number;
  threshold: number;
  enabled: boolean;
  detectedToday: number;
}

export interface EngineMetrics {
  isMonitoring: boolean;
  activeDetectors: {
    timeTracker: boolean;
    shoppingDetector: boolean;
    doomScrolling: boolean;
    patternAnalyzer: boolean;
  };
  sessionCounts: {
    time: number;
    shopping: number;
    doomscrolling: number;
  };
  productivityScore: number;
  recentInsights: number;
  knowledgeNodes: number;
}

export interface DetectionStatus {
  isMonitoring: boolean;
  activeDetectors: {
    timeTracker: boolean;
    shoppingDetector: boolean;
    doomScrolling: boolean;
    patternAnalyzer: boolean;
  };
  sessionCounts: {
    time: number;
    shopping: number;
    doomscrolling: number;
  };
  recentInsights: Array<{
    type: string;
    description: string;
    severity: string;
    timestamp: number;
  }>;
  productivityScore: number;
  todayStats: {
    productive: number;
    entertainment: number;
    neutral: number;
  };
  knowledgeGraphStats: {
    nodes: number;
    edges: number;
    behaviorNodes: number;
  };
}

export interface PatternCardProps {
  pattern: PatternConfig;
  onToggle: (id: string) => void;
  onThresholdChange: (id: string, threshold: number) => void;
}

export interface DetectionStatusCardProps {
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  count?: number;
  theme: "light" | "dark";
  onToggle?: () => void;
}

export interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  theme: "light" | "dark";
  trend?: "up" | "down" | "neutral";
}

export interface InsightItemProps {
  insight: {
    type: string;
    description: string;
    severity: string;
    timestamp: number;
  };
  theme: "light" | "dark";
}

export interface EngineProps {
  theme: "light" | "dark";
}