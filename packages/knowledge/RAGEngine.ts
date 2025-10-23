// Retrieval + context builder for AI with enhanced functionality

import type { EmbeddingService } from "./EmbeddingService";
import type { KnowledgeGraph, KnowledgeNode, KnowledgeEdge, NodeType } from "./KnowledgeGraph";

export interface RAGConfig {
  maxContextNodes: number;
  maxContextEdges: number;
  similarityThreshold: number;
  includeMetadata: boolean;
  timeDecayFactor: number; // for recency weighting
}

export interface ContextResult {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  context: Record<string, unknown>;
  relevanceScore: number;
  timestamp: number;
}

export interface BehaviorContext {
  behaviors: Array<{ id: string; metadata: unknown }>;
  patterns: Array<{ id: string; metadata: unknown }>;
  recentActivity: Array<{ type: string; timestamp: number; data: unknown }>;
  userProfile: Record<string, unknown>;
  timestamp: number;
}

export class RAGEngine {
  private KG: KnowledgeGraph;
  private embeddingService: EmbeddingService;
  private config: RAGConfig;

  constructor(
    kG: KnowledgeGraph,
    embeddingService: EmbeddingService,
    config?: Partial<RAGConfig>
  ) {
    this.KG = kG;
    this.embeddingService = embeddingService;
    this.config = {
      maxContextNodes: 50,
      maxContextEdges: 100,
      similarityThreshold: 0.7,
      includeMetadata: true,
      timeDecayFactor: 0.1,
      ...config,
    };
  }

  /**
   * Retrieve behavior context for a specific behavior type
   */
  retrieveBehaviorContext(behaviorType: string): KnowledgeNode[] {
    return this.KG.getAllNodes().filter(
      (node) => node.type === "behavior" && node.id.includes(behaviorType)
    );
  }

  /**
   * Retrieve recent patterns with limit
   */
  retrieveRecentPatterns(limit: number = 10): KnowledgeNode[] {
    const patterns = this.KG.getAllNodes().filter((n) => n.type === "pattern");
    return patterns.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
  }

  /**
   * Retrieve context based on semantic similarity
   */
  async retrieveSemanticContext(
    query: string,
    nodeTypes?: NodeType[]
  ): Promise<ContextResult> {
    const queryEmbedding = await this.embeddingService.embedText(query);
    const allNodes = nodeTypes
      ? this.KG.getAllNodes().filter((node) => nodeTypes.includes(node.type))
      : this.KG.getAllNodes();

    const scoredNodes = await Promise.all(
      allNodes.map(async (node) => {
        const nodeText = this.nodeToText(node);
        const nodeEmbedding = await this.embeddingService.embedText(nodeText);
        const similarity = this.embeddingService.calculateSimilarity(
          queryEmbedding,
          nodeEmbedding
        );

        return {
          node,
          similarity,
          recencyScore: this.calculateRecencyScore(node.createdAt),
        };
      })
    );

    const relevantNodes = scoredNodes
      .filter((item) => item.similarity >= this.config.similarityThreshold)
      .sort((a, b) => {
        const scoreA = a.similarity + a.recencyScore;
        const scoreB = b.similarity + b.recencyScore;
        return scoreB - scoreA;
      })
      .slice(0, this.config.maxContextNodes)
      .map((item) => item.node);

    const edges = this.getRelevantEdges(relevantNodes);
    const context = this.buildContext(relevantNodes, edges);

    return {
      nodes: relevantNodes,
      edges,
      context,
      relevanceScore:
        scoredNodes.reduce((sum, item) => sum + item.similarity, 0) /
        scoredNodes.length,
      timestamp: Date.now(),
    };
  }

  /**
   * Generate comprehensive context for nudging
   */
  generateContextForNudge(): BehaviorContext {
    const behaviors = this.retrieveBehaviorContext("doomscrolling").map(
      (b) => ({
        id: b.id,
        metadata: b.metadata,
      })
    );

    const patterns = this.retrieveRecentPatterns().map((p) => ({
      id: p.id,
      metadata: p.metadata,
    }));

    const recentActivity = this.getRecentActivity();
    const userProfile = this.buildUserProfile();

    return {
      behaviors,
      patterns,
      recentActivity,
      userProfile,
      timestamp: Date.now(),
    };
  }

  /**
   * Get full graph for visualization or AI reference
   */
  getFullGraph() {
    return {
      nodes: this.KG.getAllNodes(),
      edges: this.KG.getAllEdges(),
      stats: this.KG.getStats(),
    };
  }

