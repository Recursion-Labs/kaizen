/**
 * AIFloatingBubble - Dynamic AI Tools Access
 *
 * A floating bubble that appears on all web pages, providing quick access
 * to Chrome AI APIs for productivity and content enhancement.
 *
 * Features:
 * - Floating bubble on all pages
 * - Quick access menu with AI tools
 * - Modal interfaces for each AI API
 * - Proofreader, Translator, Rewriter, Writer, etc.
 * - Privacy-first, local processing only
 */

import inlineCss from "../../dist/all/index.css?inline";
import { AIOverlayManager } from "../services/AIOverlayManager";
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

interface AIFloatingBubbleProps {
  onClose?: () => void;
}

interface AITool {
  id: string;
  name: string;
  icon: string;
  description: string;
  available: boolean;
}

const AIFloatingBubble = ({ onClose }: AIFloatingBubbleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [aiManager, setAIManager] = useState<AIOverlayManager | null>(null);
  const [tools, setTools] = useState<AITool[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const manager = AIOverlayManager.getInstance();
        await manager.initialize();
        setAIManager(manager);

        // Define available AI tools
        const availableTools: AITool[] = [
          {
            id: "proofreader",
            name: "Proofreader",
            icon: "✏️",
            description: "Check grammar and spelling",
            available: manager.isAvailable("proofreader"),
          },
          {
            id: "translator",
            name: "Translator",
            icon: "🌐",
            description: "Translate text to any language",
            available: await manager.isTranslatorAvailable(),
          },
          {
            id: "rewriter",
            name: "Rewriter",
            icon: "📝",
            description: "Rewrite content in different styles",
            available: manager.isAvailable("rewriter"),
          },
          {
            id: "writer",
            name: "Writer",
            icon: "✍️",
            description: "Generate creative content",
            available: manager.isAvailable("writer"),
          },
          {
            id: "summarizer",
            name: "Summarizer",
            icon: "📋",
            description: "Summarize long text",
            available: manager.isAvailable("summarizer"),
          },
          {
            id: "languageDetector",
            name: "Language Detector",
            icon: "🔍",
            description: "Detect text language",
            available: manager.isAvailable("languageDetector"),
          },
        ];

        setTools(availableTools);
      } catch (error) {
        console.error("[Kaizen AI Bubble] Initialization failed:", error);
      }
    };

    init();
  }, []);

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId);
    setIsExpanded(false);
  };

  const handleClose = () => {
    setSelectedTool(null);
    onClose?.();
  };

  return (
    <>
      {/* Floating Bubble */}
      <div
        className="fixed top-1/2 left-4 transform -translate-y-1/2 z-[99999] group"
        style={{ isolation: "isolate" }}
      >
        {/* Main Bubble */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            relative w-16 h-16 rounded-full shadow-2xl transition-all duration-500 ease-out
            bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
            hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400
            hover:scale-110 hover:shadow-3xl hover:shadow-purple-500/30
            flex items-center justify-center text-white font-bold text-2xl
            ${isExpanded ? "rotate-45 scale-110" : "animate-pulse"}
            before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br
            before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100
            before:transition-opacity before:duration-300
          `}
          title="Kaizen AI Tools - Click to expand"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300 -z-10"></div>

          {/* Icon */}
          <span className="relative z-10 text-2xl drop-shadow-lg">
            {isExpanded ? "✕" : "🤖"}
          </span>

          {/* Pulse ring */}
          {!isExpanded && (
            <div className="absolute inset-0 rounded-full border-2 border-purple-300/50 animate-ping"></div>
          )}
        </button>

        {/* Expanded Menu */}
        {isExpanded && (
          <div className="absolute left-20 top-1/2 transform -translate-y-1/2 ml-4 animate-in slide-in-from-left duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 min-w-[320px] max-w-[380px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      Kaizen AI
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Smart Tools
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    disabled={!tool.available}
                    className={`
                      group relative p-4 rounded-xl transition-all duration-200 text-left
                      ${
                        tool.available
                          ? `
                          bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700
                          hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20
                          hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-105
                          border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500
                        `
                          : `
                          bg-gray-100 dark:bg-gray-800 opacity-60 cursor-not-allowed
                          border border-gray-200 dark:border-gray-700
                        `
                      }
                    `}
                  >
                    {/* Tool Icon */}
                    <div
                      className={`
                      w-12 h-12 rounded-lg mb-3 flex items-center justify-center text-2xl
                      ${
                        tool.available
                          ? "bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 group-hover:from-indigo-200 group-hover:to-purple-200"
                          : "bg-gray-200 dark:bg-gray-700"
                      }
                    `}
                    >
                      {tool.icon}
                    </div>

                    {/* Tool Info */}
                    <div className="space-y-1">
                      <div
                        className={`font-semibold text-sm ${tool.available ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
                      >
                        {tool.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                        {tool.description}
                      </div>
                    </div>

                    {/* Availability Badge */}
                    {!tool.available && (
                      <div className="absolute top-2 right-2">
                        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full font-medium">
                          Soon
                        </span>
                      </div>
                    )}

                    {/* Hover effect */}
                    {tool.available && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">🔒</span>
                  <span>Local AI Processing</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tool Modals */}
      {selectedTool && (
        <AIToolModal
          toolId={selectedTool}
          aiManager={aiManager}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </>
  );
};

interface AIToolModalProps {
  toolId: string;
  aiManager: AIOverlayManager | null;
  onClose: () => void;
}

const AIToolModal = ({ toolId, aiManager, onClose }: AIToolModalProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toolConfig = {
    proofreader: {
      title: "Grammar & Spelling Checker",
      placeholder: "Paste your text here to check grammar and spelling...",
      action: "Check Grammar",
      process: async (text: string) => {
        if (!aiManager) throw new Error("AI Manager not available");
        return await aiManager.proofread(text);
      },
    },
    translator: {
      title: "Text Translator",
      placeholder: "Enter text to translate...",
      action: "Translate",
      process: async (text: string) => {
        if (!aiManager) throw new Error("AI Manager not available");
        // For demo, translate to Spanish. In real implementation, you'd have language selection
        return await aiManager.translate(text, "en", "es");
      },
    },
    rewriter: {
      title: "Content Rewriter",
      placeholder: "Enter text to rewrite in a different style...",
      action: "Rewrite",
      process: async (text: string) => {
        if (!aiManager) throw new Error("AI Manager not available");
        return await aiManager.rewrite(text, { tone: "professional" });
      },
    },
    writer: {
      title: "Content Generator",
      placeholder: "Describe what you want to write...",
      action: "Generate",
      process: async (text: string) => {
        if (!aiManager) throw new Error("AI Manager not available");
        return await aiManager.write(text);
      },
    },
    summarizer: {
      title: "Text Summarizer",
      placeholder: "Paste long text to summarize...",
      action: "Summarize",
      process: async (text: string) => {
        if (!aiManager) throw new Error("AI Manager not available");
        return await aiManager.summarize(text);
      },
    },
    languageDetector: {
      title: "Language Detector",
      placeholder: "Enter text to detect its language...",
      action: "Detect",
      process: async (text: string) => {
        if (!aiManager) throw new Error("AI Manager not available");
        const language = await aiManager.detectLanguage(text);
        return `Detected language: ${language}`;
      },
    },
  };

  const config = toolConfig[toolId as keyof typeof toolConfig];
  if (!config) return null;

  const handleProcess = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setOutput("");

    try {
      const result = await config.process(input);
      setOutput(
        typeof result === "string" ? result : JSON.stringify(result, null, 2),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      // Could add a toast notification here
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {config.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input Text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={config.placeholder}
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleProcess}
            disabled={!input.trim() || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? "Processing..." : config.action}
          </button>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Output */}
          {output && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Result
                </label>
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  📋 Copy
                </button>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg max-h-48 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100">
                  {output}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            🔒 Processed locally with Chrome AI • No data sent to servers
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Inject AI Floating Bubble into any webpage
 */
export const showAIFloatingBubble = () => {
  // Check if already exists
  if (document.querySelector("#kaizen-ai-bubble-root")) {
    console.log("[Kaizen AI] Floating bubble already exists");
    return;
  }

  // Create container
  const container = document.createElement("div");
  container.id = "kaizen-ai-bubble-root";
  document.body.appendChild(container);

  // Create shadow DOM for style isolation
  const shadow = container.attachShadow({ mode: "open" });
  const shadowRoot = document.createElement("div");
  shadow.appendChild(shadowRoot);

  // Add Tailwind styles to shadow DOM
  const style = document.createElement("style");
  style.textContent =
    inlineCss +
    `
    /* Custom animations */
    @keyframes slide-in-from-bottom-2 {
      from {
        opacity: 0;
        transform: translateY(0.5rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slide-in-from-left {
      from {
        opacity: 0;
        transform: translateX(-0.5rem);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .animate-in {
      animation: slide-in-from-bottom-2 0.2s ease-out;
    }

    .slide-in-from-left {
      animation: slide-in-from-left 0.3s ease-out;
    }
  `;
  shadow.appendChild(style);

  // Render component
  const root = createRoot(shadowRoot);
  root.render(
    <AIFloatingBubble
      onClose={() => {
        root.unmount();
        container.remove();
      }}
    />,
  );

  console.log("[Kaizen AI] Floating bubble injected 🚀");
};

export default AIFloatingBubble;
