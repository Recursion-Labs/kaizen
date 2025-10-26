import { GraphControls } from "../graph/GraphControls";
import { GraphStats } from "../graph/GraphStats";
import { KnowledgeGraphComponent } from "../graph/KnowledgeGraph";
import { cn } from "@extension/ui";
import { useState } from "react";
import type React from "react";

interface InsightsProps {
  theme: "light" | "dark";
}

export const Insights: React.FC<InsightsProps> = ({ theme }) => {
  const [layout, setLayout] = useState<
    "force" | "circle" | "grid" | "concentric"
  >("force");

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-kaizen-border dark:border-kaizen-border">
        <h2
          className={cn(
            "text-3xl font-bold mb-2",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Knowledge Graph
        </h2>
        <p
          className={cn(
            "text-sm mb-6",
            theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
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
