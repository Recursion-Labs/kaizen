/**
 * Chrome Built-in AI APIs - Type Definitions
 * Chrome 138+ Only - New LanguageModel API
 * Based on: https://developer.chrome.com/docs/ai/built-in-apis
 */

// ============================================================================
// API Availability (Chrome 138+)
// ============================================================================

type APIAvailability =
  | "available"
  | "downloadable"
  | "downloading"
  | "unavailable";

interface AICreateMonitor {
  addEventListener(
    type: "downloadprogress",
    listener: (e: DownloadProgressEvent) => void,
  ): void;
}

interface DownloadProgressEvent extends Event {
  loaded: number;
  total: number;
}

// ============================================================================
// Prompt API (General Reasoning) - Chrome 138+
// ============================================================================

interface AILanguageModel {
  prompt(input: string, options?: { signal?: AbortSignal }): Promise<string>;
  promptStreaming(
    input: string,
    options?: { signal?: AbortSignal },
  ): ReadableStream;
  countPromptTokens(input: string): Promise<number>;
  readonly maxTokens: number;
  readonly tokensSoFar: number;
  readonly tokensLeft: number;
  clone(): Promise<AILanguageModel>;
  destroy(): void;
}

interface AILanguageModelCreateOptions {
  systemPrompt?: string;
  temperature?: number;
  topK?: number;
  signal?: AbortSignal;
  monitor?: (monitor: AICreateMonitor) => void;
}

// ============================================================================
// Summarizer API - Chrome 138+
// ============================================================================

interface AISummarizer {
  summarize(
    input: string,
    options?: { context?: string; signal?: AbortSignal },
  ): Promise<string>;
  summarizeStreaming(
    input: string,
    options?: { context?: string; signal?: AbortSignal },
  ): ReadableStream;
  destroy(): void;
}

interface AISummarizerCreateOptions {
  sharedContext?: string;
  type?: "tl;dr" | "key-points" | "teaser" | "headline";
  format?: "plain-text" | "markdown";
  length?: "short" | "medium" | "long";
  signal?: AbortSignal;
  monitor?: (monitor: AICreateMonitor) => void;
}

// ============================================================================
// Writer API (Content Generation) - Chrome 138+
// ============================================================================

interface AIWriter {
  write(
    writingTask: string,
    options?: { context?: string; signal?: AbortSignal },
  ): Promise<string>;
  writeStreaming(
    writingTask: string,
    options?: { context?: string; signal?: AbortSignal },
  ): ReadableStream;
  destroy(): void;
}

interface AIWriterCreateOptions {
  sharedContext?: string;
  tone?: "formal" | "neutral" | "casual";
  format?: "plain-text" | "markdown";
  length?: "short" | "medium" | "long";
  signal?: AbortSignal;
  monitor?: (monitor: AICreateMonitor) => void;
}

// ============================================================================
// Rewriter API (Content Improvement) - Chrome 138+
// ============================================================================

interface AIRewriter {
  rewrite(
    input: string,
    options?: { context?: string; signal?: AbortSignal },
  ): Promise<string>;
  rewriteStreaming(
    input: string,
    options?: { context?: string; signal?: AbortSignal },
  ): ReadableStream;
  destroy(): void;
}

interface AIRewriterCreateOptions {
  sharedContext?: string;
  tone?: "as-is" | "more-formal" | "more-casual";
  format?: "as-is" | "plain-text" | "markdown";
  length?: "as-is" | "shorter" | "longer";
  signal?: AbortSignal;
  monitor?: (monitor: AICreateMonitor) => void;
}

// ============================================================================
// Translator API - Chrome 138+
// ============================================================================

interface AITranslator {
  translate(input: string, options?: { signal?: AbortSignal }): Promise<string>;
  translateStreaming(
    input: string,
    options?: { signal?: AbortSignal },
  ): ReadableStream;
  destroy(): void;
}

interface AITranslatorCreateOptions {
  sourceLanguage: string; // BCP 47 language tag
  targetLanguage: string; // BCP 47 language tag
  signal?: AbortSignal;
  monitor?: (monitor: AICreateMonitor) => void;
}

// ============================================================================
// Language Detector API - Chrome 138+
// ============================================================================

interface AILanguageDetector {
  detect(input: string): Promise<AILanguageDetectorResult[]>;
  destroy(): void;
}

