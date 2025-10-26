import { cn } from "@extension/ui";
import type React from "react";

interface SettingsProps {
  theme: "light" | "dark";
}

export const Settings: React.FC<SettingsProps> = ({ theme }) => (
  <div className="p-8 max-w-4xl mx-auto">
    <div className="mb-8">
      <h2
        className={cn(
          "text-3xl font-bold mb-2",
          theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
        )}
      >
        General Settings
      </h2>
      <p
        className={cn(
          "text-sm",
          theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
        )}
      >
        Configure your preferences and extension behavior
      </p>
    </div>

    <div className="space-y-6">
      {/* Theme Setting */}
      <div
        className={cn(
          "p-6 rounded-lg border",
          theme === "light"
            ? "bg-kaizen-surface border-kaizen-border"
            : "bg-kaizen-dark-surface border-kaizen-border",
        )}
      >
        <h3
          className={cn(
            "text-lg font-semibold mb-2",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Appearance
        </h3>
        <p
          className={cn(
            "text-sm mb-4",
            theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
          )}
        >
          Customize how Kaizen looks
        </p>
        <div className="flex items-center space-x-4">
          <button
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              theme === "light"
                ? "bg-kaizen-accent text-kaizen-light-bg"
                : "bg-kaizen-dark-muted text-kaizen-dark-text",
            )}
          >
            Light
          </button>
          <button
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              theme === "dark"
                ? "bg-kaizen-accent text-kaizen-light-bg"
                : "bg-kaizen-surface text-kaizen-light-text dark:bg-kaizen-dark-surface dark:text-kaizen-dark-text",
            )}
          >
            Dark
          </button>
          <button
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              "bg-kaizen-surface text-kaizen-light-text dark:bg-kaizen-dark-surface dark:text-kaizen-dark-text",
            )}
          >
            Auto
          </button>
        </div>
      </div>

      {/* Privacy Setting */}
      <div
        className={cn(
          "p-6 rounded-lg border",
          theme === "light"
            ? "bg-kaizen-surface border-kaizen-border"
            : "bg-kaizen-dark-surface border-kaizen-border",
        )}
      >
        <h3
          className={cn(
            "text-lg font-semibold mb-2",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Privacy
        </h3>
        <p
          className={cn(
            "text-sm mb-4",
            theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
          )}
        >
          All AI processing happens locally on your device
        </p>
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-sm font-medium",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
            )}
          >
            Local AI Processing
          </span>
          <div className="relative inline-block w-12 h-6">
            <input type="checkbox" checked readOnly className="sr-only" />
            <div className="block bg-kaizen-accent w-12 h-6 rounded-full"></div>
            <div className="dot absolute left-1 top-1 bg-kaizen-light-bg w-4 h-4 rounded-full transition transform translate-x-6"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
