import { cn } from "@extension/ui";
import { useState, useEffect } from "react";
import type { EngineProps, DetectionStatus } from "./types";
import type React from "react";

const DetectionStatusCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  count?: number;
  theme: "light" | "dark";
  onToggle?: () => void;
}> = ({ title, description, icon, isActive, count, theme, onToggle }) => (
  <div
    className={cn(
      "p-4 rounded-lg border transition-all duration-200",
      isActive
        ? theme === "light"
          ? "bg-green-50 border-green-200 shadow-sm"
          : "bg-green-900/20 border-green-800 shadow-sm"
        : theme === "light"
        ? "bg-gray-50 border-gray-200"
        : "bg-gray-800 border-gray-700",
    )}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <h4
            className={cn(
              "font-semibold",
              theme === "light" ? "text-gray-900" : "text-white",
            )}
          >
            {title}
          </h4>
          <p
            className={cn(
              "text-sm",
              theme === "light" ? "text-gray-600" : "text-gray-400",
            )}
          >
            {description}
          </p>
        </div>
      </div>
      {onToggle && (
        <button
          onClick={onToggle}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-colors",
            isActive
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </button>
      )}
    </div>
    {count !== undefined && (
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-sm",
            theme === "light" ? "text-gray-600" : "text-gray-400",
          )}
        >
          Active Sessions
        </span>
        <span
          className={cn(
            "text-sm font-semibold",
            isActive
              ? theme === "light"
                ? "text-green-600"
                : "text-green-400"
              : theme === "light"
              ? "text-gray-400"
              : "text-gray-500",
          )}
        >
          {count}
        </span>
      </div>
    )}
  </div>
);

const MetricsCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  theme: "light" | "dark";
  trend?: "up" | "down" | "neutral";
}> = ({ title, value, subtitle, icon, theme, trend }) => (
  <div
    className={cn(
      "p-4 rounded-lg border",
      theme === "light"
        ? "bg-white border-slate-200"
        : "bg-gray-800 border-gray-700",
    )}
  >
    <div className="flex items-center space-x-3 mb-2">
      <div className="text-xl">{icon}</div>
      <div className="flex-1">
        <h4
          className={cn(
            "font-semibold",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          {title}
        </h4>
        {subtitle && (
          <p
            className={cn(
              "text-xs",
              theme === "light" ? "text-gray-600" : "text-gray-400",
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
    <div className="flex items-baseline space-x-2">
      <span
        className={cn(
          "text-2xl font-bold",
          theme === "light" ? "text-gray-900" : "text-white",
        )}
      >
        {value}
      </span>
      {trend && (
        <span
          className={cn(
            "text-sm",
            trend === "up"
              ? "text-green-600"
              : trend === "down"
              ? "text-red-600"
              : "text-gray-500",
          )}
        >
          {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
        </span>
      )}
    </div>
  </div>
);

const InsightItem: React.FC<{
  insight: {
    type: string;
    description: string;
    severity: string;
    timestamp: number;
  };
  theme: "light" | "dark";
}> = ({ insight, theme }) => {
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return theme === "light" ? "text-red-600 bg-red-50" : "text-red-400 bg-red-900/20";
      case "medium":
        return theme === "light" ? "text-yellow-600 bg-yellow-50" : "text-yellow-400 bg-yellow-900/20";
      case "low":
        return theme === "light" ? "text-blue-600 bg-blue-50" : "text-blue-400 bg-blue-900/20";
      default:
        return theme === "light" ? "text-gray-600 bg-gray-50" : "text-gray-400 bg-gray-900/20";
    }
  };

  return (
    <div
      className={cn(
        "p-3 rounded-lg border",
        theme === "light"
          ? "bg-white border-slate-200"
          : "bg-gray-800 border-gray-700",
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                getSeverityColor(insight.severity),
              )}
            >
              {insight.severity.toUpperCase()}
            </span>
            <span
              className={cn(
                "text-xs font-medium",
                theme === "light" ? "text-gray-500" : "text-gray-400",
              )}
            >
              {insight.type}
            </span>
          </div>
          <p
            className={cn(
              "text-sm",
              theme === "light" ? "text-gray-900" : "text-white",
            )}
          >
            {insight.description}
          </p>
        </div>
      </div>
      <div
        className={cn(
          "text-xs",
          theme === "light" ? "text-gray-500" : "text-gray-400",
        )}
      >
        {formatTime(insight.timestamp)}
      </div>
    </div>
  );
};

export const Engine: React.FC<EngineProps> = ({ theme }) => {
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    isMonitoring: true,
    activeDetectors: {
      timeTracker: true,
      shoppingDetector: true,
      doomScrolling: true,
      patternAnalyzer: true,
    },
    sessionCounts: {
      time: 0,
      shopping: 0,
      doomscrolling: 0,
    },
    recentInsights: [],
    productivityScore: 0,
    todayStats: {
      productive: 0,
      entertainment: 0,
      neutral: 0,
    },
    knowledgeGraphStats: {
      nodes: 0,
      edges: 0,
      behaviorNodes: 0,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch detection status from background script
  const fetchDetectionStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get productivity stats which includes session counts and other metrics
      const productivityResponse = await chrome.runtime.sendMessage({
        type: 'GET_PRODUCTIVITY_STATS'
      });

      if (productivityResponse.success) {
        const stats = productivityResponse.stats;

        // Get recent insights
        const insightsResponse = await chrome.runtime.sendMessage({
          type: 'GET_RECENT_INSIGHTS'
        });

        const insights = insightsResponse.success ? insightsResponse.insights : [];

        setDetectionStatus({
          isMonitoring: true, // Assume monitoring is always active for now
          activeDetectors: {
            timeTracker: stats.sessionCounts.time > 0,
            shoppingDetector: stats.sessionCounts.shopping > 0,
            doomScrolling: stats.sessionCounts.doomscrolling > 0,
            patternAnalyzer: insights.length > 0,
          },
          sessionCounts: stats.sessionCounts,
          recentInsights: insights.slice(0, 5).map((insight: any) => ({
            type: insight.type,
            description: insight.description,
            severity: insight.severity,
            timestamp: insight.timestamp,
          })),
          productivityScore: Math.round(stats.productivityScore * 100),
          todayStats: stats.todayStats,
          knowledgeGraphStats: stats.knowledgeGraphStats,
        });
      } else {
        throw new Error(productivityResponse.error || 'Failed to fetch detection status');
      }
    } catch (err) {
      console.error('Failed to fetch detection status:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle detector (placeholder - would need backend support)
  const toggleDetector = (detector: keyof DetectionStatus['activeDetectors']) => {
    setDetectionStatus(prev => ({
      ...prev,
      activeDetectors: {
        ...prev.activeDetectors,
        [detector]: !prev.activeDetectors[detector],
      },
    }));
  };

  // Format time duration
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  useEffect(() => {
    fetchDetectionStatus();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDetectionStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading detection status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-600 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-red-800 font-semibold">Detection Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchDetectionStatus}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className={cn(
                "text-3xl font-bold mb-2",
                theme === "light" ? "text-gray-900" : "text-white",
              )}
            >
              🧠 Behavior Engine
            </h2>
            <p
              className={cn(
                "text-base max-w-2xl",
                theme === "light" ? "text-gray-600" : "text-gray-400",
              )}
            >
              Real-time behavior tracking and analysis. Monitor your digital habits with privacy-first detection.
            </p>
          </div>
          <button
            onClick={fetchDetectionStatus}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              theme === "light"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600",
            )}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                detectionStatus.isMonitoring ? "bg-green-500" : "bg-red-500",
              )}
            ></div>
            <span
              className={cn(
                "text-sm font-medium",
                theme === "light" ? "text-gray-700" : "text-gray-300",
              )}
            >
              {detectionStatus.isMonitoring ? "Monitoring Active" : "Monitoring Inactive"}
            </span>
          </div>
          <div
            className={cn(
              "text-sm",
              theme === "light" ? "text-gray-600" : "text-gray-400",
            )}
          >
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <section className="mb-8">
        <h3
          className={cn(
            "text-xl font-bold mb-4",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          Key Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricsCard
            title="Productivity"
            value={`${detectionStatus.productivityScore}%`}
            subtitle="Today's score"
            icon="📈"
            theme={theme}
            trend={detectionStatus.productivityScore > 70 ? "up" : detectionStatus.productivityScore < 50 ? "down" : "neutral"}
          />
          <MetricsCard
            title="Active Sessions"
            value={detectionStatus.sessionCounts.time + detectionStatus.sessionCounts.shopping + detectionStatus.sessionCounts.doomscrolling}
            subtitle="Total active"
            icon="🎯"
            theme={theme}
          />
          <MetricsCard
            title="Knowledge Nodes"
            value={detectionStatus.knowledgeGraphStats.nodes}
            subtitle="Learned patterns"
            icon="🧠"
            theme={theme}
          />
          <MetricsCard
            title="Today's Time"
            value={formatDuration(detectionStatus.todayStats.productive + detectionStatus.todayStats.entertainment + detectionStatus.todayStats.neutral)}
            subtitle="Total browsing"
            icon="⏱️"
            theme={theme}
          />
        </div>
      </section>

      {/* Active Detectors */}
      <section className="mb-8">
        <h3
          className={cn(
            "text-xl font-bold mb-4",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          Active Detectors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetectionStatusCard
            title="Time Tracking"
            description="Monitors browsing duration and productivity"
            icon="⏱️"
            isActive={detectionStatus.activeDetectors.timeTracker}
            count={detectionStatus.sessionCounts.time}
            theme={theme}
            onToggle={() => toggleDetector('timeTracker')}
          />
          <DetectionStatusCard
            title="Shopping Detection"
            description="Identifies impulsive shopping patterns"
            icon="🛒"
            isActive={detectionStatus.activeDetectors.shoppingDetector}
            count={detectionStatus.sessionCounts.shopping}
            theme={theme}
            onToggle={() => toggleDetector('shoppingDetector')}
          />
          <DetectionStatusCard
            title="Doom Scrolling"
            description="Tracks extended scrolling sessions"
            icon="📜"
            isActive={detectionStatus.activeDetectors.doomScrolling}
            count={detectionStatus.sessionCounts.doomscrolling}
            theme={theme}
            onToggle={() => toggleDetector('doomScrolling')}
          />
          <DetectionStatusCard
            title="Pattern Analysis"
            description="Detects behavioral patterns and trends"
            icon="🔍"
            isActive={detectionStatus.activeDetectors.patternAnalyzer}
            theme={theme}
            onToggle={() => toggleDetector('patternAnalyzer')}
          />
        </div>
      </section>

      {/* Recent Insights */}
      <section className="mb-8">
        <h3
          className={cn(
            "text-xl font-bold mb-4",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          Recent Insights
        </h3>
        {detectionStatus.recentInsights.length > 0 ? (
          <div className="space-y-3">
            {detectionStatus.recentInsights.map((insight, index) => (
              <InsightItem key={index} insight={insight} theme={theme} />
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "p-8 text-center rounded-lg border-2 border-dashed",
              theme === "light"
                ? "bg-gray-50 border-gray-200 text-gray-500"
                : "bg-gray-800 border-gray-700 text-gray-400",
            )}
          >
            <div className="text-4xl mb-2">🔍</div>
            <p>No insights detected yet. Start browsing to see behavioral patterns!</p>
          </div>
        )}
      </section>

      {/* Today's Activity Breakdown */}
      <section>
        <h3
          className={cn(
            "text-xl font-bold mb-4",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          Today's Activity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={cn(
              "p-4 rounded-lg border",
              theme === "light"
                ? "bg-green-50 border-green-200"
                : "bg-green-900/20 border-green-800",
            )}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">💼</span>
              <div>
                <h4
                  className={cn(
                    "font-semibold",
                    theme === "light" ? "text-green-900" : "text-green-300",
                  )}
                >
                  Productive
                </h4>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    theme === "light" ? "text-green-800" : "text-green-200",
                  )}
                >
                  {formatDuration(detectionStatus.todayStats.productive)}
                </p>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "p-4 rounded-lg border",
              theme === "light"
                ? "bg-yellow-50 border-yellow-200"
                : "bg-yellow-900/20 border-yellow-800",
            )}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">🎮</span>
              <div>
                <h4
                  className={cn(
                    "font-semibold",
                    theme === "light" ? "text-yellow-900" : "text-yellow-300",
                  )}
                >
                  Entertainment
                </h4>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    theme === "light" ? "text-yellow-800" : "text-yellow-200",
                  )}
                >
                  {formatDuration(detectionStatus.todayStats.entertainment)}
                </p>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "p-4 rounded-lg border",
              theme === "light"
                ? "bg-gray-50 border-gray-200"
                : "bg-gray-800 border-gray-700",
            )}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">📄</span>
              <div>
                <h4
                  className={cn(
                    "font-semibold",
                    theme === "light" ? "text-gray-900" : "text-white",
                  )}
                >
                  Neutral
                </h4>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    theme === "light" ? "text-gray-800" : "text-gray-200",
                  )}
                >
                  {formatDuration(detectionStatus.todayStats.neutral)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
