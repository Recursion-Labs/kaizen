/**
 * RAG Context Service
 *
 * Provides access to RAG-generated context from the background script
 * for enhancing AI responses with personalized behavior insights.
 */

interface RAGContext {
  behaviors: Array<{ id: string; metadata: unknown }>;
  patterns: Array<{ id: string; metadata: unknown }>;
  recentActivity: Array<{ type: string; timestamp: number; data: unknown }>;
  userProfile: Record<string, unknown>;
  timestamp: number;
}

interface ProductivityStats {
  productivityScore: number;
  todayStats: {
    productive: number;
    entertainment: number;
    neutral: number;
  };
  knowledgeGraphStats: {
    nodeCount: number;
    edgeCount: number;
    nodeTypes: Record<string, number>;
    edgeTypes: Record<string, number>;
  };
  activeSessions: {
    time: Map<number, unknown>;
    shopping: Map<string, unknown>;
    doomscrolling: Map<number, unknown>;
  };
}

class RAGContextService {
  private static instance: RAGContextService;
  private cache: {
    context?: RAGContext;
    stats?: ProductivityStats;
    timestamp: number;
  } = { timestamp: 0 };
  private readonly CACHE_DURATION = 30000; // 30 seconds

  static getInstance(): RAGContextService {
    if (!RAGContextService.instance) {
      RAGContextService.instance = new RAGContextService();
    }
    return RAGContextService.instance;
  }

  /**
   * Get RAG context for AI nudges
   */
  async getRAGContext(): Promise<RAGContext | null> {
    // Check cache first
    if (this.cache.context && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
      return this.cache.context;
    }

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_RAG_CONTEXT'
      });

      if (response.success) {
        this.cache.context = response.context;
        this.cache.timestamp = Date.now();
        return response.context;
      } else {
        console.error('Failed to get RAG context:', response.error);
        return null;
      }
    } catch (error) {
      console.error('Error requesting RAG context:', error);
      return null;
    }
  }

  /**
   * Get productivity statistics
   */
  async getProductivityStats(): Promise<ProductivityStats | null> {
    // Check cache first
    if (this.cache.stats && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
      return this.cache.stats;
    }

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_PRODUCTIVITY_STATS'
      });

      if (response.success) {
        this.cache.stats = response.stats;
        this.cache.timestamp = Date.now();
        return response.stats;
      } else {
        console.error('Failed to get productivity stats:', response.error);
        return null;
      }
    } catch (error) {
      console.error('Error requesting productivity stats:', error);
      return null;
    }
  }

  /**
   * Generate enhanced prompt with RAG context
   */
  async generateEnhancedPrompt(
    userQuery: string,
    includeStats: boolean = false
  ): Promise<string> {
    const [context, stats] = await Promise.all([
      this.getRAGContext(),
      includeStats ? this.getProductivityStats() : Promise.resolve(null)
    ]);

    let enhancedPrompt = `You are Kaizen, an AI assistant focused on productivity, learning, and digital well-being. `;

    if (context) {
      enhancedPrompt += `\n\nBased on the user's behavior patterns, here is relevant context:\n`;

      // Add behavior insights
      if (context.behaviors.length > 0) {
        enhancedPrompt += `\nRecent behaviors detected:\n`;
        context.behaviors.slice(0, 3).forEach(behavior => {
          const metadata = behavior.metadata as Record<string, unknown>;
          if (metadata?.type) {
            enhancedPrompt += `- ${String(metadata.type)}: ${metadata.severity || 'detected'}\n`;
          }
        });
      }

      // Add pattern insights
      if (context.patterns.length > 0) {
        enhancedPrompt += `\nBehavior patterns identified:\n`;
        context.patterns.slice(0, 2).forEach(pattern => {
          const metadata = pattern.metadata as Record<string, unknown>;
          if (metadata?.type && metadata?.description) {
            enhancedPrompt += `- ${String(metadata.type)}: ${String(metadata.description).substring(0, 100)}...\n`;
          }
        });
      }

      // Add user profile insights
      if (context.userProfile) {
        const profile = context.userProfile as Record<string, unknown>;
        if (profile.activityLevel) {
          enhancedPrompt += `\nUser activity level: ${String(profile.activityLevel)}\n`;
        }
        if (profile.totalNodes) {
          enhancedPrompt += `Knowledge graph contains ${String(profile.totalNodes)} behavior insights.\n`;
        }
      }
    }

    if (stats) {
      enhancedPrompt += `\n\nCurrent productivity metrics:\n`;
      enhancedPrompt += `- Productivity score: ${(stats.productivityScore * 100).toFixed(1)}%\n`;
      enhancedPrompt += `- Today's time breakdown:\n`;
      enhancedPrompt += `  - Productive: ${Math.round(stats.todayStats.productive / 60000)} minutes\n`;
      enhancedPrompt += `  - Entertainment: ${Math.round(stats.todayStats.entertainment / 60000)} minutes\n`;
      enhancedPrompt += `  - Neutral: ${Math.round(stats.todayStats.neutral / 60000)} minutes\n`;
    }

    enhancedPrompt += `\n\nUser query: ${userQuery}\n\n`;
    enhancedPrompt += `Please provide a helpful, personalized response that takes into account the user's behavior patterns and productivity goals. Be encouraging and supportive while offering practical advice.`;

    return enhancedPrompt;
  }

  /**
   * Clear cache (useful when user behavior changes significantly)
   */
  clearCache(): void {
    this.cache = { timestamp: 0 };
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { hasContext: boolean; hasStats: boolean; age: number } {
    const age = Date.now() - this.cache.timestamp;
    return {
      hasContext: !!this.cache.context,
      hasStats: !!this.cache.stats,
      age
    };
  }
}

export { RAGContextService };
export type { RAGContext, ProductivityStats };