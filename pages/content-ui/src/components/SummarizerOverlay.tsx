import { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";

interface SummarizerOverlayProps {
  onClose: () => void;
}

const SummarizerOverlay: React.FC<SummarizerOverlayProps> = ({ onClose }) => {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [summaryType, setSummaryType] = useState<
    "key-points" | "tl;dr" | "teaser"
  >("key-points");
  const [error, setError] = useState<string | null>(null);

  const generateSummary = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if Summarizer API is available (Chrome 138+)
      if (typeof Summarizer === "undefined") {
        throw new Error("Summarizer API not available");
      }

      const availability = await Summarizer.availability();
      if (availability !== "available") {
        throw new Error(`Summarizer not ready: ${availability}`);
      }

      // Get page content
      const pageContent = extractPageContent();

      // Create summarizer
      const summarizer = await Summarizer.create({
        type: summaryType,
        format: "markdown",
        length: summaryType === "tl;dr" ? "short" : "medium",
      });

      // Generate summary
      const result = await summarizer.summarize(pageContent);
      setSummary(result);
    } catch (err) {
      console.error("Failed to generate summary:", err);
      setError(
        "Failed to generate summary. Make sure Chrome AI APIs are enabled.",
      );
    } finally {
      setLoading(false);
    }
  }, [summaryType]);

  useEffect(() => {
    generateSummary();
  }, [generateSummary]);

  const extractPageContent = (): string => {
    // Extract main content from the page
    const article =
      document.querySelector("article") ||
      document.querySelector("main") ||
      document.body;

    // Get text content, excluding scripts and styles
    const clone = article.cloneNode(true) as HTMLElement;
    clone
      .querySelectorAll("script, style, nav, footer")
      .forEach((el) => el.remove());

    return clone.innerText.slice(0, 10000); // Limit to 10k chars
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      // Show success feedback
      console.log("Summary copied to clipboard");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const saveSummary = async () => {
    try {
      // Save to chrome.storage
      const url = window.location.href;
      const timestamp = Date.now();

      const summaryData = {
        url,
        timestamp,
        type: summaryType,
        content: summary,
        title: document.title,
      };

      const { savedSummaries = [] } = await chrome.storage.local.get([
        "savedSummaries",
      ]);
      savedSummaries.push(summaryData);
      await chrome.storage.local.set({ savedSummaries });

      console.log("Summary saved");
    } catch (err) {
      console.error("Failed to save summary:", err);
    }
  };

  return (
    <div className="kaizen-summarizer-overlay">
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-label="Close overlay"
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-[100000] h-screen w-full max-w-2xl overflow-y-auto bg-white shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Page Summary
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {document.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Summary Type Selector */}
          <div className="mt-4 flex space-x-2">
            {(["key-points", "tl;dr", "teaser"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSummaryType(type)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  summaryType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {type === "key-points"
                  ? "Key Points"
                  : type === "tl;dr"
                    ? "TL;DR"
                    : "Teaser"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="space-y-4 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                <p className="text-gray-600 dark:text-gray-400">
                  Generating summary with AI...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {!loading && !error && summary && (
            <div className="space-y-4">
              {/* Summary Content */}
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                  {summary}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  📋 Copy
                </button>
                <button
                  onClick={saveSummary}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  💾 Save
                </button>
              </div>

              {/* Info */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-start space-x-3">
                  <span className="text-lg">✨</span>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      AI-Powered Summary
                    </p>
                    <p className="mt-1 text-xs text-blue-800 dark:text-blue-200">
                      Generated using Chrome's built-in Summarizer API. All
                      processing happens locally on your device.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Inject summarizer into page
export const showSummarizer = () => {
  // Create container
  const container = document.createElement("div");
  container.id = "kaizen-summarizer-root";
  document.body.appendChild(container);

  // Create shadow DOM for style isolation
  const shadow = container.attachShadow({ mode: "open" });
  const shadowRoot = document.createElement("div");
  shadow.appendChild(shadowRoot);

  // Add Tailwind styles to shadow DOM
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://cdn.jsdelivr.net/npm/tailwindcss@3.3.0/base.min.css');
    /* Add compiled Tailwind CSS here */
  `;
  shadow.appendChild(style);

  // Render component
  const root = createRoot(shadowRoot);
  root.render(
    <SummarizerOverlay
      onClose={() => {
        root.unmount();
        container.remove();
      }}
    />,
  );
};
