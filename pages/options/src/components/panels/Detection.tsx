import {
  Smartphone,
  Film,
  ShoppingCart,
  FileStack,
  Orbit,
  Info,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface DetectionProps {
  theme: "light" | "dark";
}

interface PatternConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  confidence: number;
  threshold: number;
  enabled: boolean;
  detectedToday: number;
}

const Detection: React.FC<DetectionProps> = () => {
  const [patterns, setPatterns] = useState<PatternConfig[]>([
    {
      id: "doomscrolling",
      name: "Doomscrolling",
      icon: <Smartphone className="h-5 w-5" />,
      description: "Detect excessive scrolling on social media and news sites",
      enabled: true,
      confidence: 87,
      threshold: 20,
      detectedToday: 2,
    },
    {
      id: "binge-watching",
      name: "Binge Watching",
      icon: <Film className="h-5 w-5" />,
      description: "Monitor extended video streaming sessions",
      enabled: true,
      confidence: 92,
      threshold: 45,
      detectedToday: 1,
    },
    {
      id: "shopping-loops",
      name: "Shopping Loops",
      icon: <ShoppingCart className="h-5 w-5" />,
      description: "Identify impulsive shopping patterns",
      enabled: true,
      confidence: 78,
      threshold: 15,
      detectedToday: 0,
    },
    {
      id: "tab-hoarding",
      name: "Tab Hoarding",
      icon: <FileStack className="h-5 w-5" />,
      description: "Track excessive tab opening without closure",
      enabled: false,
      confidence: 0,
      threshold: 30,
      detectedToday: 0,
    },
    {
      id: "distracted-browsing",
      name: "Distracted Browsing",
      icon: <Orbit className="h-5 w-5" />,
      description: "Detect rapid switching between unrelated sites",
      enabled: true,
      confidence: 65,
      threshold: 10,
      detectedToday: 3,
    },
  ]);

  const [engineStatus, setEngineStatus] = useState<"active" | "paused">(
    "active",
  );

  const togglePattern = (id: string) => {
    setPatterns((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  const updateThreshold = (id: string, threshold: number) => {
    setPatterns((prev) =>
      prev.map((p) => (p.id === id ? { ...p, threshold } : p)),
    );
  };

  const saveSettings = useCallback(async () => {
    try {
      await chrome.storage.local.set({
        behaviorPatterns: patterns,
        engineStatus,
      });
      console.log("Behavior settings saved");
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, [patterns, engineStatus]);

  useEffect(() => {
    saveSettings();
  }, [saveSettings]);

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Behavior Recognition Engine
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure which patterns Kaizen should detect and monitor
        </p>
      </div>

      {/* Engine Status */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`h-3 w-3 rounded-full ${
                engineStatus === "active"
                  ? "bg-green-500 animate-pulse"
                  : "bg-gray-400"
              }`}
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Detection Engine
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {engineStatus === "active"
                  ? "Actively monitoring your browsing patterns"
                  : "Detection paused"}
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              setEngineStatus((prev) =>
                prev === "active" ? "paused" : "active",
              )
            }
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              engineStatus === "active"
                ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
            }`}
          >
            {engineStatus === "active" ? "Pause Detection" : "Resume Detection"}
          </button>
        </div>
      </div>

      {/* Pattern Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Pattern Detection Settings
        </h2>

        {patterns.map((pattern) => (
          <PatternCard
            key={pattern.id}
            pattern={pattern}
            onToggle={togglePattern}
            onThresholdChange={updateThreshold}
          />
        ))}
      </div>

      {/* Info Section */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-start space-x-3">
          <Info className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
              How Pattern Detection Works
            </h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>
                • <strong>Confidence Score:</strong> AI-powered assessment of
                pattern accuracy (higher is better)
              </li>
              <li>
                • <strong>Threshold:</strong> Minutes of activity before pattern
                is detected
              </li>
              <li>
                • <strong>Privacy-First:</strong> All detection happens locally,
                no data leaves your device
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pattern Card Component
interface PatternCardProps {
  pattern: PatternConfig;
  onToggle: (id: string) => void;
  onThresholdChange: (id: string, threshold: number) => void;
}

const PatternCard: React.FC<PatternCardProps> = ({
  pattern,
  onToggle,
  onThresholdChange,
}) => (
  <div
    className={`rounded-lg border p-6 transition-all ${
      pattern.enabled
        ? "border-blue-200 bg-white dark:border-blue-800 dark:bg-gray-800"
        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
    }`}
  >
    {/* Header */}
    <div className="mb-4 flex items-start justify-between">
      <div className="flex items-start space-x-3">
        <div className="text-blue-600 dark:text-blue-400">{pattern.icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {pattern.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {pattern.description}
          </p>
        </div>
      </div>
      <button
        onClick={() => onToggle(pattern.id)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          pattern.enabled ? "bg-blue-600" : "bg-gray-300"
        }`}
        aria-label={`Toggle ${pattern.name} detection`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            pattern.enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>

    {/* Stats & Controls */}
    {pattern.enabled && (
      <div className="space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
        {/* Confidence Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              Detection Confidence
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {pattern.confidence}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full transition-all ${
                pattern.confidence >= 80
                  ? "bg-green-500"
                  : pattern.confidence >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${pattern.confidence}%` }}
            />
          </div>
        </div>

        {/* Threshold Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <label
              htmlFor={`threshold-${pattern.id}`}
              className="text-gray-700 dark:text-gray-300"
            >
              Detection Threshold
            </label>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {pattern.threshold} min
            </span>
          </div>
          <input
            id={`threshold-${pattern.id}`}
            type="range"
            min="5"
            max="60"
            step="5"
            value={pattern.threshold}
            onChange={(e) =>
              onThresholdChange(pattern.id, parseInt(e.target.value))
            }
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
          />
        </div>

        {/* Detected Today */}
        <div className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-700/50">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Detected Today
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {pattern.detectedToday} times
          </span>
        </div>
      </div>
    )}
  </div>
);

export { Detection };
