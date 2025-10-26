import { cn } from "@extension/ui";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import type {
  ActivityChartProps,
  ChartDataPoint,
  ChartType,
  SummaryItemProps,
  TimeRange,
  TimeRangeButtonProps,
} from "./types";
import type React from "react";

const Activity: React.FC<ActivityChartProps> = ({ theme }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChartData = useCallback(async (withSpinner = false) => {
    if (withSpinner) {
      setLoading(true);
    }
    setError(null);

    try {
      if (!chrome?.runtime?.sendMessage) {
        throw new Error("Activity data is unavailable outside of the extension context.");
      }

      const response = await chrome.runtime.sendMessage({
        type: "GET_HISTORICAL_ACTIVITY",
        timeRange,
      });

      if (!response?.success || !response.data) {
        throw new Error(response?.error ?? "Unable to load activity data.");
      }

      setChartData(response.data);
    } catch (err) {
      console.error("Failed to load chart data:", err);
      const message = err instanceof Error ? err.message : "Failed to load activity data.";
      setError(message);
    } finally {
      if (withSpinner) {
        setLoading(false);
      }
    }
  }, [timeRange]);

  useEffect(() => {
    void loadChartData(true);
    const intervalId = window.setInterval(() => {
      void loadChartData();
    }, 15000); // Update every 15 seconds

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadChartData]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div
          className={cn(theme === "light" ? "text-gray-500" : "text-gray-400")}
        >
          Loading chart...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={cn(
              "text-2xl font-bold",
              theme === "light" ? "text-gray-900" : "text-white",
            )}
          >
            Activity Chart
          </h2>
          <p
            className={cn(
              "text-sm",
              theme === "light" ? "text-gray-600" : "text-gray-400",
            )}
          >
            Visualize your browsing patterns over time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3
            className={cn(
              "h-6 w-6",
              theme === "light" ? "text-blue-600" : "text-blue-400",
            )}
          />
        </div>
      </div>

      {/* Error Display */}
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
              onClick={() => loadChartData(true)}
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

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          <Calendar
            className={cn(
              "h-5 w-5",
              theme === "light" ? "text-gray-600" : "text-gray-400",
            )}
          />
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
            <TimeRangeButton
              label="Day"
              active={timeRange === "day"}
              onClick={() => setTimeRange("day")}
              theme={theme}
            />
            <TimeRangeButton
              label="Week"
              active={timeRange === "week"}
              onClick={() => setTimeRange("week")}
              theme={theme}
            />
            <TimeRangeButton
              label="Month"
              active={timeRange === "month"}
              onClick={() => setTimeRange("month")}
              theme={theme}
            />
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="flex items-center space-x-2">
          <TrendingUp
            className={cn(
              "h-5 w-5",
              theme === "light" ? "text-gray-600" : "text-gray-400",
            )}
          />
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm",
              theme === "light"
                ? "border-gray-300 bg-white text-gray-900"
                : "border-gray-600 bg-gray-800 text-white",
            )}
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <div
        className={cn(
          "rounded-lg border p-6",
          theme === "light"
            ? "border-gray-200 bg-white"
            : "border-gray-700 bg-gray-800",
        )}
      >
        {/* Chart Legend */}
        <div className="mb-4 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span
              className={cn(
                "text-sm",
                theme === "light" ? "text-gray-700" : "text-gray-300",
              )}
            >
              Productive
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span
              className={cn(
                "text-sm",
                theme === "light" ? "text-gray-700" : "text-gray-300",
              )}
            >
              Distracted
            </span>
          </div>
        </div>

        {/* Recharts Visualization */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={chartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === "light" ? "#e5e7eb" : "#374151"} 
                />
                <XAxis 
                  dataKey="label" 
                  stroke={theme === "light" ? "#6b7280" : "#9ca3af"}
                  fontSize={12}
                />
                <YAxis 
                  stroke={theme === "light" ? "#6b7280" : "#9ca3af"}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "light" ? "#ffffff" : "#1f2937",
                    border: theme === "light" ? "1px solid #e5e7eb" : "1px solid #374151",
                    borderRadius: "6px",
                    color: theme === "light" ? "#111827" : "#f9fafb",
                  }}
                  labelStyle={{ color: theme === "light" ? "#111827" : "#f9fafb" }}
                />
                <Bar dataKey="productiveTime" stackId="a" fill="#10b981" name="Productive (min)" />
                <Bar dataKey="distractedTime" stackId="a" fill="#ef4444" name="Distracted (min)" />
              </BarChart>
            ) : chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === "light" ? "#e5e7eb" : "#374151"} 
                />
                <XAxis 
                  dataKey="label" 
                  stroke={theme === "light" ? "#6b7280" : "#9ca3af"}
                  fontSize={12}
                />
                <YAxis 
                  stroke={theme === "light" ? "#6b7280" : "#9ca3af"}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "light" ? "#ffffff" : "#1f2937",
                    border: theme === "light" ? "1px solid #e5e7eb" : "1px solid #374151",
                    borderRadius: "6px",
                    color: theme === "light" ? "#111827" : "#f9fafb",
                  }}
                  labelStyle={{ color: theme === "light" ? "#111827" : "#f9fafb" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="productiveTime" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Productive (min)"
                />
                <Line 
                  type="monotone" 
                  dataKey="distractedTime" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Distracted (min)"
                />
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === "light" ? "#e5e7eb" : "#374151"} 
                />
                <XAxis 
                  dataKey="label" 
                  stroke={theme === "light" ? "#6b7280" : "#9ca3af"}
                  fontSize={12}
                />
                <YAxis 
                  stroke={theme === "light" ? "#6b7280" : "#9ca3af"}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "light" ? "#ffffff" : "#1f2937",
                    border: theme === "light" ? "1px solid #e5e7eb" : "1px solid #374151",
                    borderRadius: "6px",
                    color: theme === "light" ? "#111827" : "#f9fafb",
                  }}
                  labelStyle={{ color: theme === "light" ? "#111827" : "#f9fafb" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="productiveTime" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Productive (min)"
                />
                <Area 
                  type="monotone" 
                  dataKey="distractedTime" 
                  stackId="1"
                  stroke="#ef4444" 
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="Distracted (min)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Statistics */}
      <div
        className={cn(
          "rounded-lg border p-4",
          theme === "light"
            ? "border-gray-200 bg-gray-50"
            : "border-gray-700 bg-gray-800/50",
        )}
      >
        <h3
          className={cn(
            "mb-3 font-semibold",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          {timeRange === "week"
            ? "This Week"
            : timeRange === "day"
              ? "Today"
              : "This Month"}{" "}
          Summary
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <SummaryItem
            label="Total Time"
            value={`${chartData.reduce((acc, d) => acc + d.value, 0)}m`}
            theme={theme}
          />
          <SummaryItem
            label="Productive"
            value={`${chartData.reduce((acc, d) => acc + d.productiveTime, 0)}m`}
            theme={theme}
          />
          <SummaryItem
            label="Distracted"
            value={`${chartData.reduce((acc, d) => acc + d.distractedTime, 0)}m`}
            theme={theme}
          />
          <SummaryItem
            label="Avg/Day"
            value={`${Math.round(chartData.reduce((acc, d) => acc + d.value, 0) / chartData.length)}m`}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
};

// Helper Components

const TimeRangeButton: React.FC<TimeRangeButtonProps> = ({
  label,
  active,
  onClick,
  theme,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-1.5 text-sm font-medium transition-colors",
      active
        ? "bg-blue-600 text-white"
        : theme === "light"
          ? "text-gray-700 hover:bg-gray-100"
          : "text-gray-300 hover:bg-gray-700",
    )}
  >
    {label}
  </button>
);

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value, theme }) => (
  <div>
    <p
      className={cn(
        "text-xs",
        theme === "light" ? "text-gray-600" : "text-gray-400",
      )}
    >
      {label}
    </p>
    <p
      className={cn(
        "text-lg font-semibold",
        theme === "light" ? "text-gray-900" : "text-white",
      )}
    >
      {value}
    </p>
  </div>
);

export { Activity };
