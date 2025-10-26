import { cn } from "@extension/ui";
import type React from "react";

interface EngineProps {
  theme: "light" | "dark";
}

const FeatureSection: React.FC<{
  title: string;
  description: string;
  icon: string;
  items: string[];
  theme: "light" | "dark";
}> = ({ title, description, icon, items, theme }) => (
  <div
    className={cn(
      "p-6 rounded-lg border",
      theme === "light"
        ? "bg-kaizen-surface border-kaizen-border"
        : "bg-kaizen-dark-surface border-kaizen-border",
    )}
  >
    <div className="flex items-start space-x-4 mb-4">
      <div className="text-3xl flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <h3
          className={cn(
            "text-lg font-semibold mb-1",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          {title}
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
    </div>
    <ul className="space-y-2 ml-12">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start space-x-2">
          <span
            className={cn(
              "text-sm mt-0.5",
              theme === "light" ? "text-kaizen-success" : "text-kaizen-success",
            )}
          >
            ✓
          </span>
          <span
            className={cn(
              "text-sm",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
            )}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export const Engine: React.FC<EngineProps> = ({ theme }) => {
  const detectors = [
    "Doomscrolling detection - Tracks extended scrolling sessions",
    "Shopping behavior - Identifies impulsive shopping patterns",
    "Multitasking analysis - Monitors rapid tab switching",
    "Site activity tracking - Records visit duration & frequency",
  ];

  const interventions = [
    "Smart notifications - Behavioral nudges & reminders",
    "Achievement celebrations - Recognition of focused sessions",
    "Break suggestions - Timely rest recommendations",
    "Goal progress updates - Achievement tracking",
  ];

  const analytics = [
    "Daily metrics aggregation - Time, productivity, distractions",
    "Weekly/monthly summaries - Trend analysis & insights",
    "Site usage analytics - Top visited domains",
    "Behavior patterns - Detection & categorization",
  ];

  const reports = [
    "Exportable summaries - PDF/HTML format support",
    "Historical analysis - Track changes over time",
    "Productivity insights - Actionable recommendations",
    "Behavioral trends - Pattern recognition & alerts",
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h2
          className={cn(
            "text-3xl font-bold mb-2",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          🧠 Behavior Engine
        </h2>
        <p
          className={cn(
            "text-base max-w-2xl",
            theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
          )}
        >
          Privacy-first behavior tracking system that monitors, analyzes, and
          provides insights into your browsing patterns. All data stays local on
          your device.
        </p>
      </div>

      {/* Core Subsystems */}
      <section className="mb-12">
        <h3
          className={cn(
            "text-2xl font-bold mb-6",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Core Subsystems
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureSection
            title="Behavior Detectors"
            description="Real-time pattern recognition"
            icon="🔍"
            items={detectors}
            theme={theme}
          />
          <FeatureSection
            title="Interventions System"
            description="Smart notifications & nudges"
            icon="🎯"
            items={interventions}
            theme={theme}
          />
          <FeatureSection
            title="Analytics Engine"
            description="Metrics & aggregation"
            icon="📊"
            items={analytics}
            theme={theme}
          />
          <FeatureSection
            title="Reports Generator"
            description="Insights & summaries"
            icon="📈"
            items={reports}
            theme={theme}
          />
        </div>
      </section>

      {/* Data Models */}
      <section className="mb-12">
        <h3
          className={cn(
            "text-2xl font-bold mb-6",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Data Models
        </h3>
        <div
          className={cn(
            "p-6 rounded-lg border",
            theme === "light"
              ? "bg-kaizen-surface border-kaizen-border"
              : "bg-kaizen-dark-surface border-kaizen-border",
          )}
        >
          <div className="space-y-4">
            <div>
              <h4
                className={cn(
                  "font-semibold mb-2",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
                )}
              >
                BehaviorMetrics
              </h4>
              <p
                className={cn(
                  "text-sm",
                  theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
                )}
              >
                Daily aggregated statistics: total time, productive time,
                distraction time, interventions count
              </p>
            </div>
            <div>
              <h4
                className={cn(
                  "font-semibold mb-2",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
                )}
              >
                SiteActivity
              </h4>
              <p
                className={cn(
                  "text-sm",
                  theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
                )}
              >
                Domain-level tracking: duration spent, visit count, timestamp
                records
              </p>
            </div>
            <div>
              <h4
                className={cn(
                  "font-semibold mb-2",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
                )}
              >
                BehaviorPattern
              </h4>
              <p
                className={cn(
                  "text-sm",
                  theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
                )}
              >
                Detected patterns: type (doomscroll, shopping, multitask),
                frequency, duration, context
              </p>
            </div>
            <div>
              <h4
                className={cn(
                  "font-semibold mb-2",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
                )}
              >
                Remark & Report
              </h4>
              <p
                className={cn(
                  "text-sm",
                  theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
                )}
              >
                User notes, mood tracking, goal reflections, exportable
                summaries with insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Storage */}
      <section>
        <h3
          className={cn(
            "text-2xl font-bold mb-6",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Privacy & Storage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={cn(
              "p-6 rounded-lg border",
              theme === "light"
                ? "bg-kaizen-success/10 border-kaizen-success/20"
                : "bg-kaizen-success/10 border-kaizen-success/20",
            )}
          >
            <h4
              className={cn(
                "font-semibold mb-3 flex items-center space-x-2",
                theme === "light" ? "text-kaizen-success" : "text-kaizen-success",
              )}
            >
              <span>🔒</span>
              <span>Privacy First</span>
            </h4>
            <ul
              className={cn(
                "text-sm space-y-2",
                theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
              )}
            >
              <li>✓ All data stays local</li>
              <li>✓ No cloud sync</li>
              <li>✓ No external tracking</li>
              <li>✓ User controls everything</li>
            </ul>
          </div>
          <div
            className={cn(
              "p-6 rounded-lg border",
              theme === "light"
                ? "bg-kaizen-accent/10 border-kaizen-accent/20"
                : "bg-kaizen-accent-dark/10 border-kaizen-accent-dark/20",
            )}
          >
            <h4
              className={cn(
                "font-semibold mb-3 flex items-center space-x-2",
                theme === "light" ? "text-kaizen-accent" : "text-kaizen-accent-dark",
              )}
            >
              <span>💾</span>
              <span>Local Storage</span>
            </h4>
            <ul
              className={cn(
                "text-sm space-y-2",
                theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
              )}
            >
              <li>✓ IndexedDB for behaviors</li>
              <li>✓ chrome.storage for config</li>
              <li>✓ On-device processing</li>
              <li>✓ Export/backup ready</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
