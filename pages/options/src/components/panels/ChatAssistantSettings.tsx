import { cn } from "@extension/ui";
import type React from "react";

interface ChatAssistantSettingsProps {
  theme: "light" | "dark";
}

const CapabilityCard: React.FC<{
  title: string;
  icon: string;
  description: string;
  features: string[];
  theme: "light" | "dark";
}> = ({ title, icon, description, features, theme }) => (
  <div
    className={cn(
      "p-6 rounded-lg border",
      theme === "light"
        ? "bg-white border-slate-200"
        : "bg-gray-800 border-gray-700",
    )}
  >
    <div className="flex items-start space-x-3 mb-4">
      <div className="text-3xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <h4
          className={cn(
            "font-semibold mb-1",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          {title}
        </h4>
        <p
          className={cn(
            "text-sm",
            theme === "light" ? "text-gray-600" : "text-gray-400",
          )}
        >
          {description}
        </p>
      </div>
    </div>
    <ul className="space-y-2">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-center space-x-2 text-sm">
          <span className="text-blue-500">→</span>
          <span
            className={cn(
              "",
              theme === "light" ? "text-gray-700" : "text-gray-300",
            )}
          >
            {feature}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export const ChatAssistantSettings: React.FC<ChatAssistantSettingsProps> = ({
  theme,
}) => {
  const capabilities = [
    {
      title: "Text Chat",
      icon: "💬",
      description: "Conversational AI assistance",
      features: [
        "Multi-turn conversations",
        "Context awareness",
        "Follow-up questions",
      ],
    },
    {
      title: "Voice Input",
      icon: "🎤",
      description: "Speech-to-text commands",
      features: [
        "Audio recording & transcription",
        "Natural language processing",
        "Voice commands",
      ],
    },
    {
      title: "Image Analysis",
      icon: "🖼️",
      description: "Visual content understanding",
      features: [
        "Screenshot analysis",
        "Visual question answering",
        "Content description",
      ],
    },
    {
      title: "Content Summarization",
      icon: "📝",
      description: "Smart text condensing",
      features: [
        "Tab summarization",
        "Article compression",
        "Document synthesis",
      ],
    },
    {
      title: "Knowledge Graph",
      icon: "🔗",
      description: "Concept relationship mapping",
      features: [
        "Entity extraction",
        "Relationship mapping",
        "Visual mind maps",
      ],
    },
    {
      title: "Content Rewriting",
      icon: "✏️",
      description: "Text enhancement & transformation",
      features: ["Tone adjustment", "Grammar fixes", "Language translation"],
    },
  ];

  const aiModels = [
    {
      name: "Gemini Nano",
      category: "Local Inference",
      description: "Compact language model for on-device processing",
      size: "~1.5GB",
      speed: "Fast",
      capabilities: [
        "Summarization",
        "Text generation",
        "Classification",
        "Q&A",
      ],
    },
    {
      name: "Chrome Built-in APIs",
      category: "Hybrid Processing",
      description: "Google's optimized AI APIs available in Chrome",
      size: "Native",
      speed: "Ultra-fast",
      capabilities: [
        "Prompt API (reasoning)",
        "Summarizer (distill)",
        "Rewriter (improve)",
        "Translator (i18n)",
      ],
    },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h2
          className={cn(
            "text-3xl font-bold mb-2",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          💬 Chat Assistant
        </h2>
        <p
          className={cn(
            "text-base max-w-2xl",
            theme === "light" ? "text-gray-600" : "text-gray-400",
          )}
        >
          AI-powered conversational interface with multimodal input (text,
          voice, images) powered by Chrome Built-in AI APIs and Gemini Nano. All
          processing happens locally on your device.
        </p>
      </div>

      {/* Core Capabilities */}
      <section className="mb-12">
        <h3
          className={cn(
            "text-2xl font-bold mb-6",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          Core Capabilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => (
            <CapabilityCard
              key={idx}
              title={cap.title}
              icon={cap.icon}
              description={cap.description}
              features={cap.features}
              theme={theme}
            />
          ))}
        </div>
      </section>

      {/* AI Models & Processing */}
      <section className="mb-12">
        <h3
          className={cn(
            "text-2xl font-bold mb-6",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          AI Models & Processing
        </h3>
        <div className="space-y-4">
          {aiModels.map((model, idx) => (
            <div
              key={idx}
              className={cn(
                "p-6 rounded-lg border",
                theme === "light"
                  ? "bg-white border-slate-200"
                  : "bg-gray-800 border-gray-700",
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                <div>
                  <h4
                    className={cn(
                      "font-semibold mb-1",
                      theme === "light" ? "text-gray-900" : "text-white",
                    )}
                  >
                    {model.name}
                  </h4>
                  <p
                    className={cn(
                      "text-xs font-medium",
                      theme === "light" ? "text-blue-600" : "text-blue-400",
                    )}
                  >
                    {model.category}
                  </p>
                </div>
                <div>
                  <p
                    className={cn(
                      "text-sm",
                      theme === "light" ? "text-gray-600" : "text-gray-400",
                    )}
                  >
                    {model.description}
                  </p>
                </div>
                <div>
                  <p
                    className={cn(
                      "text-xs mb-1",
                      theme === "light" ? "text-gray-500" : "text-gray-400",
                    )}
                  >
                    Model Size
                  </p>
                  <p
                    className={cn(
                      "font-semibold",
                      theme === "light" ? "text-gray-900" : "text-white",
                    )}
                  >
                    {model.size}
                  </p>
                </div>
                <div>
                  <p
                    className={cn(
                      "text-xs mb-1",
                      theme === "light" ? "text-gray-500" : "text-gray-400",
                    )}
                  >
                    Speed
                  </p>
                  <p
                    className={cn(
                      "font-semibold text-green-600",
                      theme === "light" ? "" : "text-green-400",
                    )}
                  >
                    {model.speed}
                  </p>
                </div>
              </div>
              <div>
                <p
                  className={cn(
                    "text-xs font-medium mb-2",
                    theme === "light" ? "text-gray-600" : "text-gray-400",
                  )}
                >
                  Capabilities
                </p>
                <div className="flex flex-wrap gap-2">
                  {model.capabilities.map((cap, cidx) => (
                    <span
                      key={cidx}
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        theme === "light"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-blue-900/30 text-blue-300",
                      )}
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="mb-12">
        <h3
          className={cn(
            "text-2xl font-bold mb-6",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          Features & Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={cn(
              "p-6 rounded-lg border",
              theme === "light"
                ? "bg-purple-50 border-purple-200"
                : "bg-purple-900/20 border-purple-800",
            )}
          >
            <h4
              className={cn(
                "font-semibold mb-4 flex items-center space-x-2",
                theme === "light" ? "text-purple-900" : "text-purple-300",
              )}
            >
              <span>⚡</span>
              <span>Performance</span>
            </h4>
            <ul
              className={cn(
                "text-sm space-y-2",
                theme === "light" ? "text-purple-800" : "text-purple-200",
              )}
            >
              <li>✓ Instant local processing</li>
              <li>✓ No network latency</li>
              <li>✓ Low resource overhead</li>
              <li>✓ Optimized for responsiveness</li>
            </ul>
          </div>
          <div
            className={cn(
              "p-6 rounded-lg border",
              theme === "light"
                ? "bg-indigo-50 border-indigo-200"
                : "bg-indigo-900/20 border-indigo-800",
            )}
          >
            <h4
              className={cn(
                "font-semibold mb-4 flex items-center space-x-2",
                theme === "light" ? "text-indigo-900" : "text-indigo-300",
              )}
            >
              <span>🔒</span>
              <span>Privacy & Control</span>
            </h4>
            <ul
              className={cn(
                "text-sm space-y-2",
                theme === "light" ? "text-indigo-800" : "text-indigo-200",
              )}
            >
              <li>✓ On-device processing</li>
              <li>✓ No data uploads</li>
              <li>✓ User data control</li>
              <li>✓ Transparent operations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Input Methods */}
      <section>
        <h3
          className={cn(
            "text-2xl font-bold mb-6",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          Multimodal Input Methods
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "⌨️",
              title: "Text Input",
              description: "Type commands and questions naturally",
            },
            {
              icon: "🎤",
              title: "Voice Recording",
              description: "Speak naturally for hands-free interaction",
            },
            {
              icon: "📸",
              title: "Image Upload",
              description: "Share screenshots for visual analysis",
            },
          ].map((method, idx) => (
            <div
              key={idx}
              className={cn(
                "p-4 rounded-lg border text-center",
                theme === "light"
                  ? "bg-white border-slate-200"
                  : "bg-gray-800 border-gray-700",
              )}
            >
              <div className="text-3xl mb-2">{method.icon}</div>
              <h4
                className={cn(
                  "font-semibold mb-1",
                  theme === "light" ? "text-gray-900" : "text-white",
                )}
              >
                {method.title}
              </h4>
              <p
                className={cn(
                  "text-xs",
                  theme === "light" ? "text-gray-600" : "text-gray-400",
                )}
              >
                {method.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
