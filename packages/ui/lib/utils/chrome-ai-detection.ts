/**
 * Chrome AI API Detection Utilities
 * Helps detect which Chrome AI APIs are available in the current browser
 */

export interface AIAPIStatus {
  available: boolean;
  apiName: string;
  message: string;
}

export const detectChromeAI = (): {
  isCanary: boolean;
  chromeVersion: string | null;
  apis: Record<string, AIAPIStatus>;
  overallMessage: string;
} => {
  const userAgent = navigator.userAgent;
  const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
  const chromeVersion = chromeMatch ? chromeMatch[1] : null;
  const isCanary = userAgent.includes("Chrome/") && !userAgent.includes("Edg/");

  const apis: Record<string, AIAPIStatus> = {
    summarizer: {
      available: !!(window.ai && "summarizer" in window.ai),
      apiName: "Summarizer API",
      message: !!(window.ai && "summarizer" in window.ai)
        ? "✅ Available"
        : "❌ Not available - Enable chrome://flags/#summarization-api-for-gemini-nano",
    },
    proofreader: {
      available: !!(window.ai && "proofreader" in window.ai),
      apiName: "Proofreader API",
      message: !!(window.ai && "proofreader" in window.ai)
        ? "✅ Available"
        : "❌ Not available - Requires Chrome Canary with flags",
    },
    translator: {
      available: !!(window.ai && "translator" in window.ai),
      apiName: "Translator API",
      message: !!(window.ai && "translator" in window.ai)
        ? "✅ Available"
        : "❌ Not available - Enable chrome://flags/#translation-api",
    },
    writer: {
      available: !!(window.ai && "writer" in window.ai),
      apiName: "Writer API",
      message: !!(window.ai && "writer" in window.ai)
        ? "✅ Available"
        : "❌ Not available - Requires Chrome Canary with flags",
    },
    rewriter: {
      available: !!(window.ai && "rewriter" in window.ai),
      apiName: "Rewriter API",
      message: !!(window.ai && "rewriter" in window.ai)
        ? "✅ Available"
        : "❌ Not available - Requires Chrome Canary with flags",
    },
    languageDetector: {
      available: !!(window.ai && "languageDetector" in window.ai),
      apiName: "Language Detector API",
      message: !!(window.ai && "languageDetector" in window.ai)
        ? "✅ Available"
        : "❌ Not available - Requires Chrome Canary with flags",
    },
    prompt: {
      available: !!(window.ai && "languageModel" in window.ai),
      apiName: "Prompt API (Gemini Nano)",
      message: !!(window.ai && "languageModel" in window.ai)
        ? "✅ Available"
        : "❌ Not available - Enable chrome://flags/#prompt-api-for-gemini-nano",
    },
  };

  const availableCount = Object.values(apis).filter(
    (api) => api.available,
  ).length;
  const totalCount = Object.keys(apis).length;

  let overallMessage = "";
  if (!window.ai) {
    overallMessage = `
⚠️ Chrome AI APIs Not Detected

You're using Chrome ${chromeVersion || "Unknown"}, but window.ai is not available.

**To enable Chrome AI APIs:**

1. **Use Chrome Canary** (recommended for all APIs)
   Download: https://www.google.com/chrome/canary/

2. **Enable Required Flags** in chrome://flags:
   - prompt-api-for-gemini-nano
   - summarization-api-for-gemini-nano  
   - translation-api
   - rewriter-api-for-gemini-nano
   - writer-api-for-gemini-nano
   - language-detection-api

3. **Restart Chrome** after enabling flags

4. **Download Gemini Nano** model (~1.5GB)
   - Happens automatically on first API use
   - Check status in DevTools Console

**Alternative:** You can test the UI - it will show error messages for unavailable APIs.
    `.trim();
  } else if (availableCount === 0) {
    overallMessage = `
⚠️ Chrome AI APIs Detected but Not Enabled

window.ai exists but no APIs are available (${availableCount}/${totalCount} enabled).

**Next Steps:**
1. Open chrome://flags
2. Enable the required flags (see status above)
3. Restart Chrome
4. Try again!
    `.trim();
  } else if (availableCount < totalCount) {
    overallMessage = `
⚠️ Partially Enabled (${availableCount}/${totalCount} APIs available)

Some Chrome AI APIs are working! Check individual API status above.
Enable missing flags in chrome://flags to unlock all features.
    `.trim();
  } else {
    overallMessage = `
✅ All Chrome AI APIs Available! (${availableCount}/${totalCount})

Your browser is fully configured for Chrome AI features.
Gemini Nano model: ${isCanary ? "Should be available in Canary" : "May require Canary"}
    `.trim();
  }

  return {
    isCanary,
    chromeVersion,
    apis,
    overallMessage,
  };
};

/**
 * Get a user-friendly setup guide based on current browser
 */
export const getSetupGuide = (): string => {
  const detection = detectChromeAI();

  if (!window.ai) {
    return `
🔧 **Quick Setup Guide**

**Current Browser:** Chrome ${detection.chromeVersion || "Unknown"}

**For Full Chrome AI Support:**

1️⃣ **Install Chrome Canary**
   • Download: https://www.google.com/chrome/canary/
   • Canary has the latest AI features

2️⃣ **Enable Flags** (paste in address bar):
   chrome://flags/#prompt-api-for-gemini-nano
   chrome://flags/#summarization-api-for-gemini-nano
   chrome://flags/#translation-api

3️⃣ **Restart Browser**

4️⃣ **Test Again** - The AI overlay should work!

**OR** use stable Chrome and wait for APIs to graduate from experimental status (2025-2026).
    `.trim();
  }

  return detection.overallMessage;
};
