export interface KnowledgeNode {
  id: string;
  label: string;
  type: "concept" | "entity" | "topic" | "keyword";
  weight: number; // Importance score 0-1
  color?: string;
  position?: { x: number; y: number };
  metadata?: {
    source?: string;
    confidence?: number;
    frequency?: number;
  };
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: "related" | "contains" | "similar" | "references";
  weight: number; // Strength of relationship 0-1
  color?: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  metadata: {
    sessionId: string;
    createdAt: Date;
    sourceTabs: string[];
    totalNodes: number;
    totalEdges: number;
  };
}

export interface GraphLayout {
  name: "force" | "circle" | "grid" | "concentric";
  options?: Record<string, unknown>;
}

export interface GraphInteraction {
  selectedNode?: string;
  hoveredNode?: string;
  selectedEdge?: string;
  zoom: number;
  pan: { x: number; y: number };
}
