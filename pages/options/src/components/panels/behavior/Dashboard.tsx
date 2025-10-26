import { Activity } from "./Activity";
import { Goals } from "./Goals";
import { Notes } from "./Notes";
import { Reports } from "./Reports";
import { cn } from "@extension/ui";
import {
  LayoutDashboard,
  LineChart,
  FileText,
  MessageSquare,
  Target,
  Clock,
  Brain,
  Bell,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import type {
  DashboardProps,
  BehaviorView,
  DashboardStats,
  TodayMetrics,
  ProductivityStatsResponse,
  ThemeVariant,
  InsightSummary,
  StatCardProps,
  MetricItemProps,
} from "./types";
import type React from "react";

/**
 * Dashboard - Main container that houses ALL behavior analytics features
 * All sub-components (Activity, Reports, Notes, Goals) are rendered here based on tabs
 */
const Dashboard: React.FC<DashboardProps> = ({ theme }) => {
  const [activeView, setActiveView] = useState<BehaviorView>("overview");

  const tabs = [
    {
      id: "overview" as const,
      label: "Overview",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: "activity" as const,
      label: "Activity",
      icon: <LineChart className="h-4 w-4" />,
    },
    {
      id: "reports" as const,
      label: "Reports",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "remarks" as const,
      label: "Notes",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      id: "goals" as const,
      label: "Goals",
      icon: <Target className="h-4 w-4" />,
    },
  ];

  const renderView = () => {
    switch (activeView) {
      case "overview":
        return <OverviewTab theme={theme} />;
      case "activity":
        return <Activity theme={theme} />;
      case "reports":
        return <Reports theme={theme} />;
      case "remarks":
        return <Notes theme={theme} />;
      case "goals":
        return <Goals theme={theme} />;
      default:
        return <OverviewTab theme={theme} />;
    }
  };

  return (
    <div className="h-full">
      {/* Header with Tabs */}
      <div
        className={cn(
          "sticky top-0 z-10 border-b",
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-gray-800 border-gray-700",
        )}
      >
        <div className="px-6 py-4">
          <h1
            className={cn(
              "text-2xl font-bold mb-4",
              theme === "light" ? "text-gray-900" : "text-white",
            )}
          >
            Behavior Analytics
          </h1>
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeView === tab.id
                    ? theme === "light"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-blue-900/30 text-blue-400"
                    : theme === "light"
                      ? "text-gray-600 hover:bg-gray-50"
                      : "text-gray-400 hover:bg-gray-700/50",
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-180px)] overflow-y-auto">
        {renderView()}
      </div>
    </div>
  );
};

// ============================================================================
// OVERVIEW TAB - Dashboard Stats & Quick Insights
// ============================================================================

