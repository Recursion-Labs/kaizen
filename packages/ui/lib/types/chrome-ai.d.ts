// Chrome AI API Type Definitions
// Based on: https://developer.chrome.com/docs/ai/built-in-apis

declare global {
  interface Window {
    ai?: {
      languageModel: {
        capabilities(): Promise<AIModelCapabilities>;
        create(options?: AIModelCreateOptions): Promise<AILanguageModelSession>;
      };
      summarizer: {
        capabilities(): Promise<AISummarizerCapabilities>;
        create(options?: AISummarizerCreateOptions): Promise<AISummarizer>;
      };
      rewriter: {
        capabilities(): Promise<AIRewriterCapabilities>;
        create(options?: AIRewriterCreateOptions): Promise<AIRewriter>;
      };
      translator: {
        capabilities(): Promise<AITranslatorCapabilities>;
        create(options?: AITranslatorCreateOptions): Promise<AITranslator>;
      };
      writer: {
        capabilities(): Promise<AIWriterCapabilities>;
        create(options?: AIWriterCreateOptions): Promise<AIWriter>;
      };
      proofreader: {
        capabilities(): Promise<AIProofreaderCapabilities>;
        create(): Promise<AIProofreader>;
      };
      languageDetector: {
        detect(text: string): Promise<AILanguageDetectorResult>;
      };
    };
  }
}

// Prompt API
interface AIModelCapabilities {
  available: "readily" | "after-download" | "no";
  defaultTemperature?: number;
  defaultTopK?: number;
  maxTopK?: number;
}

interface AIModelCreateOptions {
  temperature?: number;
  topK?: number;
  systemPrompt?: string;
}

interface AILanguageModelSession {
  prompt(input: string): Promise<string>;
  promptStreaming(input: string): AsyncIterable<string>;
  destroy(): void;
}

// Summarizer API
interface AISummarizerCapabilities {
  available: "readily" | "after-download" | "no";
}

interface AISummarizerCreateOptions {
  type?: "key-points" | "tl;dr" | "teaser" | "headline";
  format?: "plain-text" | "markdown";
  length?: "short" | "medium" | "long";
}

interface AISummarizer {
  summarize(text: string): Promise<string>;
  destroy(): void;
}

// Rewriter API
interface AIRewriterCapabilities {
  available: "readily" | "after-download" | "no";
}

interface AIRewriterCreateOptions {
  tone?: "as-is" | "more-formal" | "more-casual" | "professional" | "friendly";
  format?: "as-is" | "plain-text" | "markdown";
  length?: "as-is" | "shorter" | "longer";
}

interface AIRewriter {
  rewrite(text: string, context?: { context?: string }): Promise<string>;
  destroy(): void;
}

// Translator API
interface AITranslatorCapabilities {
  available: "readily" | "after-download" | "no";
}

interface AITranslatorCreateOptions {
  sourceLanguage: string;
  targetLanguage: string;
}

interface AITranslator {
  translate(text: string): Promise<string>;
  destroy(): void;
}

// Writer API
interface AIWriterCapabilities {
  available: "readily" | "after-download" | "no";
}

interface AIWriterCreateOptions {
  tone?: "formal" | "neutral" | "casual" | "professional";
  length?: "short" | "medium" | "long";
}

interface AIWriter {
  write(prompt: string): Promise<string>;
  destroy(): void;
}

// Proofreader API
interface AIProofreaderCapabilities {
  available: "readily" | "after-download" | "no";
}

interface AIProofreaderCorrection {
  suggestion: string;
  original: string;
  position: number;
  length: number;
}

interface AIProofreader {
  proofread(text: string): Promise<AIProofreaderCorrection[]>;
  destroy(): void;
}

// Language Detector
interface AILanguageDetectorResult {
  language: string;
  confidence: number;
}

export {};