  /**
   * Find similar behaviors based on patterns
   */
  async findSimilarBehaviors(
    targetBehavior: string,
    limit: number = 5
  ): Promise<Array<{ behavior: KnowledgeNode; similarity: number }>> {
    const targetNode = this.KG.getNode(targetBehavior);
    if (!targetNode) return [];

    const behaviorNodes = this.KG.getNodesByType("behavior");
    const similarities = await Promise.all(
      behaviorNodes.map(async (node) => {
        const similarity = await this.calculateNodeSimilarity(targetNode, node);
        return { behavior: node, similarity };
      })
    );

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * Get contextual recommendations based on current state
   */
  async getContextualRecommendations(
    currentContext: string
  ): Promise<
    Array<{ recommendation: string; confidence: number; reasoning: string }>
  > {
    const contextResult = await this.retrieveSemanticContext(currentContext);
    const recommendations: Array<{
      recommendation: string;
      confidence: number;
      reasoning: string;
    }> = [];

    // Analyze patterns and suggest interventions
    for (const node of contextResult.nodes) {
      if (node.type === "pattern" && node.metadata?.severity === "high") {
        recommendations.push({
          recommendation: `Address ${node.id} pattern with high priority`,
          confidence: 0.9,
          reasoning: `High severity pattern detected: ${node.metadata?.description}`,
        });
      }
    }

    return recommendations;
  }

  /**
   * Convert node to text for embedding
   */
  private nodeToText(node: KnowledgeNode): string {
    let text = `${node.type}: ${node.id}`;
    if (node.metadata) {
      text += ` ${JSON.stringify(node.metadata)}`;
    }
    return text;
  }

  /**
   * Calculate recency score for time-based weighting
   */
  private calculateRecencyScore(timestamp: number): number {
    const now = Date.now();
    const ageInHours = (now - timestamp) / (1000 * 60 * 60);
    return Math.exp(-this.config.timeDecayFactor * ageInHours);
  }

  /**
   * Get relevant edges for context nodes
   */
  private getRelevantEdges(nodes: KnowledgeNode[]): KnowledgeEdge[] {
    const nodeIds = new Set(nodes.map((n) => n.id));
    const edges = this.KG.getAllEdges();

    return edges
      .filter((edge) => nodeIds.has(edge.source) || nodeIds.has(edge.target))
      .slice(0, this.config.maxContextEdges);
  }

  /**
   * Build context object from nodes and edges
   */
  private buildContext(
    nodes: KnowledgeNode[],
    edges: KnowledgeEdge[]
  ): Record<string, unknown> {
    const context: Record<string, unknown> = {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      nodeTypes: {} as Record<string, number>,
      patterns: [] as Array<{ id: string; metadata?: Record<string, unknown> }>,
      behaviors: [] as Array<{ id: string; metadata?: Record<string, unknown> }>,
    };

    // Categorize nodes
    for (const node of nodes) {
      const nodeTypes = context.nodeTypes as Record<string, number>;
      if (!nodeTypes[node.type]) {
        nodeTypes[node.type] = 0;
      }
      nodeTypes[node.type]++;

      const patterns = context.patterns as Array<{ id: string; metadata?: Record<string, unknown> }>;
      const behaviors = context.behaviors as Array<{ id: string; metadata?: Record<string, unknown> }>;

      if (node.type === "pattern") {
        patterns.push({
          id: node.id,
          metadata: this.config.includeMetadata ? node.metadata : undefined,
        });
      }

      if (node.type === "behavior") {
        behaviors.push({
          id: node.id,
          metadata: this.config.includeMetadata ? node.metadata : undefined,
        });
      }
    }

    return context;
  }

  /**
   * Get recent activity from the knowledge graph
   */
  private getRecentActivity(): Array<{
    type: string;
    timestamp: number;
    data: unknown;
  }> {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    const recentNodes = this.KG.getAllNodes()
      .filter((node) => node.updatedAt > oneHourAgo)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 20);

    return recentNodes.map((node) => ({
      type: node.type,
      timestamp: node.updatedAt,
      data: {
        id: node.id,
        metadata: node.metadata,
      },
    }));
  }

  /**
   * Build user profile from graph data
   */
  private buildUserProfile(): Record<string, unknown> {
    const stats = this.KG.getStats();
    const recentPatterns = this.retrieveRecentPatterns(5);

    return {
      totalNodes: stats.nodeCount,
      totalEdges: stats.edgeCount,
      nodeTypeDistribution: stats.nodeTypes,
      recentPatterns: recentPatterns.map((p) => ({
        id: p.id,
        severity: p.metadata?.severity,
        timestamp: p.createdAt,
      })),
      activityLevel: this.calculateActivityLevel(),
    };
  }

  /**
   * Calculate activity level based on recent updates
   */
  private calculateActivityLevel(): "low" | "medium" | "high" {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const recentUpdates = this.KG.getAllNodes().filter(
      (node) => node.updatedAt > oneHourAgo
    ).length;

    if (recentUpdates > 20) return "high";
    if (recentUpdates > 10) return "medium";
    return "low";
  }

  /**
   * Calculate similarity between two nodes
   */
  private async calculateNodeSimilarity(
    node1: KnowledgeNode,
    node2: KnowledgeNode
  ): Promise<number> {
    const text1 = this.nodeToText(node1);
    const text2 = this.nodeToText(node2);

    const embedding1 = await this.embeddingService.embedText(text1);
    const embedding2 = await this.embeddingService.embedText(text2);

    return this.embeddingService.calculateSimilarity(embedding1, embedding2);
  }
}
