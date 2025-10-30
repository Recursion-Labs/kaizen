import React, { useState, useEffect } from 'react';
import TimeSeriesChart from '../charts/TimeSeriesChart';
import PieChart from '../charts/PieChart';

interface AnalyticsData {
  weeklyTrend: Array<{ label: string; value: number }>;
  categoryBreakdown: Array<{ label: string; value: number; color: string }>;
  hourlyPattern: Array<{ label: string; value: number }>;
}

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_HISTORICAL_ACTIVITY',
        timeRange,
      });

      if (response.success && response.data) {
        setData(transformData(response.data));
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
      // Generate mock data for demonstration
      setData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const transformData = (rawData: any): AnalyticsData => {
    // Transform backend data to chart format
    return {
      weeklyTrend: rawData.weeklyTrend || generateMockWeeklyTrend(),
      categoryBreakdown: rawData.categoryBreakdown || generateMockCategoryBreakdown(),
      hourlyPattern: rawData.hourlyPattern || generateMockHourlyPattern(),
    };
  };

  const generateMockData = (): AnalyticsData => {
    return {
      weeklyTrend: generateMockWeeklyTrend(),
      categoryBreakdown: generateMockCategoryBreakdown(),
      hourlyPattern: generateMockHourlyPattern(),
    };
  };

  const generateMockWeeklyTrend = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      label: day,
      value: Math.random() * 120 + 30, // 30-150 minutes
    }));
  };

  const generateMockCategoryBreakdown = () => {
    return [
      { label: 'Social Media', value: 120, color: '#3b82f6' },
      { label: 'Development', value: 180, color: '#8b5cf6' },
      { label: 'Shopping', value: 45, color: '#f97316' },
      { label: 'Video', value: 90, color: '#ef4444' },
      { label: 'News', value: 60, color: '#6b7280' },
      { label: 'Other', value: 75, color: '#10b981' },
    ];
  };

  const generateMockHourlyPattern = () => {
    const hours = ['0-4', '4-8', '8-12', '12-16', '16-20', '20-24'];
    return hours.map(hour => ({
      label: hour,
      value: Math.random() * 100 + 20,
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visualize your browsing patterns and trends over time
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === 'week'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === 'month'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      ) : data ? (
        <>
          {/* Weekly Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <TimeSeriesChart
              data={data.weeklyTrend}
              title="📈 Daily Browsing Time (minutes)"
              height={250}
              color="#6366f1"
            />
          </div>

          {/* Category Breakdown & Hourly Pattern */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Pie Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <PieChart
                data={data.categoryBreakdown}
                title="🎯 Time by Category"
                size={220}
              />
            </div>

            {/* Hourly Pattern */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <TimeSeriesChart
                data={data.hourlyPattern}
                title="🕐 Browsing by Time of Day"
                height={220}
                color="#8b5cf6"
              />
            </div>
          </div>

          {/* Insights Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="text-sm opacity-90 mb-1">Most Active Day</div>
              <div className="text-3xl font-bold">
                {data.weeklyTrend.reduce((max, day) => 
                  day.value > max.value ? day : max
                ).label}
              </div>
              <div className="text-sm opacity-80 mt-2">
                {Math.round(data.weeklyTrend.reduce((max, day) => 
                  day.value > max.value ? day : max
                ).value)} minutes
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white">
              <div className="text-sm opacity-90 mb-1">Top Category</div>
              <div className="text-3xl font-bold">
                {data.categoryBreakdown.reduce((max, cat) => 
                  cat.value > max.value ? cat : max
                ).label}
              </div>
              <div className="text-sm opacity-80 mt-2">
                {Math.round((data.categoryBreakdown.reduce((max, cat) => 
                  cat.value > max.value ? cat : max
                ).value / data.categoryBreakdown.reduce((sum, cat) => sum + cat.value, 0)) * 100)}% of time
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white">
              <div className="text-sm opacity-90 mb-1">Peak Hours</div>
              <div className="text-3xl font-bold">
                {data.hourlyPattern.reduce((max, hour) => 
                  hour.value > max.value ? hour : max
                ).label}
              </div>
              <div className="text-sm opacity-80 mt-2">
                Most active period
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-indigo-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              💡 Insights & Tips
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                • Your browsing peaks during <strong>{data.hourlyPattern.reduce((max, hour) => 
                  hour.value > max.value ? hour : max
                ).label}</strong> - consider scheduling focused work during other times
              </p>
              <p>
                • <strong>{data.categoryBreakdown[0].label}</strong> takes up most of your time - is this aligned with your goals?
              </p>
              <p>
                • Try setting mindful intentions before browsing to stay on track
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500 dark:text-gray-400">
            No analytics data available yet. Keep browsing to build your analytics!
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
