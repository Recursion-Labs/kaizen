// Knowledge graph for storing entities & relationships with enhanced functionality

export type NodeType =
  | "tab"
  | "domain"
  | "pattern"
  | "behavior"
  | "user"
  | "session"
  | "nudge";

export interface KnowledgeNode {
  id: string; // unique identifier like tabId or domain name or pattern type
  type: NodeType;
  metadata?: Record<string, unknown>; // additional info like timestamps, severity etc
  createdAt: number;
  updatedAt: number;
}

export interface KnowledgeEdge {
  source: string; // node id of the source node
  target: string; // node id of the target node
  type: string; // relationship type like visited or exhibits or relatedTo
  metadata?: Record<string, unknown>;
  weight?: number; // edge weight for graph algorithms
  createdAt: number;
}

export interface GraphQuery {
  nodeTypes?: NodeType[];
  edgeTypes?: string[];
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

export interface GraphStats {
  nodeCount: number;
  edgeCount: number;
  nodeTypes: Record<NodeType, number>;
  edgeTypes: Record<string, number>;
}

export class KnowledgeGraph {
  private nodes: Map<string, KnowledgeNode> = new Map();
  private edges: KnowledgeEdge[] = [];
  private nodeIndex: Map<NodeType, Set<string>> = new Map();
  private edgeIndex: Map<string, Set<number>> = new Map();

  constructor() {
    // Initialize node type index
    const nodeTypes: NodeType[] = [
      "tab",
      "domain",
      "pattern",
      "behavior",
      "user",
      "session",
      "nudge",
    ];
    nodeTypes.forEach((type) => {
      this.nodeIndex.set(type, new Set());
    });
  }

  addNode(node: KnowledgeNode) {
    const now = Date.now();
    const nodeWithTimestamps: KnowledgeNode = {
      ...node,
      createdAt: node.createdAt || now,
      updatedAt: now,
    };

    this.nodes.set(node.id, nodeWithTimestamps);
    this.nodeIndex.get(node.type)?.add(node.id);
  }

  addEdge(edge: KnowledgeEdge) {
    if (this.nodes.has(edge.source) && this.nodes.has(edge.target)) {
      const edgeWithTimestamp: KnowledgeEdge = {
        ...edge,
        createdAt: edge.createdAt || Date.now(),
      };
      
      const edgeIndex = this.edges.length;
      this.edges.push(edgeWithTimestamp);
      
      // Update edge index
      if (!this.edgeIndex.has(edge.type)) {
        this.edgeIndex.set(edge.type, new Set());
      }
      this.edgeIndex.get(edge.type)?.add(edgeIndex);
    }
  }

  getNode(id: string): KnowledgeNode | undefined {
    return this.nodes.get(id);
  }

  getEdgesForNode(id: string): KnowledgeEdge[] {
    return this.edges.filter((e) => e.source === id || e.target === id);
  }

  getNodesByType(type: NodeType): KnowledgeNode[] {
    const nodeIds = this.nodeIndex.get(type) || new Set();
    return Array.from(nodeIds).map(id => this.nodes.get(id)!);
  }

  getEdgesByType(type: string): KnowledgeEdge[] {
    const edgeIndices = this.edgeIndex.get(type) || new Set();
    return Array.from(edgeIndices).map(index => this.edges[index]);
  }

  getAllNodes(): KnowledgeNode[] {
    return Array.from(this.nodes.values());
  }

  getAllEdges(): KnowledgeEdge[] {
    return this.edges;
  }

  /**
   * Query nodes with filters
   */
  queryNodes(query: GraphQuery): KnowledgeNode[] {
    let result = this.getAllNodes();

    if (query.nodeTypes && query.nodeTypes.length > 0) {
      result = result.filter(node => query.nodeTypes!.includes(node.type));
    }

    if (query.filters) {
      result = result.filter(node =>
  Object.entries(query.filters!).every(([key, value]) =>
    node.metadata?.[key] === value
  )
);
    }

    if (query.offset) {
      result = result.slice(query.offset);
    }

    if (query.limit) {
      result = result.slice(0, query.limit);
    }

    return result;
  }

  /**
   * Find nodes connected to a specific node
   */
  getConnectedNodes(nodeId: string, maxDepth: number = 1): KnowledgeNode[] {
    const visited = new Set<string>();
    const result: KnowledgeNode[] = [];
    const queue: { id: string; depth: number }[] = [{ id: nodeId, depth: 0 }];

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      
      if (visited.has(id) || depth > maxDepth) continue;
      visited.add(id);

      const edges = this.getEdgesForNode(id);
      for (const edge of edges) {
        const connectedId = edge.source === id ? edge.target : edge.source;
        if (!visited.has(connectedId)) {
          const node = this.getNode(connectedId);
          if (node) {
            result.push(node);
            if (depth < maxDepth) {
              queue.push({ id: connectedId, depth: depth + 1 });
            }
          }
        }
      }
    }

    return result;
  }

  /**
   * Get graph statistics
   */
  getStats(): GraphStats {
    const nodeTypes: Record<NodeType, number> = {} as Record<NodeType, number>;
    const edgeTypes: Record<string, number> = {};

    // Count node types
    for (const node of this.nodes.values()) {
      nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
    }

    // Count edge types
    for (const edge of this.edges) {
      edgeTypes[edge.type] = (edgeTypes[edge.type] || 0) + 1;
    }

    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edges.length,
      nodeTypes,
      edgeTypes,
    };
  }

  /**
   * Update node metadata
   */
  updateNode(id: string, metadata: Record<string, unknown>) {
    const node = this.nodes.get(id);
    if (node) {
      node.metadata = { ...node.metadata, ...metadata };
      node.updatedAt = Date.now();
      this.nodes.set(id, node);
    }
  }

  /**
   * Remove node and all its edges
   */
  removeNode(id: string) {
    if (this.nodes.has(id)) {
      const node = this.nodes.get(id)!;
      
      // Remove from node index
      this.nodeIndex.get(node.type)?.delete(id);
      
      // Remove all connected edges
      const edgesToRemove = this.edges
        .map((edge, index) => ({ edge, index }))
        .filter(({ edge }) => edge.source === id || edge.target === id)
        .map(({ index }) => index)
        .sort((a, b) => b - a); // Sort in descending order to avoid index shifting

      for (const index of edgesToRemove) {
        const edge = this.edges[index];
        this.edgeIndex.get(edge.type)?.delete(index);
        this.edges.splice(index, 1);
      }

      // Remove the node
        this.nodes.delete(id); 
    }
    }

  /**
   * Clear the entire graph
   */
  clearGraph() {
        this.nodes.clear();
    this.edges = [];
    this.nodeIndex.forEach(set => set.clear());
    this.edgeIndex.clear();
  }

  /**
   * Export graph data
   */
  exportGraph(): { nodes: KnowledgeNode[]; edges: KnowledgeEdge[] } {
    return {
      nodes: this.getAllNodes(),
      edges: this.getAllEdges(),
    };
  }

  /**
   * Import graph data
   */
  importGraph(data: { nodes: KnowledgeNode[]; edges: KnowledgeEdge[] }) {
    this.clearGraph();
    
    for (const node of data.nodes) {
      this.addNode(node);
    }
    
    for (const edge of data.edges) {
      this.addEdge(edge);
    }
    }
}  
