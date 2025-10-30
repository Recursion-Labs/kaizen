import React, { useState, useEffect } from 'react';

interface ProductivityStats {
  productivityScore: number;
  todayStats: {
    totalTime: number;
    productiveTime: number;
    distractedTime: number;
    topDomains: Array<{ domain: string; time: number; category: string }>;
  };
  knowledgeGraphStats: {
    nodeCount: number;
    edgeCount: number;
    domainCount: number;
  };
  sessionCounts: {
    time: number;
    shopping: number;
    doomscrolling: number;
  };
  doomscrollMetrics: {
    totalScrollDistance: number;
    averageScrollPerSession: number;
    highSeveritySessions: number;
  };
  insights: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    confidence: number;
    timestamp: number;
  }>;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<ProductivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    loadStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_PRODUCTIVITY_STATS',
      });

      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDistance = (px: number): string => {
    const meters = Math.round(px * 0.0264583); // rough conversion
    if (meters > 1000) {
      return `${(meters / 1000).toFixed(1)}km`;
    }
    return `${meters}m`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        No data available yet. Start browsing to see your patterns!
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Mindful Browsing Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Awareness without judgment, one scroll at a time
          </p>
        </div>
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Productivity Score Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Today's Mindfulness Score</h2>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold">{stats.productivityScore}</span>
          <span className="text-2xl opacity-80">/100</span>
        </div>
        <p className="mt-4 text-indigo-100">
          {stats.productivityScore >= 70
            ? '✨ Excellent focus and balance today!'
            : stats.productivityScore >= 40
            ? '🎯 Making good progress, keep it up!'
            : '💭 Remember, every moment is a chance to refocus'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⏱️</span>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Total Time</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatTime(stats.todayStats.totalTime)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Today's browsing</p>
        </div>

        {/* Active Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📊</span>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Active Sessions</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.sessionCounts.time + stats.sessionCounts.shopping + stats.sessionCounts.doomscrolling}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Currently monitoring</p>
        </div>

        {/* Scroll Distance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📜</span>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Scroll Distance</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatDistance(stats.doomscrollMetrics.totalScrollDistance)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total scrolled today</p>
        </div>
      </div>

      {/* Top Domains */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🌐 Top Visited Domains
        </h3>
        <div className="space-y-3">
          {stats.todayStats.topDomains.slice(0, 5).map((domain, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {domain.domain}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                    {domain.category}
                  </span>
                </div>
                <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500"
                    style={{
                      width: `${(domain.time / stats.todayStats.totalTime) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <span className="ml-4 text-gray-600 dark:text-gray-400 font-medium">
                {formatTime(domain.time)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          💡 Recent Insights
        </h3>
        <div className="space-y-3">
          {stats.insights.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No insights yet. Keep browsing mindfully!
            </p>
          ) : (
            stats.insights.slice(0, 5).map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <span className="text-2xl flex-shrink-0">
                  {insight.severity === 'high' ? '⚠️' : insight.severity === 'medium' ? '⚡' : '💭'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityBadge(insight.severity)}`}>
                      {insight.severity}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(insight.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {insight.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Confidence: {Math.round(insight.confidence * 100)}%
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Knowledge Graph Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🧠 Knowledge Graph
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.knowledgeGraphStats.nodeCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Nodes</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.knowledgeGraphStats.edgeCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Connections</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {stats.knowledgeGraphStats.domainCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Domains</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
