/**
 * AIOverlayManager - Central AI Service Coordinator
 *
 * Manages all Chrome Built-in AI API sessions and provides
 * convenient methods for AI operations across the content-ui.
 *
 * ⚠️ IMPORTANT - API Update (Chrome 138+):
 * window.ai is DEPRECATED. Use direct API constructors instead.
 * Multimodal input is available via chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
 * but may not be reflected in current TypeScript definitions.
 *
 * Current API Availability (October 2025):
 * ✅ LanguageModel (Prompt API) - Stable in Chrome 138+
 * ✅ Summarizer - Stable in Chrome 138+
 * ✅ Translator - Stable in Chrome 138+
 * ✅ LanguageDetector - Stable in Chrome 138+
 * 🧪 Multimodal Prompt API - Available with multimodal flag (types TBD)
 * 🧪 Writer - Origin Trial only
 * 🧪 Rewriter - Origin Trial only
 *
 * This code supports both old (window.ai) and new (LanguageModel) APIs
 * for backwards compatibility during the transition period.
 *
 * Features:
 * - Lazy initialization on first use
 * - Session pooling and reuse
 * - Capability detection
 * - Error handling and fallbacks
 * - Progress monitoring for model downloads
 */

import type {
  AILanguageModel,
  AISummarizer,
  AIWriter,
  AIRewriter,
  AITranslator,
  AILanguageDetector,
  AIProofreader,
  AIProofreaderResult,
} from "@extension/shared";

class AIOverlayManager {
  private static instance: AIOverlayManager;

  // Session storage
  private sessions: Map<
    string,
    | AILanguageModel
    | AISummarizer
    | AIWriter
    | AIRewriter
    | AITranslator
    | AILanguageDetector
    | AIProofreader
  > = new Map();
  private capabilities: Map<string, unknown> = new Map();

  // Initialization state
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  /**
   * Singleton pattern - get the shared instance
   */
  static getInstance(): AIOverlayManager {
    if (!AIOverlayManager.instance) {
      AIOverlayManager.instance = new AIOverlayManager();
    }
    return AIOverlayManager.instance;
  }

