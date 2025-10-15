import { cn } from "@extension/ui";
import type React from "react";

interface GeneralSettingsProps {
  theme: "light" | "dark";
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ theme }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2
          className={cn(
            "text-3xl font-bold mb-2",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          General Settings
        </h2>
        <p
          className={cn(
            "text-sm",
            theme === "light" ? "text-gray-500" : "text-gray-400",
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
              ? "bg-white border-slate-200"
              : "bg-gray-800 border-gray-700",
          )}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-2",
              theme === "light" ? "text-gray-900" : "text-white",
            )}
          >
            Appearance
          </h3>
          <p
            className={cn(
              "text-sm mb-4",
              theme === "light" ? "text-gray-500" : "text-gray-400",
            )}
          >
            Customize how Kaizen looks
          </p>
          <div className="flex items-center space-x-4">
            <button
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                theme === "light"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300",
              )}
            >
              Light
            </button>
            <button
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                theme === "dark"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700",
              )}
            >
              Dark
            </button>
            <button
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
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
              ? "bg-white border-slate-200"
              : "bg-gray-800 border-gray-700",
          )}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-2",
              theme === "light" ? "text-gray-900" : "text-white",
            )}
          >
            Privacy
          </h3>
          <p
            className={cn(
              "text-sm mb-4",
              theme === "light" ? "text-gray-500" : "text-gray-400",
            )}
          >
            All AI processing happens locally on your device
          </p>
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-sm font-medium",
                theme === "light" ? "text-gray-700" : "text-gray-300",
              )}
            >
              Local AI Processing
            </span>
            <div className="relative inline-block w-12 h-6">
              <input type="checkbox" checked readOnly className="sr-only" />
              <div className="block bg-blue-500 w-12 h-6 rounded-full"></div>
              <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
