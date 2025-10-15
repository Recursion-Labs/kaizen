import { cn } from "@extension/ui";
import { useState } from "react";
import type React from "react";
import { KnowledgeGraphComponent } from "../graph/KnowledgeGraph";
import { GraphControls } from "../graph/GraphControls";
import { GraphStats } from "../graph/GraphStats";

interface KnowledgeGraphSettingsProps {
  theme: "light" | "dark";
}

export const KnowledgeGraphSettings: React.FC<KnowledgeGraphSettingsProps> = ({
  theme,
}) => {
  const [layout, setLayout] = useState<
    "force" | "circle" | "grid" | "concentric"
  >("force");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2
          className={cn(
            "text-3xl font-bold mb-2",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          Knowledge Graph
        </h2>
        <p
          className={cn(
            "text-sm mb-6",
            theme === "light" ? "text-gray-500" : "text-gray-400",
          )}
        >
          Visualize and explore connections between concepts, entities, and
          topics
        </p>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <GraphControls selectedLayout={layout} onLayoutChange={setLayout} />
          <GraphStats />
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="flex-1 overflow-hidden">
        <KnowledgeGraphComponent layout={layout} theme={theme} />
      </div>
    </div>
  );
};
