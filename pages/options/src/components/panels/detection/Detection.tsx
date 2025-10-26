import { DetectionConfig } from "./DetectionConfig";
import { Engine } from "./Engine";
import { cn } from "@extension/ui";
import { useState } from "react";
import type { DetectionProps } from "./types";
import type React from "react";

export const Detection: React.FC<DetectionProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<"engine" | "config">("engine");

  const tabs = [
    {
      id: "engine" as const,
      label: "Engine Status",
      description: "Real-time detection metrics",
      icon: "🧠",
    },
    {
      id: "config" as const,
      label: "Detection Config",
      description: "Pattern settings & thresholds",
      icon: "⚙️",
    },
  ];

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Behavior Detection Engine
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and configure Kaizen's real-time behavior detection system
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg dark:bg-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
              "flex items-center justify-center space-x-2",
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
            )}
          >
            <span className="text-lg">{tab.icon}</span>
            <div className="text-center">
              <div>{tab.label}</div>
              <div className="text-xs opacity-75">{tab.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "engine" && <Engine theme={(theme || "light") as "light" | "dark"} />}
        {activeTab === "config" && <DetectionConfig />}
      </div>
    </div>
  );
};
