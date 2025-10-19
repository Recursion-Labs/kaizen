import { cn } from "../utils";
import {
  Bot,
  CheckCircle2,
  FileText,
  Globe,
  Pencil,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

type AIFeature =
  | "summarizer"
  | "proofreader"
  | "translator"
  | "writer"
  | "rewriter"
  | "language-detector"
  | "prompt";

interface AIOverlayCircleProps {
  className?: string;
}

interface AIFeatureConfig {
  id: AIFeature;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

export const AIOverlayCircle: React.FC<AIOverlayCircleProps> = ({
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<AIFeature | null>(
    null,
  );
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const features: AIFeatureConfig[] = [
    {
      id: "summarizer",
      label: "Summarize",
      icon: <FileText className="h-5 w-5" />,
      description: "Condense content into key points",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "proofreader",
      label: "Proofread",
      icon: <CheckCircle2 className="h-5 w-5" />,
      description: "Fix grammar and spelling",
      color: "text-green-600 dark:text-green-400",
    },
    {
      id: "translator",
      label: "Translate",
      icon: <Globe className="h-5 w-5" />,
      description: "Translate to any language",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "writer",
      label: "Write",
      icon: <Pencil className="h-5 w-5" />,
      description: "Generate new content",
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      id: "rewriter",
      label: "Rewrite",
      icon: <RefreshCw className="h-5 w-5" />,
      description: "Improve and rephrase",
      color: "text-pink-600 dark:text-pink-400",
    },
    {
      id: "language-detector",
      label: "Detect Language",
      icon: <Globe className="h-5 w-5" />,
      description: "Identify text language",
      color: "text-cyan-600 dark:text-cyan-400",
    },
    {
      id: "prompt",
      label: "AI Assistant",
      icon: <Bot className="h-5 w-5" />,
      description: "Chat with AI",
      color: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  const handleFeatureClick = (feature: AIFeature) => {
    setSelectedFeature(feature);
    setInputText("");
    setOutputText("");
  };

  const handleProcess = async () => {
    if (!inputText.trim() || !selectedFeature) return;

    setIsProcessing(true);
    setOutputText("");

    try {
      // Check if AI APIs are available
      if (!window.ai) {
        setOutputText(
          "Chrome AI APIs not available. Please use Chrome Canary with AI features enabled.",
        );
        setIsProcessing(false);
        return;
      }

      let result = "";

      switch (selectedFeature) {
        case "summarizer":
          result = await handleSummarizer();
          break;
        case "proofreader":
          result = await handleProofreader();
          break;
        case "translator":
          result = await handleTranslator();
          break;
        case "writer":
          result = await handleWriter();
          break;
        case "rewriter":
          result = await handleRewriter();
          break;
        case "language-detector":
          result = await handleLanguageDetector();
          break;
        case "prompt":
          result = await handlePrompt();
          break;
      }

      setOutputText(result);
    } catch (error) {
      setOutputText(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSummarizer = async (): Promise<string> => {
    const summarizer = await window.ai!.summarizer.create({
      type: "key-points",
      format: "markdown",
      length: "medium",
    });
    return await summarizer.summarize(inputText);
  };

  const handleProofreader = async (): Promise<string> => {
    const proofreader = await window.ai!.proofreader.create();
    const corrections = await proofreader.proofread(inputText);
    return corrections.length > 0
      ? `Found ${corrections.length} issue(s):\n${corrections.map((c) => `- ${c.suggestion}`).join("\n")}`
      : "No issues found!";
  };

  const handleTranslator = async (): Promise<string> => {
    const translator = await window.ai!.translator.create({
      sourceLanguage: "en",
      targetLanguage: "es", // Example: English to Spanish
    });
    return await translator.translate(inputText);
  };

  const handleWriter = async (): Promise<string> => {
    const writer = await window.ai!.writer.create({
      tone: "professional",
      length: "medium",
    });
    return await writer.write(inputText);
  };

  const handleRewriter = async (): Promise<string> => {
    const rewriter = await window.ai!.rewriter.create({
      tone: "professional",
      format: "as-is",
    });
    return await rewriter.rewrite(inputText);
  };

  const handleLanguageDetector = async (): Promise<string> => {
    const detector = await window.ai!.languageDetector.detect(inputText);
    return `Detected language: ${detector.language} (${Math.round(detector.confidence * 100)}% confidence)`;
  };

  const handlePrompt = async (): Promise<string> => {
    const session = await window.ai!.languageModel.create({
      temperature: 0.7,
      topK: 40,
    });
    return await session.prompt(inputText);
  };

  return (
    <>
      {/* Main Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-2xl",
          "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500",
          "flex items-center justify-center transition-all duration-300",
          "hover:scale-110 hover:shadow-purple-500/50",
          "focus:outline-none focus:ring-4 focus:ring-purple-400/50",
          isOpen && "scale-95",
          className,
        )}
        aria-label="AI Overlay"
      >
        <Sparkles className="h-8 w-8 animate-pulse text-white" />
      </button>

      {/* Overlay Panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-24 right-6 z-50 w-96 rounded-2xl shadow-2xl",
            "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
            "transform transition-all duration-300",
            "animate-in slide-in-from-bottom-4",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                AI Assistant
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Feature Grid */}
          {!selectedFeature && (
            <div className="grid grid-cols-2 gap-3 p-4">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature.id)}
                  className={cn(
                    "group flex flex-col items-center rounded-xl border-2 p-4 text-center",
                    "transition-all duration-200 hover:scale-105",
                    "border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50",
                    "dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-600 dark:hover:bg-purple-900/20",
                  )}
                >
                  <div className={cn(feature.color, "mb-2")}>
                    {feature.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {feature.label}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Selected Feature Interface */}
          {selectedFeature && (
            <div className="space-y-4 p-4">
              {/* Back Button */}
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-sm text-purple-600 hover:underline dark:text-purple-400"
              >
                ← Back to features
              </button>

              {/* Input Area */}
              <div>
                <label
                  htmlFor="ai-input"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Input Text
                </label>
                <textarea
                  id="ai-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter your text here..."
                  className={cn(
                    "w-full rounded-lg border border-gray-300 p-3 text-sm",
                    "focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20",
                    "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
                  )}
                  rows={4}
                />
              </div>

              {/* Process Button */}
              <button
                onClick={handleProcess}
                disabled={!inputText.trim() || isProcessing}
                className={cn(
                  "w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3",
                  "font-medium text-white shadow-lg transition-all",
                  "hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed",
                )}
              >
                {isProcessing ? "Processing..." : "Process with AI"}
              </button>

              {/* Output Area */}
              {outputText && (
                <div>
                  <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Result
                  </div>
                  <div
                    className={cn(
                      "rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm",
                      "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
                      "max-h-64 overflow-y-auto",
                    )}
                  >
                    {outputText}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
