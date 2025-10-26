import { cn } from "@extension/ui";
import type React from "react";

interface AnalyticsProps {
  theme: "light" | "dark";
}

// Mock data for analytics - would come from behavior engine in production
const mockAnalytics = {
  today: {
    totalTime: 180, // minutes
    productiveTime: 120,
    distractionTime: 45,
    interventions: 8,
    topSites: [
      { name: "github.com", duration: 45, count: 12 },
      { name: "stackoverflow.com", duration: 35, count: 8 },
      { name: "youtube.com", duration: 25, count: 5 },
      { name: "twitter.com", duration: 20, count: 15 },
      { name: "medium.com", duration: 15, count: 3 },
    ],
    behaviors: [
      { type: "doomscrolling", count: 3, duration: 25 },
      { type: "shopping", count: 1, duration: 15 },
      { type: "multitasking", count: 5, duration: 40 },
    ],
  },
  thisWeek: {
    totalTime: 1320, // minutes (22 hours)
    productiveTime: 900,
    distractionTime: 300,
    interventions: 52,
  },
  thisMonth: {
    totalTime: 5760, // minutes (96 hours)
    productiveTime: 4200,
    distractionTime: 1200,
    interventions: 210,
  },
};

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  theme: "light" | "dark";
  trend?: number;
}> = ({ label, value, unit, icon, theme, trend }) => (
  <div
    className={cn(
      "p-6 rounded-lg border",
      theme === "light"
        ? "border-kaizen-border bg-kaizen-surface"
        : "border-kaizen-border bg-kaizen-dark-surface",
    )}
  >
    <div className="flex items-start justify-between">
      <div>
        <p
          className={cn(
            "text-sm font-medium mb-2",
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
          {unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
        {trend !== undefined && (
          <p
            className={cn(
              "text-xs mt-2",
              trend > 0 ? "text-kaizen-error" : "text-kaizen-success",
            )}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last period
          </p>
        )}
      </div>
      <div
        className={cn(
          "p-3 rounded-lg",
          theme === "light"
            ? "bg-kaizen-accent/10"
            : "bg-kaizen-accent-dark/10",
        )}
      >
        {icon}
      </div>
    </div>
  </div>
);

const BehaviorChart: React.FC<{
  data: Array<{ type: string; count: number; duration: number }>;
  theme: "light" | "dark";
}> = ({ data, theme }) => {
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div
      className={cn(
        "p-6 rounded-lg border",
        theme === "light"
          ? "border-kaizen-border bg-kaizen-surface"
          : "border-kaizen-border bg-kaizen-dark-surface",
      )}
    >
      <h3
        className={cn(
          "text-lg font-semibold mb-4",
          theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
        )}
      >
        Behavior Patterns Today
      </h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.type}>
            <div className="flex items-center justify-between mb-2">
              <span
                className={cn(
                  "text-sm font-medium capitalize",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
                )}
              >
                {item.type}
              </span>
              <span
                className={cn(
                  "text-sm",
                  theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
                )}
              >
                {item.count}× ({item.duration}m)
              </span>
            </div>
            <div
              className={cn(
                "h-2 rounded-full overflow-hidden",
                theme === "light" ? "bg-kaizen-muted" : "bg-kaizen-dark-muted",
              )}
            >
              <div
                className="h-full bg-gradient-to-r from-kaizen-accent to-kaizen-primary"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopSitesCard: React.FC<{
  sites: Array<{ name: string; duration: number; count: number }>;
  theme: "light" | "dark";
}> = ({ sites, theme }) => (
  <div
    className={cn(
      "p-6 rounded-lg border",
      theme === "light"
        ? "border-kaizen-border bg-kaizen-surface"
        : "border-kaizen-border bg-kaizen-dark-surface",
    )}
  >
    <h3
      className={cn(
        "text-lg font-semibold mb-4",
        theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
      )}
    >
      Top Sites Today
    </h3>
    <div className="space-y-3">
      {sites.map((site, idx) => (
        <div
          key={site.name}
          className="flex items-center justify-between p-3 rounded-lg"
          style={{
            backgroundColor:
              theme === "light"
                ? `rgba(59, 130, 246, ${0.05 * (5 - idx)})`
                : `rgba(59, 130, 246, ${0.1 * (5 - idx)})`,
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-kaizen-accent to-kaizen-primary flex items-center justify-center text-white text-sm font-semibold">
              {idx + 1}
            </div>
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
                )}
              >
                {site.name}
              </p>
              <p
                className={cn(
                  "text-xs",
                  theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
                )}
              >
                {site.count} visits
              </p>
            </div>
          </div>
          <span
            className={cn(
              "text-sm font-semibold",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
            )}
          >
            {site.duration}m
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const Analytics: React.FC<AnalyticsProps> = ({ theme }) => {
  const metrics = mockAnalytics.today;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2
          className={cn(
            "text-3xl font-bold mb-2",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Analytics Dashboard
        </h2>
        <p
          className={cn(
            "text-sm",
            theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
          )}
        >
          Comprehensive insights about your browsing behavior and productivity
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Total Time"
          value={Math.round(metrics.totalTime / 60)}
          unit="h"
          trend={12}
          icon={
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          theme={theme}
        />
        <MetricCard
          label="Productive Time"
          value={Math.round(metrics.productiveTime / 60)}
          unit="h"
          trend={-5}
          icon={
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
          theme={theme}
        />
        <MetricCard
          label="Distraction Time"
          value={Math.round(metrics.distractionTime)}
          unit="m"
          trend={8}
          icon={
            <svg
              className="w-6 h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          theme={theme}
        />
        <MetricCard
          label="Interventions"
          value={metrics.interventions}
          trend={15}
          icon={
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 4v2M15 9h2a2 2 0 012 2v2a2 2 0 01-2 2h-2m0-8H9a2 2 0 00-2 2v2a2 2 0 002 2h2m0-8V7a2 2 0 012-2h2a2 2 0 012 2v2m0 4v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2m0 0H9"
              />
            </svg>
          }
          theme={theme}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Behavior Chart */}
        <div className="lg:col-span-2">
          <BehaviorChart data={metrics.behaviors} theme={theme} />
        </div>

        {/* Top Sites */}
        <div>
          <TopSitesCard sites={metrics.topSites.slice(0, 3)} theme={theme} />
        </div>
      </div>

      {/* Period Comparison */}
      <div
        className={cn(
          "p-6 rounded-lg border",
          theme === "light"
            ? "border-kaizen-border bg-kaizen-surface"
            : "border-kaizen-border bg-kaizen-dark-surface",
        )}
      >
        <h3
          className={cn(
            "text-lg font-semibold mb-4",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Time Period Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Today", data: mockAnalytics.today },
            { label: "This Week", data: mockAnalytics.thisWeek },
            { label: "This Month", data: mockAnalytics.thisMonth },
          ].map((period) => (
            <div
              key={period.label}
              className={cn(
                "p-4 rounded-lg",
                theme === "light" ? "bg-kaizen-muted/20" : "bg-kaizen-dark-muted/20",
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium mb-3",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
                )}
              >
                {period.label}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span
                    className={cn(
                      "text-xs",
                      theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
                    )}
                  >
                    Total
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
                    )}
                  >
                    {Math.round(period.data.totalTime / 60)}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={cn(
                      "text-xs",
                      theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
                    )}
                  >
                    Productive
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold text-kaizen-success",
                      theme === "light" ? "" : "text-kaizen-success-dark",
                    )}
                  >
                    {Math.round(period.data.productiveTime / 60)}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={cn(
                      "text-xs",
                      theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
                    )}
                  >
                    Distractions
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold text-kaizen-error",
                      theme === "light" ? "" : "text-kaizen-error-dark",
                    )}
                  >
                    {Math.round(period.data.distractionTime / 60)}h
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
