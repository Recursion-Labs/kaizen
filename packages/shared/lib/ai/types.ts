/**
 * Chrome Built-in AI APIs - Type Definitions
 * Complete type safety for all 7 Chrome AI APIs
 */

// ============================================================================
// API Availability
// ============================================================================

export type APIAvailability = "readily" | "after-download" | "no";

export interface APICapabilities {
  available: APIAvailability;
  defaultTemperature?: number;
  defaultTopK?: number;
  maxTopK?: number;
}

// ============================================================================
// Prompt API (General Reasoning)
// ============================================================================

export interface AILanguageModelSession {
  prompt(input: string, options?: PromptOptions): Promise<string>;
  promptStreaming(input: string, options?: PromptOptions): ReadableStream;
  destroy(): void;
  clone(): Promise<AILanguageModelSession>;
  countPromptTokens(input: string): Promise<number>;
  tokensSoFar: number;
  maxTokens: number;
  tokensLeft: number;
}

export interface PromptOptions {
  context?: string;
  image?: string; // Base64 encoded
  systemPrompt?: string;
}

export interface AIModelCreateOptions {
  temperature?: number; // 0-1
  topK?: number;
  systemPrompt?: string;
  initialPrompts?: Array<{ role: "user" | "assistant"; content: string }>;
}

// ============================================================================
// Summarizer API
// ============================================================================

export interface AISummarizer {
  summarize(input: string, options?: SummarizeOptions): Promise<string>;
  summarizeStreaming(input: string, options?: SummarizeOptions): ReadableStream;
  destroy(): void;
}

export interface AISummarizerCreateOptions {
  type?: "key-points" | "tl;dr" | "teaser" | "headline";
  format?: "plain-text" | "markdown";
  length?: "short" | "medium" | "long";
}

export interface SummarizeOptions {
  context?: string;
}

export interface AISummarizerCapabilities extends APICapabilities {
  supportsType: (type: string) => boolean;
  supportsFormat: (format: string) => boolean;
  supportsLength: (length: string) => boolean;
}

// ============================================================================
// Writer API (Content Generation)
// ============================================================================

export interface AIWriter {
  write(input: string, options?: WriteOptions): Promise<string>;
  writeStreaming(input: string, options?: WriteOptions): ReadableStream;
  destroy(): void;
}

export interface AIWriterCreateOptions {
  tone?: "formal" | "neutral" | "casual" | "professional" | "friendly";
  format?: "plain-text" | "markdown";
  length?: "short" | "medium" | "long";
}

export interface WriteOptions {
  context?: string;
}

export interface AIWriterCapabilities extends APICapabilities {
  supportsTone: (tone: string) => boolean;
  supportsFormat: (format: string) => boolean;
  supportsLength: (length: string) => boolean;
}

// ============================================================================
// Rewriter API (Content Improvement)
// ============================================================================

export interface AIRewriter {
  rewrite(input: string, options?: RewriteOptions): Promise<string>;
  rewriteStreaming(input: string, options?: RewriteOptions): ReadableStream;
  destroy(): void;
}

export interface AIRewriterCreateOptions {
  tone?:
    | "as-is"
    | "more-formal"
    | "more-casual"
    | "more-professional"
    | "more-friendly";
  format?: "as-is" | "plain-text" | "markdown";
  length?: "as-is" | "shorter" | "longer";
}

export interface RewriteOptions {
  context?: string;
}

export interface AIRewriterCapabilities extends APICapabilities {
  supportsTone: (tone: string) => boolean;
  supportsFormat: (format: string) => boolean;
  supportsLength: (length: string) => boolean;
}

// ============================================================================
// Translator API
// ============================================================================

export interface AITranslator {
  translate(input: string): Promise<string>;
  translateStreaming(input: string): ReadableStream;
  destroy(): void;
}

export interface AITranslatorCreateOptions {
  sourceLanguage: string; // BCP 47 language tag
  targetLanguage: string; // BCP 47 language tag
}

export interface AITranslatorCapabilities extends APICapabilities {
  languagePairAvailable: (
    source: string,
    target: string
  ) => Promise<APIAvailability>;
}

// ============================================================================
// Proofreader API (Grammar Correction)
// ============================================================================

export interface AIProofreader {
  proofread(input: string): Promise<AIProofreaderCorrection[]>;
  destroy(): void;
}

export interface AIProofreaderCorrection {
  type: "grammar" | "spelling" | "punctuation" | "style";
  original: string;
  correction: string;
  start: number;
  end: number;
  confidence?: number;
}

export interface AIProofreaderCapabilities extends APICapabilities {
  // No additional capabilities
}

// ============================================================================
// Language Detector API
// ============================================================================

export interface AILanguageDetector {
  detect(input: string): Promise<AILanguageDetectorResult[]>;
}

export interface AILanguageDetectorResult {
  detectedLanguage: string; // BCP 47 language tag
  confidence: number; // 0-1
}

export interface AILanguageDetectorCapabilities extends APICapabilities {
  // No additional capabilities
}

// ============================================================================
// Window Interface Extension
// ============================================================================

declare global {
  interface Window {
    ai?: {
      languageModel: {
        capabilities(): Promise<APICapabilities>;
        create(options?: AIModelCreateOptions): Promise<AILanguageModelSession>;
      };
      summarizer: {
        capabilities(): Promise<AISummarizerCapabilities>;
        create(options?: AISummarizerCreateOptions): Promise<AISummarizer>;
      };
      writer: {
        capabilities(): Promise<AIWriterCapabilities>;
        create(options?: AIWriterCreateOptions): Promise<AIWriter>;
      };
      rewriter: {
        capabilities(): Promise<AIRewriterCapabilities>;
        create(options?: AIRewriterCreateOptions): Promise<AIRewriter>;
      };
      translator: {
        capabilities(): Promise<AITranslatorCapabilities>;
        create(options?: AITranslatorCreateOptions): Promise<AITranslator>;
      };
      proofreader: {
        capabilities(): Promise<AIProofreaderCapabilities>;
        create(): Promise<AIProofreader>;
      };
      languageDetector: {
        capabilities(): Promise<AILanguageDetectorCapabilities>;
        create(): Promise<AILanguageDetector>;
      };
    };
  }
}

// ============================================================================
// Service Response Types
// ============================================================================

export interface AIServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  image?: string;
}

export interface BrowsingContext {
  currentUrl?: string;
  currentTitle?: string;
  recentTabs?: Array<{ url: string; title: string }>;
  knowledgeGraph?: unknown;
}
