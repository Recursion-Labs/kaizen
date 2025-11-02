import "@src/Popup.css";
import React, { useState, useEffect } from "react";
import { useStorage, withErrorBoundary, withSuspense } from "@extension/shared";
import { exampleThemeStorage } from "@extension/storage";
import { cn, ErrorDisplay, LoadingSpinner } from "@extension/ui";

interface QuickStats {
  todayTime: number;
  activeSessions: number;
  productivityScore: number;
  recentInsight?: string;
}

const Popup = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_PRODUCTIVITY_STATS',
      });

      if (response.success) {
        const data = response.stats;
        setStats({
          todayTime: data.todayStats.totalTime,
          activeSessions: data.sessionCounts.time + data.sessionCounts.shopping + data.sessionCounts.doomscrolling,
          productivityScore: data.productivityScore,
          recentInsight: data.insights[0]?.description,
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDashboard = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      chrome.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL', tabId: tab.id });
    }
  };

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className={cn("w-[400px] min-h-[500px]", isLight ? "bg-white" : "bg-gray-900")}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className={cn("text-2xl font-bold mb-1", isLight ? "text-gray-900" : "text-white")}>
            🧘 Kaizen
          </h1>
          <p className={cn("text-sm", isLight ? "text-gray-600" : "text-gray-400")}>
            Your mindful browsing companion
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          </div>
        ) : stats ? (
          <>
            {/* Productivity Score */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white text-center">
              <p className="text-sm opacity-90 mb-1">Today's Mindfulness Score</p>
              <p className="text-5xl font-bold">{stats.productivityScore}</p>
              <p className="text-xs opacity-80 mt-2">
                {stats.productivityScore >= 70 ? '✨ Excellent!' : stats.productivityScore >= 40 ? '🎯 Good progress' : '💭 Keep trying'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className={cn("rounded-lg p-4 border", isLight ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700")}>
                <p className={cn("text-xs mb-1", isLight ? "text-gray-600" : "text-gray-400")}>Time Today</p>
                <p className={cn("text-2xl font-bold", isLight ? "text-gray-900" : "text-white")}>
                  {formatTime(stats.todayTime)}
                </p>
              </div>
              <div className={cn("rounded-lg p-4 border", isLight ? "bg-gray-50 border-gray-200" : "bg-gray-800 border-gray-700")}>
                <p className={cn("text-xs mb-1", isLight ? "text-gray-600" : "text-gray-400")}>Active Sessions</p>
                <p className={cn("text-2xl font-bold", isLight ? "text-gray-900" : "text-white")}>
                  {stats.activeSessions}
                </p>
              </div>
            </div>

            {/* Recent Insight */}
            {stats.recentInsight && (
              <div className={cn("rounded-lg p-4 border", isLight ? "bg-blue-50 border-blue-200" : "bg-blue-900/20 border-blue-800")}>
                <p className={cn("text-xs font-semibold mb-2", isLight ? "text-blue-900" : "text-blue-300")}>💡 Latest Insight</p>
                <p className={cn("text-sm", isLight ? "text-blue-800" : "text-blue-200")}>
                  {stats.recentInsight}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={openDashboard}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
              >
                📊 Open Full Dashboard
              </button>
              <button
                onClick={loadQuickStats}
                className={cn(
                  "w-full py-2 font-medium rounded-lg transition-colors",
                  isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                )}
              >
                🔄 Refresh Stats
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className={cn("text-sm", isLight ? "text-gray-600" : "text-gray-400")}>
              No data yet. Start browsing mindfully!
            </p>
          </div>
        )}

        {/* Theme Toggle */}
        <div className="flex items-center justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => exampleThemeStorage.toggle()}
            className={cn(
              "text-xs px-3 py-1 rounded-full transition-colors",
              isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            )}
          >
            {isLight ? '🌙' : '☀️'} Toggle Theme
          </button>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Popup, <LoadingSpinner />),
  ErrorDisplay,
);
