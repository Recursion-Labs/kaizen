// Embeddings service for behaviors & nudges with multiple model providers and caching


// Check if we're in a Chrome extension environment
const isChromeExtension = typeof chrome !== 'undefined' && chrome.storage;

// Lazy load Node.js modules only if not in Chrome extension
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fs: any, path: any;
let createHash: (algorithm: string) => any; // Declare createHash here
if (!isChromeExtension) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    path = require('path');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    createHash = require('crypto').createHash; // Assign Node.js crypto's createHash
  } catch {
    // Node modules not available
  }
} else {
  // Provide a browser-compatible hash function for the cache key
  createHash = (algorithm: string) => {
    return {
      update: (text: string) => ({
        digest: (encoding: string) => {
          // A simple non-cryptographic hash for browser environment
          let hash = 0;
          for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
          }
          return Math.abs(hash).toString(16); // Hex representation
        }
      })
    };
  };
}

export interface EmbeddingConfig {
  modelProvider: "gemini" | "openai" | "local";
  modelName: string;
  cacheDir: string;
  localEndpoint?: string;
  apiKey?: string;
  maxRetries: number;
  timeout: number;
}

export interface EmbeddingResult {
  vector: number[];
  model: string;
  cached: boolean;
  timestamp: number;
}

export class EmbeddingService {
  private config: EmbeddingConfig;
  private cache: Map<string, EmbeddingResult> = new Map();

  constructor(config?: Partial<EmbeddingConfig>) {
    this.config = {
      modelProvider: "gemini",
      modelName: "gemini-nano",
      cacheDir: isChromeExtension ? "" : (path && path.join(__dirname, ".cache/embeddings_cache") || ""),
      maxRetries: 3,
      timeout: 30000, // 30 seconds
      ...config,
    };

    if (!isChromeExtension && fs && path) {
      if (!fs.existsSync(this.config.cacheDir)) {
        fs.mkdirSync(this.config.cacheDir, { recursive: true });
      }
    }
  }

    /**
   * Hash based caching to avoid re-embedding same text
    */
  private getCacheKey(text: string): string {
        return createHash("sha256").update(text).digest("hex");
    }

  private getCachePath(key: string): string {
    if (!path) return "";
    return path.join(this.config.cacheDir, `${key}.json`);
  }

    /** 
     * Fetches embedding vector for given text using caching and model routing
     */
  async embedText(text: string): Promise<number[]> {
    const key = this.getCacheKey(text);
    
    // Check memory cache first
    if (this.cache.has(key)) {
      return this.cache.get(key)!.vector;
    }

    // Check file cache (Node.js environment)
    if (!isChromeExtension && fs && path) {
      const cachePath = this.getCachePath(key);
      if (fs.existsSync(cachePath)) {
        try {
          const cached = JSON.parse(fs.readFileSync(cachePath, "utf8"));
          const result: EmbeddingResult = {
            vector: cached.vector,
            model: cached.model || this.config.modelName,
            cached: true,
            timestamp: cached.timestamp || Date.now(),
          };
          this.cache.set(key, result);
          return result.vector;
        } catch (error) {
          console.warn(`Failed to read cache file: ${error}`);
        }
      }
    }

    // Check Chrome storage cache (Chrome extension environment)
    if (isChromeExtension) {
      try {
        const result = await chrome.storage.local.get(`embedding_${key}`);
        if (result[`embedding_${key}`]) {
          const cached = result[`embedding_${key}`];
          const cacheResult: EmbeddingResult = {
            vector: cached.vector,
            model: cached.model || this.config.modelName,
            cached: true,
            timestamp: cached.timestamp || Date.now(),
          };
          this.cache.set(key, cacheResult);
          return cacheResult.vector;
        }
      } catch (error) {
        console.warn(`Failed to read Chrome storage cache: ${error}`);
      }
    }

    // Generate new embedding
    let vector: number[] | undefined;
    let attempts = 0;

    while (attempts < this.config.maxRetries) {
      try {
        switch (this.config.modelProvider) {
          case "gemini":
            vector = await this.embedWithGemini(text);
            break;
          case "openai":
            vector = await this.embedWithOpenAI(text);
            break;
          case "local":
            vector = await this.embedWithLocalModel(text);
            break;
          default:
            throw new Error(`Unsupported model provider: ${this.config.modelProvider}`);
        }
        break;
      } catch (error) {
        attempts++;
        if (attempts >= this.config.maxRetries) {
          throw new Error(`Failed to generate embedding after ${this.config.maxRetries} attempts: ${error}`);
        }
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
      }
    }

    if (!vector) {
      throw new Error("Failed to generate embedding vector");
    }

    const result: EmbeddingResult = {
      vector,
      model: this.config.modelName,
      cached: false,
      timestamp: Date.now(),
    };

    // Cache the result
    this.cache.set(key, result);
    
    // Save to file cache (Node.js environment)
    if (!isChromeExtension && fs && path) {
      try {
        const cachePath = this.getCachePath(key);
        fs.writeFileSync(cachePath, JSON.stringify({
          text,
          vector,
          model: this.config.modelName,
          timestamp: result.timestamp,
        }, null, 2), "utf8");
      } catch (error) {
        console.warn(`Failed to write cache file: ${error}`);
      }
    }

    // Save to Chrome storage (Chrome extension environment)
    if (isChromeExtension) {
      try {
        await chrome.storage.local.set({
          [`embedding_${key}`]: {
            text,
            vector,
            model: this.config.modelName,
            timestamp: result.timestamp,
          }
        });
      } catch (error) {
        console.warn(`Failed to write Chrome storage cache: ${error}`);
      }
    }

        return vector;
    }

