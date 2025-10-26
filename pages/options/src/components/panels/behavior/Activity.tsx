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
          className={cn(theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted")}
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
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
            )}
          >
            Activity Chart
          </h2>
          <p
            className={cn(
              "text-sm",
              theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
            )}
          >
            Visualize your browsing patterns over time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3
            className={cn(
              "h-6 w-6",
              theme === "light" ? "text-kaizen-accent" : "text-kaizen-dark-text",
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
                  ? "bg-kaizen-accent text-kaizen-light-bg hover:bg-kaizen-accent/80"
                  : "bg-kaizen-accent-dark text-kaizen-dark-text hover:bg-kaizen-accent/80",
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
              theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
            )}
          />
          <div className={cn(
            "flex rounded-lg border",
            theme === "light" ? "border-kaizen-border" : "border-kaizen-border"
          )}>
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
              theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
            )}
          />
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm",
              theme === "light"
                ? "border-kaizen-border bg-kaizen-surface text-kaizen-light-text"
                : "border-kaizen-border bg-kaizen-dark-surface text-kaizen-dark-text",
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
            ? "border-kaizen-border bg-kaizen-surface"
            : "border-kaizen-border bg-kaizen-dark-surface",
        )}
      >
        {/* Chart Legend */}
        <div className="mb-4 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span
              className={cn(
                "text-sm",
                theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
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
                theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
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
                  stroke={theme === "light" ? "#A1A2AB" : "#3B3A4A"} 
                />
                <XAxis 
                  dataKey="label" 
                  stroke={theme === "light" ? "#575669" : "#A1A2AB"}
                  fontSize={12}
                />
                <YAxis 
                  stroke={theme === "light" ? "#575669" : "#A1A2AB"}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "light" ? "#F5F9F8" : "#3B3A4A",
                    border: theme === "light" ? "1px solid #A1A2AB" : "1px solid #575669",
                    borderRadius: "6px",
                    color: theme === "light" ? "#575669" : "#F5F9F8",
                  }}
                  labelStyle={{ color: theme === "light" ? "#575669" : "#F5F9F8" }}
                />
                <Bar dataKey="productiveTime" stackId="a" fill="#10b981" name="Productive (min)" />
                <Bar dataKey="distractedTime" stackId="a" fill="#ef4444" name="Distracted (min)" />
              </BarChart>
            ) : chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === "light" ? "#A1A2AB" : "#3B3A4A"} 
                />
                <XAxis 
                  dataKey="label" 
                  stroke={theme === "light" ? "#575669" : "#A1A2AB"}
                  fontSize={12}
                />
                <YAxis 
                  stroke={theme === "light" ? "#575669" : "#A1A2AB"}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "light" ? "#F5F9F8" : "#3B3A4A",
                    border: theme === "light" ? "1px solid #A1A2AB" : "1px solid #575669",
                    borderRadius: "6px",
                    color: theme === "light" ? "#575669" : "#F5F9F8",
                  }}
                  labelStyle={{ color: theme === "light" ? "#575669" : "#F5F9F8" }}
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
                  stroke={theme === "light" ? "#A1A2AB" : "#3B3A4A"} 
                />
                <XAxis 
                  dataKey="label" 
                  stroke={theme === "light" ? "#575669" : "#A1A2AB"}
                  fontSize={12}
                />
                <YAxis 
                  stroke={theme === "light" ? "#575669" : "#A1A2AB"}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "light" ? "#F5F9F8" : "#3B3A4A",
                    border: theme === "light" ? "1px solid #A1A2AB" : "1px solid #575669",
                    borderRadius: "6px",
                    color: theme === "light" ? "#575669" : "#F5F9F8",
                  }}
                  labelStyle={{ color: theme === "light" ? "#575669" : "#F5F9F8" }}
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
            ? "border-kaizen-border bg-kaizen-light-bg"
            : "border-kaizen-border bg-kaizen-dark-bg",
        )}
      >
        <h3
          className={cn(
            "mb-3 font-semibold",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
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
        ? theme === "light"
          ? "bg-kaizen-accent text-kaizen-light-bg"
          : "bg-kaizen-accent-dark text-kaizen-dark-text"
        : theme === "light"
          ? "text-kaizen-light-text hover:bg-kaizen-surface"
          : "text-kaizen-dark-text hover:bg-kaizen-dark-surface",
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
        theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
      )}
    >
      {label}
    </p>
    <p
      className={cn(
        "text-lg font-semibold",
        theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
      )}
    >
      {value}
    </p>
  </div>
);

export { Activity };
