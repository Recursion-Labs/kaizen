import { cn } from "@extension/ui";
import { useEffect, useRef } from "react";
import type React from "react";

interface KnowledgeGraphComponentProps {
  layout: "force" | "circle" | "grid" | "concentric";
  theme: "light" | "dark";
}

export const KnowledgeGraphComponent: React.FC<
  KnowledgeGraphComponentProps
> = ({ layout, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock data for demonstration
  const mockNodes = [
    { id: "1", label: "AI", x: 200, y: 150, type: "concept", weight: 0.9 },
    {
      id: "2",
      label: "Machine Learning",
      x: 300,
      y: 200,
      type: "topic",
      weight: 0.8,
    },
    {
      id: "3",
      label: "Neural Networks",
      x: 150,
      y: 250,
      type: "entity",
      weight: 0.7,
    },
    {
      id: "4",
      label: "Deep Learning",
      x: 350,
      y: 100,
      type: "keyword",
      weight: 0.6,
    },
    { id: "5", label: "Privacy", x: 250, y: 300, type: "concept", weight: 0.8 },
  ];

  const mockEdges = [
    { source: "1", target: "2", type: "related" },
    { source: "2", target: "3", type: "contains" },
    { source: "2", target: "4", type: "similar" },
    { source: "1", target: "5", type: "references" },
    { source: "3", target: "5", type: "related" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Draw edges
    ctx.strokeStyle = theme === "light" ? "#e2e8f0" : "#374151";
    ctx.lineWidth = 2;

    mockEdges.forEach((edge) => {
      const sourceNode = mockNodes.find((n) => n.id === edge.source);
      const targetNode = mockNodes.find((n) => n.id === edge.target);

      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    mockNodes.forEach((node) => {
      const radius = Math.max(20, node.weight * 40);

      // Node shadow
      ctx.shadowColor =
        theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Node background
      ctx.fillStyle = getNodeColor(node.type, theme);
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Node border
      ctx.strokeStyle = theme === "light" ? "#ffffff" : "#1f2937";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Node label
      ctx.fillStyle = theme === "light" ? "#1f2937" : "#f9fafb";
      ctx.font = "12px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);
    });
  }, [layout, theme, mockNodes, mockEdges]);

  const getNodeColor = (type: string, theme: string) => {
    const colors = {
      light: {
        concept: "#3b82f6",
        entity: "#10b981",
        topic: "#f59e0b",
        keyword: "#ef4444",
      },
      dark: {
        concept: "#60a5fa",
        entity: "#34d399",
        topic: "#fbbf24",
        keyword: "#f87171",
      },
    };

    return (
      colors[theme as keyof typeof colors][type as keyof typeof colors.light] ||
      "#6b7280"
    );
  };

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <canvas
        ref={canvasRef}
        className={cn(
          "w-full h-full cursor-move",
          theme === "light" ? "bg-slate-50" : "bg-gray-900",
        )}
        style={{ width: "100%", height: "100%" }}
      />

      {/* Loading overlay for when Cytoscape loads */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "bg-gradient-to-br opacity-90",
          theme === "light"
            ? "from-blue-50 to-indigo-50"
            : "from-gray-800 to-slate-900",
        )}
      >
        <div className="text-center">
          <div
            className={cn(
              "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center",
              "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg",
            )}
          >
            <svg
              className="w-8 h-8 text-white animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h3
            className={cn(
              "text-lg font-semibold mb-2",
              theme === "light" ? "text-gray-900" : "text-white",
            )}
          >
            Building Knowledge Graph
          </h3>
          <p
            className={cn(
              "text-sm",
              theme === "light" ? "text-gray-500" : "text-gray-400",
            )}
          >
            Analyzing content from your tabs...
          </p>
        </div>
      </div>
    </div>
  );
};