  /**
   * Embed multiple texts in batch
   */
  async embedTexts(texts: string[]): Promise<number[][]> {
    const promises = texts.map(text => this.embedText(text));
    return Promise.all(promises);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  calculateSimilarity(vector1: number[], vector2: number[]): number {
    if (vector1.length !== vector2.length) {
      throw new Error("Vectors must have the same length");
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      norm1 += vector1[i] * vector1[i];
      norm2 += vector2[i] * vector2[i];
    }

    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (norm1 * norm2);
  }

  /**
   * Find most similar texts to a query text
   */
  async findSimilarTexts(queryText: string, candidateTexts: string[], topK: number = 5): Promise<Array<{ text: string; similarity: number; index: number }>> {
    const queryVector = await this.embedText(queryText);
    const candidateVectors = await this.embedTexts(candidateTexts);

    const similarities = candidateVectors.map((vector, index) => ({
      text: candidateTexts[index],
      similarity: this.calculateSimilarity(queryVector, vector),
      index,
    }));

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { memoryCacheSize: number; cacheDir: string } {
    return {
      memoryCacheSize: this.cache.size,
      cacheDir: this.config.cacheDir,
    };
  }

  /**
   * Embed with Gemini API
   */
  private async embedWithGemini(text: string): Promise<number[]> {
    if (!this.config.apiKey) {
      throw new Error("API key required for Gemini provider");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.config.modelName}:embedContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          content: {
            parts: [{ text }]
          }
        }),
        signal: AbortSignal.timeout(this.config.timeout),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding.values;
  }

  /**
   * Embed with OpenAI API
   */
  private async embedWithOpenAI(text: string): Promise<number[]> {
    if (!this.config.apiKey) {
      throw new Error("API key required for OpenAI provider");
    }

    const response = await fetch(
      'https://api.openai.com/v1/embeddings',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          model: this.config.modelName,
        }),
        signal: AbortSignal.timeout(this.config.timeout),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  }

  /**
   * Embed with local model
  */
  private async embedWithLocalModel(text: string): Promise<number[]> {
    if (!this.config.localEndpoint) {
      throw new Error("Local endpoint required for local provider");
    }

    const response = await fetch(
      this.config.localEndpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model: this.config.modelName,
        }),
        signal: AbortSignal.timeout(this.config.timeout),
      }
    );

    if (!response.ok) {
      throw new Error(`Local model error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding;
  }
}
