import { cn } from "@extension/ui";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import type React from "react";

interface ActivityChartProps {
  theme: "light" | "dark";
}

type TimeRange = "day" | "week" | "month";
type ChartType = "line" | "bar" | "area";

interface ChartDataPoint {
  label: string;
  value: number;
  productiveTime: number;
  distractedTime: number;
}

export const Activity: React.FC<ActivityChartProps> = ({ theme }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, [timeRange]);

  const loadChartData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual BehaviorStorage calls
      // const storage = await behaviorStorage.initialize();
      // const data = await storage.getMetricsRange(startDate, endDate);

      // Mock data for development
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (timeRange === "week") {
        setChartData([
          { label: "Mon", value: 120, productiveTime: 80, distractedTime: 40 },
          { label: "Tue", value: 150, productiveTime: 110, distractedTime: 40 },
          { label: "Wed", value: 135, productiveTime: 95, distractedTime: 40 },
          { label: "Thu", value: 180, productiveTime: 130, distractedTime: 50 },
          { label: "Fri", value: 145, productiveTime: 100, distractedTime: 45 },
          { label: "Sat", value: 90, productiveTime: 60, distractedTime: 30 },
          { label: "Sun", value: 75, productiveTime: 50, distractedTime: 25 },
        ]);
      }
    } catch (error) {
      console.error("Failed to load chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

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

        {/* Simple Bar Chart Visualization */}
        <div className="space-y-4">
          {chartData.map((point, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span
                  className={cn(
                    "font-medium",
                    theme === "light" ? "text-gray-700" : "text-gray-300",
                  )}
                >
                  {point.label}
                </span>
                <span
                  className={cn(
                    theme === "light" ? "text-gray-600" : "text-gray-400",
                  )}
                >
                  {point.value}m
                </span>
              </div>
              <div className="relative h-8 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                {/* Productive Time */}
                <div
                  className="absolute left-0 top-0 h-full bg-green-500 transition-all"
                  style={{
                    width: `${(point.productiveTime / maxValue) * 100}%`,
                  }}
                />
                {/* Distracted Time */}
                <div
                  className="absolute h-full bg-red-500 transition-all"
                  style={{
                    left: `${(point.productiveTime / maxValue) * 100}%`,
                    width: `${(point.distractedTime / maxValue) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
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

interface TimeRangeButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  theme: "light" | "dark";
}

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

interface SummaryItemProps {
  label: string;
  value: string;
  theme: "light" | "dark";
}

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
