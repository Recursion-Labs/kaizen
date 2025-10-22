/**
 * AI Capabilities Checker
 * Detects and validates Chrome Built-in AI API availability
 *
 * Note: Uses new LanguageModel API (Chrome 138+)
 * window.ai is deprecated. See: https://developer.chrome.com/docs/ai/prompt-api
 */

import type { APIAvailability } from "./types.js";

// Import to ensure global declarations are available
import "./types.js";

interface AIAPIStatus {
  available: boolean;
  capability: APIAvailability;
  error?: string;
}

interface AllAICapabilities {
  promptAPI: AIAPIStatus;
  summarizer: AIAPIStatus;
  writer: AIAPIStatus;
  rewriter: AIAPIStatus;
  translator: AIAPIStatus;
  proofreader: AIAPIStatus;
  languageDetector: AIAPIStatus;
}

const detectChromeAI = async (): Promise<{
  isAvailable: boolean;
  apis: AllAICapabilities;
  overallMessage: string;
  setupGuide?: string;
}> => {
  // Check for new LanguageModel API (Chrome 138+)
  const hasNewAPI = typeof LanguageModel !== "undefined";

  if (!hasNewAPI) {
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
};

const checkPromptAPI = async (): Promise<AIAPIStatus> => {
  try {
    // Use new LanguageModel API (Chrome 138+)
    if (typeof LanguageModel !== "undefined") {
      const availability = await LanguageModel.availability();
      return {
        available: availability === "available",
        capability: availability,
      };
    }

    return {
      available: false,
      capability: "unavailable",
      error: "LanguageModel API not found",
    };
  } catch (error) {
    return {
      available: false,
      capability: "unavailable",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const checkSummarizer = async (): Promise<AIAPIStatus> => {
  try {
    if (typeof Summarizer === "undefined") {
      return {
        available: false,
        capability: "unavailable",
        error: "Summarizer API not found",
      };
    }

    const availability = await Summarizer.availability();
    return {
      available: availability === "available",
      capability: availability,
    };
  } catch (error) {
    return {
      available: false,
      capability: "unavailable",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const checkWriter = async (): Promise<AIAPIStatus> => {
  try {
    if (typeof Writer === "undefined") {
      return {
        available: false,
        capability: "unavailable",
        error: "Writer API not found",
      };
    }

    const availability = await Writer.availability();
    return {
      available: availability === "available",
      capability: availability,
    };
  } catch (error) {
    return {
      available: false,
      capability: "unavailable",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const checkRewriter = async (): Promise<AIAPIStatus> => {
  try {
    if (typeof Rewriter === "undefined") {
      return {
        available: false,
        capability: "unavailable",
        error: "Rewriter API not found",
      };
    }

    const availability = await Rewriter.availability();
    return {
      available: availability === "available",
      capability: availability,
    };
  } catch (error) {
    return {
      available: false,
      capability: "unavailable",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const checkTranslator = async (): Promise<AIAPIStatus> => {
  try {
    if (typeof Translator === "undefined") {
      return {
        available: false,
        capability: "unavailable",
        error: "Translator API not found",
      };
    }

    const availability = await Translator.availability();
    return {
      available: availability === "available",
      capability: availability,
    };
  } catch (error) {
    return {
      available: false,
      capability: "unavailable",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const checkProofreader = async (): Promise<AIAPIStatus> => {
  try {
    if (typeof Proofreader === "undefined") {
      return {
        available: false,
        capability: "unavailable",
        error: "Proofreader API not found",
      };
    }

    const availability = await Proofreader.availability();
    return {
      available: availability === "available",
      capability: availability,
    };
  } catch (error) {
    return {
      available: false,
      capability: "unavailable",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const checkLanguageDetector = async (): Promise<AIAPIStatus> => {
  try {
    if (typeof LanguageDetector === "undefined") {
      return {
        available: false,
        capability: "unavailable",
        error: "LanguageDetector API not found",
      };
    }

    const availability = await LanguageDetector.availability();
    return {
      available: availability === "available",
      capability: availability,
    };
  } catch (error) {
    return {
      available: false,
      capability: "unavailable",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const getUnavailableAPIs = (): AllAICapabilities => {
  const unavailable: AIAPIStatus = {
    available: false,
    capability: "unavailable",
  };
  return {
    promptAPI: unavailable,
    summarizer: unavailable,
    writer: unavailable,
    rewriter: unavailable,
    translator: unavailable,
    proofreader: unavailable,
    languageDetector: unavailable,
  };
};

const getSetupGuide = (): string =>
  `
# Chrome AI Setup Guide

To use Chrome Built-in AI APIs, follow these steps:

1. **Install Chrome Canary** (v138+)
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
   await LanguageModel.availability()
   \`\`\`
   Should return: "available"

For more details: https://developer.chrome.com/docs/ai/built-in
  `.trim();

export type { AIAPIStatus, AllAICapabilities };
export { detectChromeAI, getSetupGuide };
