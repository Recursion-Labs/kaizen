import { cn } from "@extension/ui";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface BGKnowledgeNode {
  id: string;
  type: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

interface BGKnowledgeEdge {
  source: string;
  target: string;
  type: string;
  metadata?: Record<string, unknown>;
  createdAt: number;
}

interface FullGraph {
  nodes: BGKnowledgeNode[];
  edges: BGKnowledgeEdge[];
  stats: { nodeCount: number; edgeCount: number; nodeTypes: Record<string, number>; edgeTypes: Record<string, number> };
}

interface GraphPageProps {
  theme: "light" | "dark";
}

// Hub-centric layout: place highest-degree node at center, neighbors in ring, others outer ring
const hubLayout = (nodes: BGKnowledgeNode[], edges: BGKnowledgeEdge[], width: number, height: number): Record<string, { x: number; y: number; color: string; labelColor: string }> => {
  const centerX = width / 2;
  const centerY = height / 2;

  const degree = new Map<string, number>();
  edges.forEach(e => {
    degree.set(e.source, (degree.get(e.source) || 0) + 1);
    degree.set(e.target, (degree.get(e.target) || 0) + 1);
  });
  const sorted = [...nodes].sort((a, b) => (degree.get(b.id) || 0) - (degree.get(a.id) || 0));
  const hub = sorted[0];
  const neighbors = new Set<string>();
  edges.forEach(e => { if (e.source === hub.id) neighbors.add(e.target); if (e.target === hub.id) neighbors.add(e.source); });
  const ring = [...neighbors].map(id => nodes.find(n => n.id === id)!).filter(Boolean);
  const outer = sorted.filter(n => n.id !== hub.id && !neighbors.has(n.id));

  const colorByType: Record<string, {bg: string; text: string}> = {
    domain: { bg: '#ffb020', text: '#111827' },
    tab: { bg: '#8b5cf6', text: '#ffffff' },
    pattern: { bg: '#ef4444', text: '#ffffff' },
    behavior: { bg: '#f59e0b', text: '#111827' },
    session: { bg: '#0ea5e9', text: '#ffffff' },
    nudge: { bg: '#a78bfa', text: '#111827' },
    user: { bg: '#8b5cf6', text: '#ffffff' },
  };

  const pos: Record<string, { x: number; y: number; color: string; labelColor: string }> = {};
  const hubColors = colorByType[hub.type] || { bg: '#7c3aed', text: '#ffffff' };
  pos[hub.id] = { x: centerX, y: centerY, color: hubColors.bg, labelColor: hubColors.text };

  const ringR = Math.min(width, height) * 0.28;
  const outerR = Math.min(width, height) * 0.42;
  const twoPI = Math.PI * 2;

  ring.forEach((n, i) => {
    const angle = (i / Math.max(1, ring.length)) * twoPI;
    const x = centerX + Math.cos(angle) * ringR;
    const y = centerY + Math.sin(angle) * ringR;
    const c = colorByType[n.type] || { bg: '#fbbf24', text: '#111827' };
    pos[n.id] = { x, y, color: c.bg, labelColor: c.text };
  });

  outer.forEach((n, i) => {
    const angle = (i / Math.max(1, outer.length)) * twoPI + (Math.PI / 12);
    const x = centerX + Math.cos(angle) * outerR;
    const y = centerY + Math.sin(angle) * outerR;
    const c = colorByType[n.type] || { bg: '#fbbf24', text: '#111827' };
    pos[n.id] = { x, y, color: c.bg, labelColor: c.text };
  });

  return pos;
};

const GraphCanvas: React.FC<{ theme: "light" | "dark"; graph: FullGraph | null }>
  = ({ theme, graph }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const cssW = canvas.clientWidth || 720;
    const cssH = canvas.clientHeight || 480;
    canvas.width = cssW * window.devicePixelRatio;
    canvas.height = cssH * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // background dotted grid
    ctx.fillStyle = theme === 'light' ? '#0f172a' : '#0ea5e9';
    ctx.clearRect(0, 0, cssW, cssH);
    const dotColor = theme === 'light' ? '#e5e7eb' : '#1f2937';
    ctx.fillStyle = dotColor;
    for (let x = 10; x < cssW; x += 20) {
      for (let y = 10; y < cssH; y += 20) {
        ctx.beginPath(); ctx.arc(x, y, 0.75, 0, Math.PI * 2); ctx.fill();
      }
    }

    if (!graph) return;

    const positions = hubLayout(graph.nodes, graph.edges, cssW, cssH);

    // Draw curved edges with subtle labels markers
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = theme === 'light' ? 'rgba(15,23,42,0.25)' : 'rgba(203,213,225,0.25)';
    graph.edges.forEach((e, idx) => {
      const s = positions[e.source];
      const t = positions[e.target];
      if (!s || !t) return;
      const mx = (s.x + t.x) / 2;
      const my = (s.y + t.y) / 2;
      const dx = t.x - s.x, dy = t.y - s.y;
      const nx = -dy, ny = dx;
      const len = Math.hypot(nx, ny) || 1;
      const cpDist = 18 + (idx % 7) * 2;
      const cx = mx + (nx / len) * cpDist;
      const cy = my + (ny / len) * cpDist;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.quadraticCurveTo(cx, cy, t.x, t.y);
      ctx.stroke();
    });

    // Draw labeled pill nodes
    const drawPill = (x: number, y: number, text: string, bg: string, fg: string, isHub: boolean) => {
      ctx.font = isHub ? 'bold 13px ui-sans-serif, system-ui, -apple-system' : '12px ui-sans-serif, system-ui, -apple-system';
      const padX = isHub ? 14 : 10; const padY = 6;
      const w = Math.min(220, ctx.measureText(text).width + padX * 2);
      const h = isHub ? 30 : 24;
      const rx = 10;
      // shadow glow
      ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 12; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 4;
      // rounded rect
      ctx.beginPath();
      ctx.fillStyle = bg;
      const left = x - w / 2, top = y - h / 2;
      ctx.moveTo(left + rx, top);
      ctx.lineTo(left + w - rx, top);
      ctx.quadraticCurveTo(left + w, top, left + w, top + rx);
      ctx.lineTo(left + w, top + h - rx);
      ctx.quadraticCurveTo(left + w, top + h, left + w - rx, top + h);
      ctx.lineTo(left + rx, top + h);
      ctx.quadraticCurveTo(left, top + h, left, top + h - rx);
      ctx.lineTo(left, top + rx);
      ctx.quadraticCurveTo(left, top, left + rx, top);
      ctx.closePath();
      ctx.fill();
      // border
      ctx.shadowBlur = 0; ctx.strokeStyle = theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.9)'; ctx.lineWidth = 1.25; ctx.stroke();
      // text
      ctx.fillStyle = fg;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const clipped = text.length > 28 ? text.slice(0, 27) + '…' : text;
      ctx.fillText(clipped, x, y + (isHub ? 1 : 0));
    };

    const labelFor = (n: BGKnowledgeNode) => {
      const md = (n.metadata || {}) as Record<string, unknown>;
      return (md.name as string) || (md.domain as string) || (md.type as string) || n.id;
    };

    const hubId = graph.nodes.length ? graph.nodes.reduce((m, n) => (positions[n.id] && (!positions[m] || (graph.edges.filter(e=>e.source===n.id||e.target===n.id).length > graph.edges.filter(e=>e.source===m||e.target===m).length)) ? n.id : m), graph.nodes[0].id) : '';

    graph.nodes.forEach((n) => {
      const p = positions[n.id]; if (!p) return;
      const isHub = n.id === hubId;
      drawPill(p.x, p.y, labelFor(n), p.color, p.labelColor, isHub);
    });
  }, [theme, graph]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "w-full h-[420px] rounded-xl border",
        theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"
      )}
    />
  );
};