interface AILanguageDetectorResult {
  detectedLanguage: string; // BCP 47 language tag
  confidence: number; // 0-1
}

// ============================================================================
// Proofreader API - Chrome 141+ (Origin Trial)
// ============================================================================

interface AIProofreader {
  proofread(input: string): Promise<AIProofreaderResult>;
  destroy(): void;
}

interface AIProofreaderResult {
  corrected: string;
  corrections: AIProofreaderCorrection[];
}

interface AIProofreaderCorrection {
  suggestion: string;
  original: string;
  position: number;
  length: number;
  explanation?: string;
}

interface AIProofreaderCreateOptions {
  expectedInputLanguages?: string[];
  signal?: AbortSignal;
  monitor?: (monitor: AICreateMonitor) => void;
}

// ============================================================================
// Global API Constructors (Chrome 138+)
// ============================================================================

declare global {
  interface Window {
    ai: {
      languageModel: {
        availability(): Promise<APIAvailability>;
        create(
          options?: AILanguageModelCreateOptions,
        ): Promise<AILanguageModel>;
      };
      summarizer?: {
        availability(): Promise<APIAvailability>;
        create(options?: AISummarizerCreateOptions): Promise<AISummarizer>;
      };
      writer?: {
        availability(): Promise<APIAvailability>;
        create(options?: AIWriterCreateOptions): Promise<AIWriter>;
      };
      rewriter?: {
        availability(): Promise<APIAvailability>;
        create(options?: AIRewriterCreateOptions): Promise<AIRewriter>;
      };
      translator?: {
        availability(): Promise<APIAvailability>;
        create(options?: AITranslatorCreateOptions): Promise<AITranslator>;
      };
      languageDetector?: {
        availability(): Promise<APIAvailability>;
        create(): Promise<AILanguageDetector>;
      };
      proofreader?: {
        availability(): Promise<APIAvailability>;
        create(options?: AIProofreaderCreateOptions): Promise<AIProofreader>;
      };
    };
  }

  // Global constructors for Chrome 138+ AI APIs
  const LanguageModel: {
    availability(): Promise<APIAvailability>;
    create(options?: AILanguageModelCreateOptions): Promise<AILanguageModel>;
  };

  const Summarizer: {
    availability(): Promise<APIAvailability>;
    create(options?: AISummarizerCreateOptions): Promise<AISummarizer>;
  };

  const Writer: {
    availability(): Promise<APIAvailability>;
    create(options?: AIWriterCreateOptions): Promise<AIWriter>;
  };

  const Rewriter: {
    availability(): Promise<APIAvailability>;
    create(options?: AIRewriterCreateOptions): Promise<AIRewriter>;
  };

  const Translator: {
    availability(options?: {
      sourceLanguage?: string;
      targetLanguage?: string;
    }): Promise<APIAvailability>;
    create(options?: AITranslatorCreateOptions): Promise<AITranslator>;
  };

  const LanguageDetector: {
    availability(): Promise<APIAvailability>;
    create(): Promise<AILanguageDetector>;
  };

  const Proofreader: {
    availability(): Promise<APIAvailability>;
    create(options?: AIProofreaderCreateOptions): Promise<AIProofreader>;
  };
}

// ============================================================================
// Service Response Types
// ============================================================================

interface AIServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  image?: string;
}

interface BrowsingContext {
  currentUrl?: string;
  currentTitle?: string;
  recentTabs?: Array<{ url: string; title: string }>;
  knowledgeGraph?: unknown;
}

// ============================================================================
// Exports - Must be at the end per ESLint rules
// ============================================================================

export type {
  APIAvailability,
  AICreateMonitor,
  DownloadProgressEvent,
  AILanguageModel,
  AILanguageModelCreateOptions,
  AISummarizer,
  AISummarizerCreateOptions,
  AIWriter,
  AIWriterCreateOptions,
  AIRewriter,
  AIRewriterCreateOptions,
  AITranslator,
  AITranslatorCreateOptions,
  AILanguageDetector,
  AILanguageDetectorResult,
  AIProofreader,
  AIProofreaderResult,
  AIProofreaderCorrection,
  AIProofreaderCreateOptions,
  AIServiceResponse,
  ChatMessage,
  BrowsingContext,
};
