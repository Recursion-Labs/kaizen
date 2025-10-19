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

interface OverviewPanelProps {
  theme: "light" | "dark";
}

interface QuickStats {
  timeOnlineToday: number; // minutes
  patternsDetected: number;
  nudgesSent: number;
  focusStreak: number; // days
}

const OverviewPanel: React.FC<OverviewPanelProps> = () => {
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
        <div className="text-gray-500 dark:text-gray-400">
          Loading overview...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to Kaizen
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your AI Mirror for Digital Balance
        </p>
      </div>

      {/* Philosophy Quote */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">💭</span>
          <div className="flex-1">
            <p className="italic text-gray-700 dark:text-gray-300">
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
        />
        <StatCard
          icon={<Brain className="h-6 w-6" />}
          label="Patterns Detected"
          value={stats.patternsDetected.toString()}
        />
        <StatCard
          icon={<MessageCircle className="h-6 w-6" />}
          label="Nudges Sent"
          value={stats.nudgesSent.toString()}
        />
        <StatCard
          icon={<Flame className="h-6 w-6" />}
          label="Focus Streak"
          value={`${stats.focusStreak} days`}
        />
      </div>

      {/* Today's Insight Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-3 flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Today's Insight
          </h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300">{todayInsight}</p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
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
          />
          <ActionButton
            icon={<Settings className="h-6 w-6" />}
            label="Customize Settings"
            description="Adjust nudges and patterns"
            onClick={() => {
              /* TODO: Navigate to customization */
            }}
          />
          <ActionButton
            icon={<Target className="h-6 w-6" />}
            label="Set Goals"
            description="Define your focus objectives"
            onClick={() => {
              /* TODO: Open goals modal */
            }}
          />
          <ActionButton
            icon={<FileText className="h-6 w-6" />}
            label="Add Reflection"
            description="Journal your thoughts"
            onClick={() => {
              /* TODO: Open remarks modal */
            }}
          />
        </div>
      </div>

      {/* Getting Started Tips (for new users) */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="mb-3 flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            Getting Started
          </h3>
        </div>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
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
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
    <div className="mb-2 flex items-center justify-between">
      <div className="text-blue-600 dark:text-blue-400">{icon}</div>
    </div>
    <div className="space-y-1">
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
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
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  description,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex items-start space-x-3 rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
  >
    <div className="text-blue-600 dark:text-blue-400">{icon}</div>
    <div className="flex-1">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
        {label}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </button>
);

export { OverviewPanel };
