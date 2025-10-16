import { AnalyticsSettings } from "./panels/AnalyticsSettings";
import { GeneralSettings } from "./panels/GeneralSettings";
import { HelpSettings } from "./panels/HelpSettings";
import { KnowledgeGraphSettings } from "./panels/KnowledgeGraphSettings";
import { ModelsSettings } from "./panels/ModelsSettings";
import { cn } from "@extension/ui";
import { useState } from "react";

type SettingsSection =
  | "general"
  | "models"
  | "knowledge-graph"
  | "analytics"
  | "help";

interface SettingsDashboardProps {
  theme: "light" | "dark";
}

export const SettingsDashboard: React.FC<SettingsDashboardProps> = ({
  theme,
}) => {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("general");

  const navItems = [
    {
      id: "general" as const,
      label: "General",
      icon: "⚙️",
      description: "Preferences & behavior",
    },
    {
      id: "models" as const,
      label: "AI Models",
      icon: "🤖",
      description: "Configure local AI",
    },
    {
      id: "knowledge-graph" as const,
      label: "Knowledge Graph",
      icon: "🔗",
      description: "Graph & visualization",
    },
    {
      id: "analytics" as const,
      label: "Analytics",
      icon: "📊",
      description: "Usage & insights",
    },
    {
      id: "help" as const,
      label: "Help",
      icon: "📚",
      description: "Documentation & support",
    },
  ];

  const renderPanel = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSettings theme={theme} />;
      case "models":
        return <ModelsSettings theme={theme} />;
      case "knowledge-graph":
        return <KnowledgeGraphSettings theme={theme} />;
      case "analytics":
        return <AnalyticsSettings theme={theme} />;
      case "help":
        return <HelpSettings theme={theme} />;
      default:
        return <GeneralSettings theme={theme} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "w-64 h-screen flex-shrink-0 border-r",
          theme === "light"
            ? "bg-white border-slate-200"
            : "bg-gray-800 border-gray-700",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "p-6 border-b",
            theme === "light" ? "border-slate-200" : "border-gray-700",
          )}
        >
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg",
              )}
            >
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h1
                className={cn(
                  "text-xl font-bold",
                  theme === "light" ? "text-gray-900" : "text-white",
                )}
              >
                Kaizen
              </h1>
              <p
                className={cn(
                  "text-xs",
                  theme === "light" ? "text-gray-500" : "text-gray-400",
                )}
              >
                Settings
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full px-4 py-3 rounded-lg transition-all duration-200",
                "flex items-start space-x-3 group",
                activeSection === item.id
                  ? theme === "light"
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "bg-blue-900/30 text-blue-400 shadow-sm"
                  : theme === "light"
                    ? "text-gray-700 hover:bg-slate-50"
                    : "text-gray-300 hover:bg-gray-700/50",
              )}
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div className="flex-1 text-left">
                <div
                  className={cn(
                    "text-sm font-medium",
                    activeSection === item.id && "font-semibold",
                  )}
                >
                  {item.label}
                </div>
                <div
                  className={cn(
                    "text-xs mt-0.5",
                    activeSection === item.id
                      ? theme === "light"
                        ? "text-blue-500"
                        : "text-blue-300"
                      : theme === "light"
                        ? "text-gray-500"
                        : "text-gray-400",
                  )}
                >
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto">
        <div
          className={cn(
            "min-h-screen w-full",
            theme === "light" ? "bg-slate-50" : "bg-gray-900",
          )}
        >
          {renderPanel()}
        </div>
      </main>
    </div>
  );
};