const GraphPage: React.FC<GraphPageProps> = ({ theme }) => {
  const [graph, setGraph] = useState<FullGraph | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGraph = async () => {
    setLoading(true); setError(null);
    try {
      const resp = await chrome.runtime.sendMessage({ type: "GET_KNOWLEDGE_GRAPH" });
      if (resp?.success) {
        setGraph(resp.graph as FullGraph);
      } else {
        setError(resp?.error || "Failed to load graph");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadGraph(); }, []);

  const stats = useMemo(() => graph?.stats, [graph]);

  return (
    <div className={cn("flex-1 h-full flex flex-col gap-3 p-4", theme === "light" ? "bg-kaizen-light-bg" : "bg-kaizen-dark-bg")}> 
      <div className="flex items-center justify-between">
        <div>
          <h2 className={cn("text-base font-semibold", theme === "light" ? "text-slate-800" : "text-slate-100")}>Knowledge Graph</h2>
          <p className={cn("text-xs", theme === "light" ? "text-slate-600" : "text-slate-400")}>Behavior, domains, and patterns captured in real time</p>
        </div>
        <motion.button
          onClick={loadGraph}
          disabled={loading}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium",
            "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
            loading && "opacity-60 cursor-wait"
          )}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </motion.button>
      </div>

      {/* Stats */}
      {stats && (
        <div className={cn(
          "grid grid-cols-3 gap-2 text-center text-xs p-2 rounded-lg border",
          theme === "light" ? "bg-white border-slate-200" : "bg-slate-900/60 border-slate-700"
        )}>
          <div>
            <div className={cn("text-lg font-bold", theme === "light" ? "text-blue-600" : "text-blue-400")}>{stats.nodeCount}</div>
            <div className={cn(theme === "light" ? "text-slate-600" : "text-slate-400")}>Nodes</div>
          </div>
          <div>
            <div className={cn("text-lg font-bold", theme === "light" ? "text-purple-600" : "text-purple-400")}>{stats.edgeCount}</div>
            <div className={cn(theme === "light" ? "text-slate-600" : "text-slate-400")}>Edges</div>
          </div>
          <div>
            <div className={cn("text-lg font-bold", theme === "light" ? "text-emerald-600" : "text-emerald-400")}>{Object.keys(stats.nodeTypes || {}).length}</div>
            <div className={cn(theme === "light" ? "text-slate-600" : "text-slate-400")}>Types</div>
          </div>
        </div>
      )}

      {/* Canvas Graph */}
      <GraphCanvas theme={theme} graph={graph} />

      {error && (
        <div className={cn("text-xs p-2 rounded-md", theme === "light" ? "text-red-700 bg-red-50" : "text-red-300 bg-red-900/30")}>{error}</div>
      )}
    </div>
  );
};

export default GraphPage;
