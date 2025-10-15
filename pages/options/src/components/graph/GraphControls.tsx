import { cn } from "@extension/ui";
import type React from "react";

interface GraphControlsProps {
  selectedLayout: "force" | "circle" | "grid" | "concentric";
  onLayoutChange: (layout: "force" | "circle" | "grid" | "concentric") => void;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  selectedLayout,
  onLayoutChange,
}) => {
  const layouts = [
    { id: "force", label: "Force", icon: "⚡" },
    { id: "circle", label: "Circle", icon: "⭕" },
    { id: "grid", label: "Grid", icon: "⊞" },
    { id: "concentric", label: "Concentric", icon: "◎" },
  ] as const;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Layout:
        </span>
        <div className="flex space-x-1">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => onLayoutChange(layout.id)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                "flex items-center space-x-1.5",
                selectedLayout === layout.id
                  ? "bg-blue-500 text-white shadow-md transform scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600",
              )}
            >
              <span className="text-base">{layout.icon}</span>
              <span>{layout.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

      <div className="flex items-center space-x-2">
        <button
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
            "flex items-center space-x-1.5",
            "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
            "hover:bg-gray-200 dark:hover:bg-gray-600",
          )}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Search</span>
        </button>

        <button
          className={cn(
            "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
            "flex items-center space-x-1.5",
            "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
            "hover:bg-gray-200 dark:hover:bg-gray-600",
          )}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
};
