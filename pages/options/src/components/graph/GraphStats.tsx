import { cn } from "@extension/ui";
import type React from "react";

export const GraphStats: React.FC = () => {
  // Mock stats - in real implementation, these would come from the graph data
  const stats = {
    nodes: 24,
    edges: 31,
    concepts: 8,
    entities: 12,
    topics: 4,
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {stats.nodes} nodes
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {stats.edges} edges
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {stats.concepts} concepts
          </span>
        </div>
      </div>

      <div
        className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        )}
      >
        Live
      </div>
    </div>
  );
};