const OverviewTab: React.FC<{ theme: ThemeVariant }> = ({ theme }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTimeToday: 0,
    patternsDetected: 0,
    nudgesReceived: 0,
    productivityScore: 0,
    activeFocusTabs: 0,
    shoppingAlerts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayMetrics, setTodayMetrics] = useState<TodayMetrics | null>(null);
  const [latestInsight, setLatestInsight] = useState<InsightSummary | null>(
    null,
  );
  const isMountedRef = useRef(true);

  const loadDashboardData = useCallback(
    async (withSpinner = false) => {
      if (withSpinner) {
        setLoading(true);
      }
      setError(null);

      try {
        if (!chrome?.runtime?.sendMessage) {
          throw new Error(
            "Real-time data is unavailable outside of the extension context.",
          );
        }

        const response = (await chrome.runtime.sendMessage({
          type: "GET_PRODUCTIVITY_STATS",
        })) as ProductivityStatsResponse;

        if (!response?.success || !response.stats) {
          throw new Error(
            response?.error ?? "Unable to load productivity stats.",
          );
        }

        const payload = response.stats;

        const toMinutes = (value?: number, now?: number, startTime?: number) => {
          if (typeof now === "number" && typeof startTime === "number") {
            // Guard against negative durations due to clock skew or time zone issues
            return Math.max(0, Math.round(Math.max(0, now - startTime) / 60000));
          }
          return Math.max(0, Math.round((value ?? 0) / 60000));
        };

        const productiveMinutes = toMinutes(payload.todayStats?.productive);
        const entertainmentMinutes = toMinutes(
          payload.todayStats?.entertainment,
        );
        const neutralMinutes = toMinutes(payload.todayStats?.neutral);
        const distractedMinutes = entertainmentMinutes + neutralMinutes;
        const totalMinutes = productiveMinutes + distractedMinutes;

        const nodeTypes = payload.knowledgeGraphStats?.nodeTypes ?? {};
        const sessionCounts = payload.sessionCounts ?? {
          time: 0,
          shopping: 0,
          doomscrolling: 0,
        };

        if (!isMountedRef.current) {
          return;
        }

        setStats({
          totalTimeToday: totalMinutes,
          patternsDetected: nodeTypes.pattern ?? 0,
          nudgesReceived: nodeTypes.nudge ?? 0,
          productivityScore: Math.round(
            Math.max(0, Math.min(1, payload.productivityScore ?? 0)) * 100,
          ),
          activeFocusTabs: sessionCounts.time,
          shoppingAlerts: sessionCounts.shopping,
        });

        setTodayMetrics({
          date: new Date().toISOString().split("T")[0],
          totalTime: totalMinutes,
          productiveTime: productiveMinutes,
          distractedTime: distractedMinutes,
          sitesVisited: nodeTypes.domain ?? 0,
          focusSessions: sessionCounts.time,
          shoppingAlerts: sessionCounts.shopping,
          doomscrollSessions: sessionCounts.doomscrolling,
        });

        const newestInsight =
          payload.insights && payload.insights.length > 0
            ? payload.insights[payload.insights.length - 1]
            : null;

        setLatestInsight(
          newestInsight
            ? {
                description: newestInsight.description,
                severity: (newestInsight.severity || "low").toLowerCase(),
              }
            : null,
        );
      } catch (err) {
        if (!isMountedRef.current) {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load dashboard data.";
        setError(message);
      } finally {
        if (withSpinner && isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void loadDashboardData(true);
    const intervalId = window.setInterval(() => {
      void loadDashboardData();
    }, 15000);

    return () => {
      isMountedRef.current = false;
      window.clearInterval(intervalId);
    };
  }, [loadDashboardData]);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const focusPercentage =
    todayMetrics && todayMetrics.totalTime > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              (todayMetrics.productiveTime / todayMetrics.totalTime) * 100,
            ),
          ),
        )
      : 0;

  const severityTone = latestInsight?.severity ?? "low";
  const severityLabel =
    severityTone.charAt(0).toUpperCase() + severityTone.slice(1);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div
          className={cn(theme === "light" ? "text-gray-500" : "text-gray-400")}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {error && (
        <div
          className={cn(
            "rounded-lg border p-4 text-sm",
            theme === "light"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-red-800 bg-red-900/30 text-red-200",
          )}
        >
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => loadDashboardData(true)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                theme === "light"
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-red-500 text-white hover:bg-red-400",
              )}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Time Online Today"
          value={formatTime(stats.totalTimeToday)}
          theme={theme}
          color="blue"
        />
        <StatCard
          icon={<Brain className="h-5 w-5" />}
          label="Patterns Detected"
          value={stats.patternsDetected.toString()}
          theme={theme}
          color="purple"
        />
        <StatCard
          icon={<Bell className="h-5 w-5" />}
          label="Nudges Triggered"
          value={stats.nudgesReceived.toString()}
          theme={theme}
          color="green"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Productivity Score"
          value={`${stats.productivityScore}%`}
          theme={theme}
          color="orange"
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label="Active Focus Tabs"
          value={stats.activeFocusTabs.toString()}
          theme={theme}
          color="pink"
        />
        <StatCard
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Shopping Alerts"
          value={stats.shoppingAlerts.toString()}
          theme={theme}
          color="indigo"
        />
      </div>

      {todayMetrics && (
        <div
          className={cn(
            "rounded-lg border p-6",
            theme === "light"
              ? "border-gray-200 bg-white"
              : "border-gray-700 bg-gray-800",
          )}
        >
          <h3
            className={cn(
              "mb-4 text-lg font-semibold",
              theme === "light" ? "text-gray-900" : "text-white",
            )}
          >
            Today's Activity
          </h3>

          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span
                className={cn(
                  theme === "light" ? "text-gray-700" : "text-gray-300",
                )}
              >
                Productive: {formatTime(todayMetrics.productiveTime)}
              </span>
              <span
                className={cn(
                  theme === "light" ? "text-gray-700" : "text-gray-300",
                )}
              >
                Distracted: {formatTime(todayMetrics.distractedTime)}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${focusPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <MetricItem
              label="Sites Visited"
              value={todayMetrics.sitesVisited}
              theme={theme}
            />
            <MetricItem
              label="Focus Tabs"
              value={todayMetrics.focusSessions}
              theme={theme}
            />
            <MetricItem
              label="Shopping Alerts"
              value={todayMetrics.shoppingAlerts}
              theme={theme}
            />
            <MetricItem
              label="Doomscroll Tabs"
              value={todayMetrics.doomscrollSessions}
              theme={theme}
            />
          </div>
        </div>
      )}

      <div
        className={cn(
          "rounded-lg border p-6",
          theme === "light"
            ? "border-blue-200 bg-blue-50"
            : "border-blue-800 bg-blue-900/20",
        )}
      >
        <div className="flex items-start space-x-3">
          <div
            className={cn(
              "mt-1 rounded-full p-2",
              theme === "light" ? "bg-blue-100" : "bg-blue-900/40",
            )}
          >
            <Brain
              className={cn(
                "h-5 w-5",
                theme === "light" ? "text-blue-600" : "text-blue-400",
              )}
            />
          </div>
          <div className="flex-1">
            <h4
              className={cn(
                "mb-2 font-semibold",
                theme === "light" ? "text-blue-900" : "text-blue-100",
              )}
            >
              AI Insight
            </h4>
            {latestInsight ? (
              <>
                <span
                  className={cn(
                    "mb-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
                    severityTone === "high"
                      ? theme === "light"
                        ? "bg-red-100 text-red-600"
                        : "bg-red-900/40 text-red-200"
                      : severityTone === "medium"
                        ? theme === "light"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-yellow-900/40 text-yellow-200"
                        : theme === "light"
                          ? "bg-green-100 text-green-700"
                          : "bg-green-900/40 text-green-200",
                  )}
                >
                  {severityLabel} priority
                </span>
                <p
                  className={cn(
                    "text-sm",
                    theme === "light" ? "text-blue-800" : "text-blue-200",
                  )}
                >
                  {latestInsight.description}
                </p>
              </>
            ) : (
              <p
                className={cn(
                  "text-sm",
                  theme === "light" ? "text-blue-800" : "text-blue-200",
                )}
              >
                No insights yet — keep browsing to generate personalized
                guidance.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  theme,
  color,
}) => {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    green: "text-green-600 dark:text-green-400",
    orange: "text-orange-600 dark:text-orange-400",
    pink: "text-pink-600 dark:text-pink-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-shadow hover:shadow-md",
        theme === "light"
          ? "border-gray-200 bg-white"
          : "border-gray-700 bg-gray-800",
      )}
    >
      <div className={cn("mb-2", colorClasses[color])}>{icon}</div>
      <p
        className={cn(
          "mb-1 text-sm",
          theme === "light" ? "text-gray-600" : "text-gray-400",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "text-2xl font-bold",
          theme === "light" ? "text-gray-900" : "text-white",
        )}
      >
        {value}
      </p>
    </div>
  );
};

const MetricItem: React.FC<MetricItemProps> = ({ label, value, theme }) => (
  <div>
    <p
      className={cn(
        "text-sm",
        theme === "light" ? "text-gray-600" : "text-gray-400",
      )}
    >
      {label}
    </p>
    <p
      className={cn(
        "text-xl font-semibold",
        theme === "light" ? "text-gray-900" : "text-white",
      )}
    >
      {value}
    </p>
  </div>
);

export { Dashboard };