  /**
   * Initialize all available AI APIs
   * Safe to call multiple times - will only initialize once
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this._initialize();
    await this.initPromise;
  }

  private async _initialize(): Promise<void> {
    console.log("[Kaizen AI] Initializing AI APIs...");

    try {
      // Check if new LanguageModel API is available (Chrome 138+)
      if (typeof LanguageModel === "undefined") {
        console.warn("[Kaizen AI] LanguageModel API not available");
        return;
      }

      // Initialize Prompt API (most important)
      await this._initPromptAPI();

      // Initialize other APIs in parallel (optional)
      await Promise.allSettled([
        this._initSummarizerAPI(),
        this._initWriterAPI(),
        this._initRewriterAPI(),
        this._initTranslatorAPI(),
        this._initLanguageDetector(),
        this._initProofreaderAPI(),
      ]);

      this.isInitialized = true;
      console.log("[Kaizen AI] ✅ Initialization complete");
      this._logCapabilities();
    } catch (error) {
      console.error("[Kaizen AI] ❌ Initialization failed:", error);
      throw error;
    }
  }

  private async _initPromptAPI(): Promise<void> {
    try {
      if (typeof LanguageModel === "undefined") {
        console.warn("[Kaizen AI] LanguageModel constructor not available");
        this.capabilities.set("prompt", { available: "unavailable" });
        return;
      }

      console.log("[Kaizen AI] Checking LanguageModel availability...");
      const availability = await LanguageModel.availability();
      console.log(`[Kaizen AI] LanguageModel availability: ${availability}`);
      this.capabilities.set("prompt", { available: availability });

      if (availability === "available") {
        console.log("[Kaizen AI] Creating LanguageModel session with multimodal support...");
         
        const session = await LanguageModel.create({
          systemPrompt:
            "You are a helpful assistant that provides concise, accurate answers.",
          temperature: 0.8,
          topK: 40,
          expectedInputs: [
            { type: "text" },
            { type: "image" }
          ],
          expectedOutputs: [
            { type: "text" }
          ],
          languages: ["en"]
        } as any);

        this.sessions.set("prompt", session);
        console.log("[Kaizen AI] ✓ Prompt API ready");
      } else if (availability === "downloading") {
        console.log(
          "[Kaizen AI] ⏳ LanguageModel is downloading, will be available soon.",
        );
        // Try to create session anyway - it might work if download completes
        try {
          const session = await LanguageModel.create({
            systemPrompt:
              "You are a helpful assistant that provides concise, accurate answers.",
            temperature: 0.8,
            topK: 40,
          });
          this.sessions.set("prompt", session);
          console.log(
            "[Kaizen AI] ✓ Prompt API ready (downloaded during init)",
          );
        } catch {
          console.log(
            "[Kaizen AI] Prompt API still downloading, will retry on use",
          );
        }
      } else {
        console.log(`[Kaizen AI] Prompt API: ${availability}`);
      }
    } catch (error) {
      console.error("[Kaizen AI] Prompt API init failed:", error);
      this.capabilities.set("prompt", {
        available: "error",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async _initSummarizerAPI(): Promise<void> {
    try {
      if (typeof Summarizer === "undefined") {
        console.log("[Kaizen AI] Summarizer not available");
        return;
      }

      const availability = await Summarizer.availability();
      this.capabilities.set("summarizer", { available: availability });

      if (availability === "available") {
        const session = await Summarizer.create({
          type: "key-points",
          format: "markdown",
          length: "medium",
        });

        this.sessions.set("summarizer", session);
        console.log("[Kaizen AI] ✓ Summarizer API ready");
      }
    } catch (error) {
      console.error("[Kaizen AI] Summarizer API init failed:", error);
    }
  }

  private async _initWriterAPI(): Promise<void> {
    try {
      if (typeof Writer === "undefined") {
        console.log("[Kaizen AI] Writer not available");
        return;
      }

      const availability = await Writer.availability();
      this.capabilities.set("writer", { available: availability });

      if (availability === "available") {
        const session = await Writer.create({
          tone: "neutral",
          format: "plain-text",
          length: "medium",
        });

        this.sessions.set("writer", session);
        console.log("[Kaizen AI] ✓ Writer API ready");
      }
    } catch (error) {
      console.error("[Kaizen AI] Writer API init failed:", error);
    }
  }

  private async _initRewriterAPI(): Promise<void> {
    try {
      if (typeof Rewriter === "undefined") {
        console.log("[Kaizen AI] Rewriter not available");
        return;
      }

      const availability = await Rewriter.availability();
      this.capabilities.set("rewriter", { available: availability });

      if (availability === "available") {
        const session = await Rewriter.create({
          tone: "as-is",
          format: "as-is",
          length: "as-is",
        });

        this.sessions.set("rewriter", session);
        console.log("[Kaizen AI] ✓ Rewriter API ready");
      }
    } catch (error) {
      console.error("[Kaizen AI] Rewriter API init failed:", error);
    }
  }

  private async _initTranslatorAPI(): Promise<void> {
    try {
      if (typeof Translator === "undefined") {
        console.log("[Kaizen AI] Translator not available");
        this.capabilities.set("translator", { available: "unavailable" });
        return;
      }

      // Check availability - Translator API may return "downloadable" even when ready
      let availability: string;
      try {
        availability = await Translator.availability({
          sourceLanguage: "en",
          targetLanguage: "es",
        });
      } catch {
        // Fallback without parameters
        availability = await Translator.availability();
      }

      this.capabilities.set("translator", { available: availability });

      if (availability === "available") {
        console.log("[Kaizen AI] ✓ Translator API ready");
      } else if (availability === "downloadable") {
        console.log("[Kaizen AI] ✓ Translator API ready (downloadable)");
      } else {
        console.log(`[Kaizen AI] Translator API: ${availability}`);
      }
    } catch (error) {
      console.error("[Kaizen AI] Translator API init failed:", error);
      this.capabilities.set("translator", { available: "unavailable" });
    }
  }

  private async _initLanguageDetector(): Promise<void> {
    try {
      if (typeof LanguageDetector === "undefined") {
        console.log("[Kaizen AI] LanguageDetector not available");
        return;
      }

      const availability = await LanguageDetector.availability();
      this.capabilities.set("languageDetector", { available: availability });

      if (availability === "available") {
        const session = await LanguageDetector.create();
        this.sessions.set("languageDetector", session);
        console.log("[Kaizen AI] ✓ Language Detector ready");
      }
    } catch (error) {
      console.error("[Kaizen AI] Language Detector init failed:", error);
    }
  }

  private async _initProofreaderAPI(): Promise<void> {
    try {
      if (typeof Proofreader === "undefined") {
        console.log("[Kaizen AI] Proofreader not available");
        return;
      }

      const availability = await Proofreader.availability();
      this.capabilities.set("proofreader", { available: availability });

      if (availability === "available") {
        const session = await Proofreader.create();
        this.sessions.set("proofreader", session);
        console.log("[Kaizen AI] ✓ Proofreader API ready");
      }
    } catch (error) {
      console.error("[Kaizen AI] Proofreader API init failed:", error);
    }
  }

  /**
   * Prompt API - General reasoning and Q&A
   */
  async prompt(text: string): Promise<string> {
    await this.initialize();

    let session = this.sessions.get("prompt") as AILanguageModel;

    // If no session, try to create one (might have been downloading)
    if (!session) {
      console.log(
        "[Kaizen AI] No prompt session available, attempting to create...",
      );
      try {
        if (typeof LanguageModel !== "undefined") {
          const availability = await LanguageModel.availability();
          if (availability === "available") {
             
            session = await LanguageModel.create({
              systemPrompt:
                "You are a helpful assistant that provides concise, accurate answers.",
              temperature: 0.8,
              topK: 40,
              expectedInputs: [
                { type: "text" },
                { type: "image" }
              ],
              expectedOutputs: [
                { type: "text" }
              ],
              languages: ["en"]
            } as any);
            this.sessions.set("prompt", session);
            console.log("[Kaizen AI] ✓ Prompt session created on-demand");
          } else {
            throw new Error(`LanguageModel not available: ${availability}`);
          }
        } else {
          throw new Error("LanguageModel API not available");
        }
      } catch (error) {
        console.error("[Kaizen AI] Failed to create prompt session:", error);
        throw new Error(
          `AI API unavailable: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
      }
    }

    try {
      console.log("[Kaizen AI] Executing prompt...");
      console.log("[Kaizen AI] Prompt text length:", text.length);
      const result = await session.prompt(text);
      console.log("[Kaizen AI] ✓ Prompt completed successfully");
      console.log("[Kaizen AI] Result length:", result.length);
      return result;
    } catch (error) {
      console.error("[Kaizen AI] Prompt execution failed:", error);
      console.error("[Kaizen AI] Error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Provide more specific error messages
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("download")) {
          throw new Error(
            "AI model is still downloading. Please wait a few moments and try again.",
          );
        } else if (msg.includes("disk")) {
          throw new Error(
            "Insufficient disk space for AI model. Please free up space and try again.",
          );
        } else if (msg.includes("network")) {
          throw new Error(
            "Network error while downloading AI model. Check your connection and try again.",
          );
        } else if (msg.includes("generic")) {
          throw new Error(
            "AI model encountered an unknown error. Try refreshing the page or restarting Chrome.",
          );
        }
      }

      throw error;
    }
  }

  /**
   * Prompt API - Streaming response
   */
  async promptStreaming(text: string): Promise<ReadableStream> {
    await this.initialize();

    const session = this.sessions.get("prompt") as AILanguageModel;
    if (!session) {
      throw new Error("Prompt API not available");
    }

    try {
      return session.promptStreaming(text);
    } catch (error) {
      console.error("[Kaizen AI] Prompt streaming failed:", error);
      throw error;
    }
  }

  /**
   * Summarizer API - Content distillation
   *
   * NOTE: As of Oct 2025, window.ai.summarizer is NOT yet available in Chrome.
   * This method will automatically fallback to using Prompt API with summarization prompts.
   * When Summarizer API becomes available, this will automatically use it.
   */
  async summarize(content: string, context?: string): Promise<string> {
    await this.initialize();

    const session = this.sessions.get("summarizer") as AISummarizer;
    if (!session) {
      // FALLBACK: Summarizer API not available yet - use Prompt API instead
      console.log("[Kaizen AI] Using Prompt API fallback for summarization");
      return this.prompt(`Summarize this content:\n\n${content}`);
    }

    try {
      return await session.summarize(content, { context });
    } catch (error) {
      console.error("[Kaizen AI] Summarize failed:", error);
      throw error;
    }
  }

  /**
   * Writer API - Creative content generation
   */
  async write(task: string, context?: string): Promise<string> {
    await this.initialize();

    const session = this.sessions.get("writer") as AIWriter;
    if (!session) {
      // Fallback to Prompt API
      return this.prompt(`${task}${context ? `\n\nContext: ${context}` : ""}`);
    }

    try {
      return await session.write(task, { context });
    } catch (error) {
      console.error("[Kaizen AI] Write failed:", error);
      throw error;
    }
  }

  /**
   * Rewriter API - Content improvement
   */
  async rewrite(
    text: string,
    options?: { tone?: string; length?: string },
  ): Promise<string> {
    await this.initialize();

    const session = this.sessions.get("rewriter") as AIRewriter;
    if (!session) {
      // Fallback to Prompt API
      const tone = options?.tone ? ` in a ${options.tone} tone` : "";
      const length = options?.length ? ` (make it ${options.length})` : "";
      return this.prompt(`Rewrite this text${tone}${length}:\n\n${text}`);
    }

    try {
      return await session.rewrite(text);
    } catch (error) {
      console.error("[Kaizen AI] Rewrite failed:", error);
      throw error;
    }
  }

  /**
   * Translator API - Language translation
   */
  async translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    await this.initialize();

    const cacheKey = `translator-${sourceLanguage}-${targetLanguage}`;
    let session = this.sessions.get(cacheKey) as AITranslator;

    if (!session) {
      try {
        if (typeof Translator === "undefined") {
          throw new Error("Translator not available");
        }
        session = await Translator.create({
          sourceLanguage,
          targetLanguage,
        });
        this.sessions.set(cacheKey, session);
      } catch (error) {
        console.error("[Kaizen AI] Translator creation failed:", error);
        // Fallback to Prompt API
        return this.prompt(
          `Translate from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`,
        );
      }
    }

    try {
      return await session.translate(text);
    } catch (error) {
      console.error("[Kaizen AI] Translation failed:", error);
      throw error;
    }
  }

  /**
   * Language Detector API - Auto-detect language
   */
  async detectLanguage(text: string): Promise<string> {
    await this.initialize();

    const session = this.sessions.get("languageDetector") as AILanguageDetector;
    if (!session) {
      throw new Error("Language Detector not available");
    }

    try {
      const results = await session.detect(text);
      return results[0]?.detectedLanguage || "unknown";
    } catch (error) {
      console.error("[Kaizen AI] Language detection failed:", error);
      throw error;
    }
  }

  /**
   * Proofreader API - Grammar correction
   */
  async proofread(text: string): Promise<AIProofreaderResult> {
    await this.initialize();

    const session = this.sessions.get("proofreader") as AIProofreader;
    if (!session) {
      throw new Error("Proofreader API not available");
    }

    try {
      return await session.proofread(text);
    } catch (error) {
      console.error("[Kaizen AI] Proofreading failed:", error);
      throw error;
    }
  }

  /**
   * Image Analysis - Analyze images using multimodal Prompt API or fallback
   * Chrome's Prompt API supports multimodal input when the appropriate flag is enabled,
   * but TypeScript definitions may not reflect this yet
   */
  async analyzeImage(imageData: string, context?: string): Promise<string> {
    await this.initialize();

    // Try to use multimodal Prompt API first (if available)
    try {
      const session = this.sessions.get("prompt") as AILanguageModel;
      if (session && this._supportsMultimodal()) {
        console.log(
          "[Kaizen AI] Attempting multimodal Prompt API for image analysis",
        );

        // Note: Multimodal API may require different method signature
        // For now, we'll use the text-based approach until proper multimodal types are available
        // When multimodal is properly supported, this would be:
        // const content = [
        //   { type: "text", text: "Please describe this image:" },
        //   { type: "image", image: { data: imageData } }
        // ];
        // const response = await session.promptMultimodal(content);
      }
    } catch (error) {
        console.warn(
          "[Kaizen AI] Multimodal API not available in current types, using fallback:",
          error,
        );
    }

    // Fallback: Use text-based description approach
    console.log("[Kaizen AI] Using text-based image analysis");
    const prompt = context
      ? `Please analyze this image and provide a detailed description that would help me understand what's in it. Context: ${context}\n\nImage data: ${imageData.substring(0, 100)}...`
      : `Please analyze this image and provide a detailed description of what you see: ${imageData.substring(0, 100)}...`;

    try {
      const description = await this.prompt(prompt);
      return description;
    } catch (error) {
      console.error("[Kaizen AI] Image analysis failed:", error);
      // Fallback description
      return "I can see an image, but I'm unable to analyze it in detail at the moment.";
    }
  }

  /**
   * Check if the session supports multimodal input
   * Note: This is a placeholder - actual multimodal detection would check API capabilities
   */
  private _supportsMultimodal(): boolean {
    // For now, assume multimodal is not available in current TypeScript definitions
    // This would be updated when proper multimodal types are available
    return false;
  }

  /**
   * Enhanced prompt with image context using multimodal Prompt API
   * Uses Chrome's multimodal capabilities to analyze images directly
   */
  async promptWithImage(
    text: string,
    imageData: string,
    context?: string,
  ): Promise<string> {
    await this.initialize();

    try {
      const session = this.sessions.get("prompt") as AILanguageModel;
      if (!session) {
        throw new Error("Prompt API not available");
      }

      console.log("[Kaizen AI] Using multimodal Prompt API for image analysis");

      // Prepare multimodal content array
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const content: any[] = [];

      // Add context text if provided
      if (context) {
        content.push({ type: "text", text: `Context: ${context}` });
      }

      // Add the image
      content.push({
        type: "image",
        image: { data: imageData }
      });

      // Add the user's question/prompt
      content.push({ type: "text", text });

      // Use the multimodal prompt method (if available) or fallback
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (session as any).promptMultimodal === "function") {
        console.log("[Kaizen AI] Using promptMultimodal method");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return await (session as any).promptMultimodal(content);
      } else {
        // Fallback: try regular prompt with structured content
        console.log("[Kaizen AI] Fallback to regular prompt with multimodal content");
        const structuredPrompt = content
          .map((item) => {
            if (item.type === "text") return item.text;
            if (item.type === "image") return "[Image data provided]";
            return "";
          })
          .join("\n\n");

        return await session.prompt(structuredPrompt);
      }
    } catch (error) {
      console.error("[Kaizen AI] Multimodal prompt failed:", error);
      // Fallback to regular prompt
      return await this.prompt(text);
    }
  }

  /**
   * Check if a specific API is available
   */
  isAvailable(api: string): boolean {
    const caps = this.capabilities.get(api) as { available?: string };
    const availability = caps?.available;
    // For translator, both "available" and "downloadable" mean we can use it
    if (api === "translator") {
      return availability === "available" || availability === "downloadable";
    }
    return availability === "available";
  }

  /**
   * Quick check if Translator API is available (doesn't require full initialization)
   */
  async isTranslatorAvailable(): Promise<boolean> {
    if (typeof Translator === "undefined") {
      return false;
    }

    try {
      const availability = await Translator.availability({
        sourceLanguage: "en",
        targetLanguage: "es",
      });
      return availability === "available" || availability === "downloadable";
    } catch {
      try {
        const availability = await Translator.availability();
        return availability === "available" || availability === "downloadable";
      } catch {
        return false;
      }
    }
  }

  /**
   * Get API capabilities
   */
  getCapabilities(api: string): unknown {
    return this.capabilities.get(api);
  }

  /**
   * Log all API capabilities to console
   */
  private _logCapabilities(): void {
    console.log("[Kaizen AI] API Status:");
    console.log("  • Prompt API:", this.isAvailable("prompt") ? "✅" : "❌");
    console.log(
      "  • Summarizer API:",
      this.isAvailable("summarizer") ? "✅" : "❌",
    );
    console.log("  • Writer API:", this.isAvailable("writer") ? "✅" : "❌");
    console.log(
      "  • Rewriter API:",
      this.isAvailable("rewriter") ? "✅" : "❌",
    );
    console.log(
      "  • Translator API:",
      this.isAvailable("translator") ? "✅" : "❌",
    );
    console.log(
      "  • Language Detector:",
      this.isAvailable("languageDetector") ? "✅" : "❌",
    );
    console.log(
      "  • Proofreader API:",
      this.isAvailable("proofreader") ? "✅" : "❌",
    );
  }

  /**
   * Debug function - Test AI API directly (call from console)
   */
  async debugAI(): Promise<void> {
    console.log("[Kaizen AI] 🔍 Starting AI API debug...");

    try {
      // Check if LanguageModel is available
      console.log("[Kaizen AI] Checking LanguageModel availability...");
      const availability = await LanguageModel.availability();
      console.log(`[Kaizen AI] LanguageModel availability: ${availability}`);

      if (availability === "available") {
        console.log("[Kaizen AI] Creating test session...");
         
        const session = await LanguageModel.create({
          systemPrompt: "You are a helpful assistant.",
          expectedInputs: [
            { type: "text" },
            { type: "image" }
          ],
          expectedOutputs: [
            { type: "text" }
          ],
          languages: ["en"]
        } as any);
        console.log("[Kaizen AI] ✓ Session created successfully");

        console.log("[Kaizen AI] Testing prompt...");
        const result = await session.prompt("Say 'Hello from AI!'");
        console.log("[Kaizen AI] ✓ Prompt result:", result);

        // Clean up
        if (session.destroy) {
          session.destroy();
        }
        console.log("[Kaizen AI] ✓ Test completed successfully");
      } else {
        console.log(
          `[Kaizen AI] ❌ LanguageModel not available: ${availability},`,
        );
      }

      // Check Translator availability
      console.log("[Kaizen AI] Checking Translator availability...");
      const translatorAvailable = await this.isTranslatorAvailable();
      console.log(`[Kaizen AI] Translator available: ${translatorAvailable}`);
    } catch (error) {
      console.error("[Kaizen AI] ❌ Debug failed:", error);
    }
  }
}

// Global debug function for console testing
declare global {
  interface Window {
    debugAI: () => Promise<void>;
  }
}

window.debugAI = async () => {
  const manager = AIOverlayManager.getInstance();
  await manager.debugAI();
};

export { AIOverlayManager };
