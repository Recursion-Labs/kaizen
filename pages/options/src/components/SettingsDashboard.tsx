import {
  Analytics,
  Dashboard,
  Detection,
  Settings,
  Help,
  Insights,
  Overview,
  Nudges,
} from "./panels";
import { exampleThemeStorage } from "@extension/storage";
import { AIOverlayCircle, cn, ThemeToggle } from "@extension/ui";
import * as LucideIcons from "lucide-react";
import { useState } from "react";
import type React from "react";

type SettingsSection =
  | "overview"
  | "behavior"
  | "engine"
  | "nudges"
  | "analytics"
  | "insights"
  | "settings"
  | "help";

interface SettingsDashboardProps {
  theme: "light" | "dark";
}

export const SettingsDashboard: React.FC<SettingsDashboardProps> = ({
  theme,
}) => {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("overview");

  const handleThemeToggle = () => {
    exampleThemeStorage.toggle();
  };

  const navItems = [
    {
      id: "overview" as const,
      label: "Overview",
      icon: <LucideIcons.Home className="h-6 w-6" />,
      description: "Welcome & quick stats",
    },
    {
      id: "behavior" as const,
      label: "Behavior",
      icon: <LucideIcons.Activity className="h-6 w-6" />,
      description: "Track habits & insights",
    },
    {
      id: "engine" as const,
      label: "Detection",
      icon: <LucideIcons.Brain className="h-6 w-6" />,
      description: "Pattern detection",
    },
    {
      id: "nudges" as const,
      label: "Nudges",
      icon: <LucideIcons.MessageCircle className="h-6 w-6" />,
      description: "Smart notifications",
    },
    {
      id: "analytics" as const,
      label: "Analytics",
      icon: <LucideIcons.BarChart3 className="h-6 w-6" />,
      description: "Time & reports",
    },
    {
      id: "insights" as const,
      label: "Insights",
      icon: <LucideIcons.Search className="h-6 w-6" />,
      description: "Knowledge graph",
    },
    {
      id: "settings" as const,
      label: "Settings",
      icon: <LucideIcons.Settings className="h-6 w-6" />,
      description: "Customize & privacy",
    },
    {
      id: "help" as const,
      label: "Help",
      icon: <LucideIcons.HelpCircle className="h-6 w-6" />,
      description: "Documentation",
    },
  ];

  const renderPanel = () => {
    switch (activeSection) {
      case "overview":
        return <Overview theme={theme} />;
      case "behavior":
        return <Dashboard theme={theme} />;
      case "engine":
        return <Detection theme={theme} />;
      case "nudges":
        return <Nudges theme={theme} />;
      case "analytics":
        return <Analytics theme={theme} />;
      case "insights":
        return <Insights theme={theme} />;
      case "settings":
        return <Settings theme={theme} />;
      case "help":
        return <Help theme={theme} />;
      default:
        return <Overview theme={theme} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "w-64 h-screen flex-shrink-0 border-r",
          theme === "light"
            ? "bg-kaizen-light-bg border-kaizen-border"
            : "bg-kaizen-dark-bg border-kaizen-dark-border",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "p-6 border-b",
            theme === "light" ? "border-kaizen-border" : "border-kaizen-dark-border",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  "bg-gradient-to-r from-kaizen-accent to-kaizen-primary shadow-lg",
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
                    theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
                  )}
                >
                  Kaizen
                </h1>
                <p
                  className={cn(
                    "text-xs",
                    theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
                  )}
                >
                  Settings
                </p>
              </div>
            </div>
            {/* Animated Theme Toggle */}
            <ThemeToggle
              theme={theme}
              onToggle={handleThemeToggle}
              className="ml-auto"
            />
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
                    ? "bg-kaizen-surface text-kaizen-accent shadow-sm"
                    : "bg-kaizen-dark-surface text-kaizen-accent shadow-sm"
                  : theme === "light"
                    ? "text-kaizen-light-text hover:bg-kaizen-surface"
                    : "text-kaizen-dark-muted hover:bg-kaizen-dark-surface",
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0",
                  theme === "light" ? "text-blue-600" : "text-blue-400",
                )}
              >
                {item.icon}
              </div>
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
                        ? "text-kaizen-accent"
                        : "text-kaizen-accent"
                      : theme === "light"
                        ? "text-kaizen-light-muted"
                        : "text-kaizen-dark-muted",
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
            theme === "light" ? "bg-kaizen-light-bg" : "bg-kaizen-dark-bg",
          )}
        >
          {renderPanel()}
        </div>
      </main>

      {/* AI Overlay Circle with Chrome AI APIs */}
      <AIOverlayCircle />
    </div>
  );
};
