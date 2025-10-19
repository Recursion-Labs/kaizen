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
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import type React from "react";


interface DashboardProps {
  theme: "light" | "dark";
}

type BehaviorView = "overview" | "activity" | "reports" | "remarks" | "goals";

/**
 * Dashboard - Main container that houses ALL behavior analytics features
 * All sub-components (Activity, Reports, Notes, Goals) are rendered here based on tabs
 */
export const Dashboard: React.FC<DashboardProps> = ({ theme }) => {
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
            : "bg-gray-800 border-gray-700"
        )}
      >
        <div className="px-6 py-4">
          <h1
            className={cn(
              "text-2xl font-bold mb-4",
              theme === "light" ? "text-gray-900" : "text-white"
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
                      : "text-gray-400 hover:bg-gray-700/50"
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

interface DashboardStats {
  totalTimeToday: number;
  patternsDetected: number;
  nudgesReceived: number;
  productivityScore: number;
  focusStreak: number;
  goalsCompleted: number;
}

interface TodayMetrics {
  date: string;
  totalTime: number;
  productiveTime: number;
  distractedTime: number;
  sitesVisited: number;
  tabsSwitched: number;
  interventionCount: number;
}

const OverviewTab: React.FC<{ theme: "light" | "dark" }> = ({ theme }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTimeToday: 0,
    patternsDetected: 0,
    nudgesReceived: 0,
    productivityScore: 0,
    focusStreak: 0,
    goalsCompleted: 0,
  });

  const [loading, setLoading] = useState(true);
  const [todayMetrics, setTodayMetrics] = useState<TodayMetrics | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // TODO: Replace with actual BehaviorStorage calls
      await new Promise((resolve) => setTimeout(resolve, 500));

      setStats({
        totalTimeToday: 147,
        patternsDetected: 4,
        nudgesReceived: 2,
        productivityScore: 78,
        focusStreak: 5,
        goalsCompleted: 3,
      });

      setTodayMetrics({
        date: new Date().toISOString().split("T")[0],
        totalTime: 147,
        productiveTime: 98,
        distractedTime: 49,
        sitesVisited: 23,
        tabsSwitched: 45,
        interventionCount: 2,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

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
      {/* Quick Stats Grid */}
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
          label="Nudges Received"
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
          label="Focus Streak"
          value={`${stats.focusStreak} days`}
          theme={theme}
          color="pink"
        />
        <StatCard
          icon={<Calendar className="h-5 w-5" />}
          label="Goals Completed"
          value={`${stats.goalsCompleted}/5`}
          theme={theme}
          color="indigo"
        />
      </div>

      {/* Today's Breakdown */}
      {todayMetrics && (
        <div
          className={cn(
            "rounded-lg border p-6",
            theme === "light"
              ? "border-gray-200 bg-white"
              : "border-gray-700 bg-gray-800"
          )}
        >
          <h3
            className={cn(
              "mb-4 text-lg font-semibold",
              theme === "light" ? "text-gray-900" : "text-white"
            )}
          >
            Today's Activity
          </h3>

          {/* Productive vs Distracted Time Bar */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span
                className={cn(
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                )}
              >
                Productive: {formatTime(todayMetrics.productiveTime)}
              </span>
              <span
                className={cn(
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                )}
              >
                Distracted: {formatTime(todayMetrics.distractedTime)}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${(todayMetrics.productiveTime / todayMetrics.totalTime) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <MetricItem
              label="Sites Visited"
              value={todayMetrics.sitesVisited}
              theme={theme}
            />
            <MetricItem
              label="Tabs Switched"
              value={todayMetrics.tabsSwitched}
              theme={theme}
            />
            <MetricItem
              label="Interventions"
              value={todayMetrics.interventionCount}
              theme={theme}
            />
            <MetricItem
              label="Focus Time"
              value={`${Math.round((todayMetrics.productiveTime / todayMetrics.totalTime) * 100)}%`}
              theme={theme}
            />
          </div>
        </div>
      )}

      {/* AI Insight */}
      <div
        className={cn(
          "rounded-lg border p-6",
          theme === "light"
            ? "border-blue-200 bg-blue-50"
            : "border-blue-800 bg-blue-900/20"
        )}
      >
        <div className="flex items-start space-x-3">
          <div
            className={cn(
              "mt-1 rounded-full p-2",
              theme === "light" ? "bg-blue-100" : "bg-blue-900/40"
            )}
          >
            <Brain
              className={cn(
                "h-5 w-5",
                theme === "light" ? "text-blue-600" : "text-blue-400"
              )}
            />
          </div>
          <div className="flex-1">
            <h4
              className={cn(
                "mb-2 font-semibold",
                theme === "light" ? "text-blue-900" : "text-blue-100"
              )}
            >
              AI Insight
            </h4>
            <p
              className={cn(
                "text-sm",
                theme === "light" ? "text-blue-800" : "text-blue-200"
              )}
            >
              You're most productive between 9-11 AM. Consider scheduling
              important tasks during this window. Your focus streak of 5 days is
              impressive - keep it up!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  theme: "light" | "dark";
  color: "blue" | "purple" | "green" | "orange" | "pink" | "indigo";
}

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
          : "border-gray-700 bg-gray-800"
      )}
    >
      <div className={cn("mb-2", colorClasses[color])}>{icon}</div>
      <p
        className={cn(
          "mb-1 text-sm",
          theme === "light" ? "text-gray-600" : "text-gray-400"
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "text-2xl font-bold",
          theme === "light" ? "text-gray-900" : "text-white"
        )}
      >
        {value}
      </p>
    </div>
  );
};

interface MetricItemProps {
  label: string;
  value: number | string;
  theme: "light" | "dark";
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value, theme }) => (
  <div>
    <p
      className={cn(
        "text-sm",
        theme === "light" ? "text-gray-600" : "text-gray-400"
      )}
    >
      {label}
    </p>
    <p
      className={cn(
        "text-xl font-semibold",
        theme === "light" ? "text-gray-900" : "text-white"
      )}
    >
      {value}
    </p>
  </div>
);
