import { cn } from "@extension/ui";
import {
  Clock,
  Brain,
  MessageCircle,
  Flame,
  BarChart3,
  Settings,
  Target,
  FileText,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { useState, useEffect } from "react";
import type React from "react";

interface OverviewProps {
  theme: "light" | "dark";
}

interface QuickStats {
  timeOnlineToday: number; // minutes
  patternsDetected: number;
  nudgesSent: number;
  focusStreak: number; // days
}

const Overview: React.FC<OverviewProps> = ({ theme }) => {
  const [stats, setStats] = useState<QuickStats>({
    timeOnlineToday: 0,
    patternsDetected: 0,
    nudgesSent: 0,
    focusStreak: 0,
  });

  const [todayInsight, setTodayInsight] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      // TODO: Replace with actual data from BehaviorEngine when available
      // Mock data for now
      setStats({
        timeOnlineToday: 127,
        patternsDetected: 3,
        nudgesSent: 2,
        focusStreak: 5,
      });

      setTodayInsight(
        "You're most focused between 9-11 AM. Consider scheduling important tasks during this window.",
      );
    } catch (error) {
      console.error("Failed to load overview data:", error);
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
          className={cn(theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted")}
        >
          Loading overview...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1
          className={cn(
            "text-3xl font-bold",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Welcome to Kaizen
        </h1>
        <p
          className={cn(
            "text-lg",
            theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
          )}
        >
          Your AI Mirror for Digital Balance
        </p>
      </div>

      {/* Philosophy Quote */}
      <div
        className={cn(
          "rounded-lg p-6",
          theme === "light"
            ? "bg-kaizen-surface border-kaizen-border"
            : "bg-kaizen-dark-surface border-kaizen-border",
        )}
      >
        <div className="flex items-start space-x-3">
          <span className="text-2xl">💭</span>
          <div className="flex-1">
            <p
              className={cn(
                "italic",
                theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
              )}
            >
              "Kaizen isn't about limiting freedom — it's about amplifying
              awareness. A quiet companion that helps you grow a little every
              day."
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Clock className="h-6 w-6" />}
          label="Time Online Today"
          value={formatTime(stats.timeOnlineToday)}
          theme={theme}
        />
        <StatCard
          icon={<Brain className="h-6 w-6" />}
          label="Patterns Detected"
          value={stats.patternsDetected.toString()}
          theme={theme}
        />
        <StatCard
          icon={<MessageCircle className="h-6 w-6" />}
          label="Nudges Sent"
          value={stats.nudgesSent.toString()}
          theme={theme}
        />
        <StatCard
          icon={<Flame className="h-6 w-6" />}
          label="Focus Streak"
          value={`${stats.focusStreak} days`}
          theme={theme}
        />
      </div>

      {/* Today's Insight Card */}
      <div
        className={cn(
          "rounded-lg border p-6 shadow-sm",
          theme === "light"
            ? "border-kaizen-border bg-kaizen-surface"
            : "border-kaizen-border bg-kaizen-dark-surface",
        )}
      >
        <div className="mb-3 flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-kaizen-accent" />
          <h2
            className={cn(
              "text-lg font-semibold",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
            )}
          >
            Today's Insight
          </h2>
        </div>
        <p
          className={cn(
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          {todayInsight}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2
          className={cn(
            "text-xl font-semibold",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <ActionButton
            icon={<BarChart3 className="h-6 w-6" />}
            label="View Reports"
            description="See your behavioral analytics"
            onClick={() => {
              /* TODO: Navigate to reports */
            }}
            theme={theme}
          />
          <ActionButton
            icon={<Settings className="h-6 w-6" />}
            label="Customize Settings"
            description="Adjust nudges and patterns"
            onClick={() => {
              /* TODO: Navigate to customization */
            }}
            theme={theme}
          />
          <ActionButton
            icon={<Target className="h-6 w-6" />}
            label="Set Goals"
            description="Define your focus objectives"
            onClick={() => {
              /* TODO: Open goals modal */
            }}
            theme={theme}
          />
          <ActionButton
            icon={<FileText className="h-6 w-6" />}
            label="Add Reflection"
            description="Journal your thoughts"
            onClick={() => {
              /* TODO: Open remarks modal */
            }}
            theme={theme}
          />
        </div>
      </div>

      {/* Getting Started Tips (for new users) */}
      <div
        className={cn(
          "rounded-lg border p-6",
          theme === "light"
            ? "border-kaizen-border bg-kaizen-surface"
            : "border-kaizen-border bg-kaizen-dark-surface",
        )}
      >
        <div className="mb-3 flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-kaizen-accent" />
          <h3
            className={cn(
              "font-semibold",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
            )}
          >
            Getting Started
          </h3>
        </div>
        <ul
          className={cn(
            "space-y-2 text-sm",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          <li className="flex items-start">
            <span className="mr-2">1.</span>
            <span>
              Enable patterns you want to track in{" "}
              <span className="font-medium">Behavior Recognition</span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">2.</span>
            <span>
              Customize nudge tone and timing in{" "}
              <span className="font-medium">Smart Nudges</span>
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">3.</span>
            <span>
              Check your weekly report every Sunday for insights and trends
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Helper Components
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  theme: "light" | "dark";
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, theme }) => (
  <div
    className={cn(
      "rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md",
      theme === "light"
        ? "border-kaizen-border bg-kaizen-surface"
        : "border-kaizen-border bg-kaizen-dark-surface",
    )}
  >
    <div className="mb-2 flex items-center justify-between">
      <div
        className={cn(
          theme === "light" ? "text-kaizen-accent" : "text-kaizen-dark-text",
        )}
      >
        {icon}
      </div>
    </div>
    <div className="space-y-1">
      <p
        className={cn(
          "text-sm",
          theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "text-2xl font-bold",
          theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
        )}
      >
        {value}
      </p>
    </div>
  </div>
);

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  theme: "light" | "dark";
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  description,
  onClick,
  theme,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-start space-x-3 rounded-lg border p-4 text-left transition-all hover:shadow-md",
      theme === "light"
        ? "border-kaizen-border bg-kaizen-surface hover:border-kaizen-accent"
        : "border-kaizen-border bg-kaizen-dark-surface hover:border-kaizen-accent",
    )}
  >
    <div
      className={cn(
        theme === "light" ? "text-kaizen-accent" : "text-kaizen-dark-text",
      )}
    >
      {icon}
    </div>
    <div className="flex-1">
      <h3
        className={cn(
          "font-semibold",
          theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
        )}
      >
        {label}
      </h3>
      <p
        className={cn(
          "text-sm",
          theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
        )}
      >
        {description}
      </p>
    </div>
  </button>
);

export { Overview };
