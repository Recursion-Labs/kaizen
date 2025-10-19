/**
 * AI Capabilities Checker
 * Detects and validates Chrome Built-in AI API availability
 */

import type { APIAvailability, APICapabilities } from "./types.js";

export interface AIAPIStatus {
  available: boolean;
  capability: APIAvailability;
  error?: string;
}

export interface AllAICapabilities {
  promptAPI: AIAPIStatus;
  summarizer: AIAPIStatus;
  writer: AIAPIStatus;
  rewriter: AIAPIStatus;
  translator: AIAPIStatus;
  proofreader: AIAPIStatus;
  languageDetector: AIAPIStatus;
}

/**
 * Check if Chrome AI APIs are available
 */
export async function detectChromeAI(): Promise<{
  isAvailable: boolean;
  apis: AllAICapabilities;
  overallMessage: string;
  setupGuide?: string;
}> {
  if (typeof window === "undefined" || !window.ai) {
    return {
      isAvailable: false,
      apis: getUnavailableAPIs(),
      overallMessage: "Chrome Built-in AI APIs not available",
      setupGuide: getSetupGuide(),
    };
  }

  const apis: AllAICapabilities = {
    promptAPI: await checkPromptAPI(),
    summarizer: await checkSummarizer(),
    writer: await checkWriter(),
    rewriter: await checkRewriter(),
    translator: await checkTranslator(),
    proofreader: await checkProofreader(),
    languageDetector: await checkLanguageDetector(),
  };

  const availableCount = Object.values(apis).filter(
    (api) => api.available,
  ).length;
  const isAvailable = availableCount > 0;

  return {
    isAvailable,
    apis,
    overallMessage: `${availableCount}/7 Chrome AI APIs available`,
    setupGuide: availableCount === 0 ? getSetupGuide() : undefined,
  };
}

async function checkPromptAPI(): Promise<AIAPIStatus> {
  try {
    if (!window.ai?.languageModel) {
      return { available: false, capability: "no", error: "API not found" };
    }

    const capabilities = await window.ai.languageModel.capabilities();
    return {
      available: capabilities.available === "readily",
      capability: capabilities.available,
    };
  } catch (error) {
    return {
      available: false,
      capability: "no",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkSummarizer(): Promise<AIAPIStatus> {
  try {
    if (!window.ai?.summarizer) {
      return { available: false, capability: "no", error: "API not found" };
    }

    const capabilities = await window.ai.summarizer.capabilities();
    return {
      available: capabilities.available === "readily",
      capability: capabilities.available,
    };
  } catch (error) {
    return {
      available: false,
      capability: "no",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkWriter(): Promise<AIAPIStatus> {
  try {
    if (!window.ai?.writer) {
      return { available: false, capability: "no", error: "API not found" };
    }

    const capabilities = await window.ai.writer.capabilities();
    return {
      available: capabilities.available === "readily",
      capability: capabilities.available,
    };
  } catch (error) {
    return {
      available: false,
      capability: "no",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkRewriter(): Promise<AIAPIStatus> {
  try {
    if (!window.ai?.rewriter) {
      return { available: false, capability: "no", error: "API not found" };
    }

    const capabilities = await window.ai.rewriter.capabilities();
    return {
      available: capabilities.available === "readily",
      capability: capabilities.available,
    };
  } catch (error) {
    return {
      available: false,
      capability: "no",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkTranslator(): Promise<AIAPIStatus> {
  try {
    if (!window.ai?.translator) {
      return { available: false, capability: "no", error: "API not found" };
    }

    const capabilities = await window.ai.translator.capabilities();
    return {
      available: capabilities.available === "readily",
      capability: capabilities.available,
    };
  } catch (error) {
    return {
      available: false,
      capability: "no",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkProofreader(): Promise<AIAPIStatus> {
  try {
    if (!window.ai?.proofreader) {
      return { available: false, capability: "no", error: "API not found" };
    }

    const capabilities = await window.ai.proofreader.capabilities();
    return {
      available: capabilities.available === "readily",
      capability: capabilities.available,
    };
  } catch (error) {
    return {
      available: false,
      capability: "no",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkLanguageDetector(): Promise<AIAPIStatus> {
  try {
    if (!window.ai?.languageDetector) {
      return { available: false, capability: "no", error: "API not found" };
    }

    const capabilities = await window.ai.languageDetector.capabilities();
    return {
      available: capabilities.available === "readily",
      capability: capabilities.available,
    };
  } catch (error) {
    return {
      available: false,
      capability: "no",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function getUnavailableAPIs(): AllAICapabilities {
  const unavailable: AIAPIStatus = { available: false, capability: "no" };
  return {
    promptAPI: unavailable,
    summarizer: unavailable,
    writer: unavailable,
    rewriter: unavailable,
    translator: unavailable,
    proofreader: unavailable,
    languageDetector: unavailable,
  };
}

export function getSetupGuide(): string {
  return `
# Chrome AI Setup Guide

To use Chrome Built-in AI APIs, follow these steps:

1. **Install Chrome Canary** (v121+)
   Download: https://www.google.com/chrome/canary/

2. **Enable AI Features**
   Navigate to chrome://flags and enable:
   - #optimization-guide-on-device-model
   - #prompt-api-for-gemini-nano
   - #summarization-api-for-gemini-nano
   - #translation-api

3. **Download Gemini Nano Model** (~1.5GB)
   - Restart Chrome after enabling flags
   - Model downloads automatically on first use
   - Check download status in chrome://components

4. **Verify Installation**
   Open DevTools Console and run:
   \`\`\`javascript
   await window.ai.languageModel.capabilities()
   \`\`\`
   Should return: { available: "readily" }

For more details: https://developer.chrome.com/docs/ai/built-in
  `.trim();
}
