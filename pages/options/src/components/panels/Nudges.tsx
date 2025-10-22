import { Wind, Smile, Target, MessageCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import type React from "react";

interface NudgesProps {
  theme: "light" | "dark";
}

interface NudgeSettings {
  enabled: boolean;
  tone: "calm" | "funny" | "serious" | "reflective";
  timing: "immediate" | "delayed" | "scheduled";
  categories: string[];
  quietHoursEnabled: boolean;
  quietHoursStart: number; // hour (0-23)
  quietHoursEnd: number; // hour (0-23)
  maxPerHour: number;
}

interface RecentNudge {
  id: string;
  timestamp: number;
  pattern: string;
  message: string;
  userAction: "dismissed" | "acknowledged" | "acted";
}

const Nudges: React.FC<NudgesProps> = () => {
  const [settings, setSettings] = useState<NudgeSettings>({
    enabled: true,
    tone: "calm",
    timing: "delayed",
    categories: ["doomscrolling", "binge-watching", "shopping-loops"],
    quietHoursEnabled: true,
    quietHoursStart: 22,
    quietHoursEnd: 7,
    maxPerHour: 3,
  });

  const [recentNudges] = useState<RecentNudge[]>([
    {
      id: "1",
      timestamp: Date.now() - 3600000,
      pattern: "Doomscrolling",
      message: "You've been scrolling for 30 minutes. Take a mindful break?",
      userAction: "acknowledged",
    },
    {
      id: "2",
      timestamp: Date.now() - 7200000,
      pattern: "Binge Watching",
      message: "Consider pausing after this video. Your eyes will thank you!",
      userAction: "dismissed",
    },
  ]);

  const updateSetting = <K extends keyof NudgeSettings>(
    key: K,
    value: NudgeSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (category: string) => {
    setSettings((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const testNudge = async () => {
    // TODO: Trigger test notification using Chrome Notifications API
    console.log("Test nudge triggered");
  };

  const saveSettings = useCallback(async () => {
    try {
      await chrome.storage.local.set({ nudgeSettings: settings });
      console.log("Nudge settings saved");
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, [settings]);

  useEffect(() => {
    saveSettings();
  }, [saveSettings]);

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Smart Nudges & Notifications
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize how Kaizen gently reminds you to stay balanced
        </p>
      </div>

      {/* Master Toggle */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Enable Nudges
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Turn all nudge notifications on or off
            </p>
          </div>
          <button
            onClick={() => updateSetting("enabled", !settings.enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.enabled ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label="Toggle nudge notifications"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {settings.enabled && (
        <>
          {/* Tone Selector */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Nudge Tone
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose how Kaizen communicates with you
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {(["calm", "funny", "serious", "reflective"] as const).map(
                (tone) => (
                  <ToneCard
                    key={tone}
                    tone={tone}
                    selected={settings.tone === tone}
                    onClick={() => updateSetting("tone", tone)}
                  />
                ),
              )}
            </div>
          </div>

          {/* Timing Controls */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Timing & Frequency
            </h2>
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              {/* Timing Mode */}
              <div className="space-y-2">
                <label
                  htmlFor="timing-select"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  When to send nudges
                </label>
                <select
                  id="timing-select"
                  value={settings.timing}
                  onChange={(e) =>
                    updateSetting(
                      "timing",
                      e.target.value as NudgeSettings["timing"],
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="immediate">
                    Immediate - Right when detected
                  </option>
                  <option value="delayed">
                    Delayed - After 5 minutes of pattern
                  </option>
                  <option value="scheduled">
                    Scheduled - At natural break points
                  </option>
                </select>
              </div>

              {/* Max per hour */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="max-per-hour-slider"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Maximum nudges per hour
                  </label>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {settings.maxPerHour}
                  </span>
                </div>
                <input
                  id="max-per-hour-slider"
                  type="range"
                  min="1"
                  max="10"
                  value={settings.maxPerHour}
                  onChange={(e) =>
                    updateSetting("maxPerHour", parseInt(e.target.value))
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                  aria-label="Maximum nudges per hour"
                />
              </div>

              {/* Quiet Hours */}
              <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quiet Hours
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      No nudges during specified hours
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateSetting(
                        "quietHoursEnabled",
                        !settings.quietHoursEnabled,
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.quietHoursEnabled ? "bg-blue-600" : "bg-gray-300"
                    }`}
                    aria-label="Toggle quiet hours"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.quietHoursEnabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {settings.quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="quiet-hours-start"
                        className="mb-1 block text-xs text-gray-600 dark:text-gray-400"
                      >
                        Start Time
                      </label>
                      <select
                        id="quiet-hours-start"
                        value={settings.quietHoursStart}
                        onChange={(e) =>
                          updateSetting(
                            "quietHoursStart",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>
                            {i.toString().padStart(2, "0")}:00
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="quiet-hours-end"
                        className="mb-1 block text-xs text-gray-600 dark:text-gray-400"
                      >
                        End Time
                      </label>
                      <select
                        id="quiet-hours-end"
                        value={settings.quietHoursEnd}
                        onChange={(e) =>
                          updateSetting(
                            "quietHoursEnd",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i}>
                            {i.toString().padStart(2, "0")}:00
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Pattern Triggers
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose which patterns should trigger nudges
            </p>
            <div className="space-y-2">
              {[
                { id: "doomscrolling", label: "Doomscrolling", icon: "📱" },
                { id: "binge-watching", label: "Binge Watching", icon: "🎬" },
                { id: "shopping-loops", label: "Shopping Loops", icon: "🛒" },
                { id: "tab-hoarding", label: "Tab Hoarding", icon: "📑" },
                {
                  id: "distracted-browsing",
                  label: "Distracted Browsing",
                  icon: "🌀",
                },
              ].map((category) => (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{category.icon}</span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {category.label}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.categories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label={`Toggle ${category.label}`}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Test Nudge */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Test Your Nudge
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Preview how nudges will appear
                </p>
              </div>
              <button
                onClick={testNudge}
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Send Test Nudge
              </button>
            </div>
          </div>

          {/* Recent Nudges History */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Nudges
            </h2>
            <div className="space-y-2">
              {recentNudges.map((nudge) => (
                <div
                  key={nudge.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {nudge.pattern}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(nudge.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {nudge.message}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        nudge.userAction === "acted"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                          : nudge.userAction === "acknowledged"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {nudge.userAction}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Tone Card Component
interface ToneCardProps {
  tone: "calm" | "funny" | "serious" | "reflective";
  selected: boolean;
  onClick: () => void;
}

const ToneCard: React.FC<ToneCardProps> = ({ tone, selected, onClick }) => {
  const toneConfig = {
    calm: {
      icon: <Wind className="h-6 w-6" />,
      label: "Calm",
      example: "Gentle and peaceful",
    },
    funny: {
      icon: <Smile className="h-6 w-6" />,
      label: "Funny",
      example: "Lighthearted humor",
    },
    serious: {
      icon: <Target className="h-6 w-6" />,
      label: "Serious",
      example: "Direct and clear",
    },
    reflective: {
      icon: <MessageCircle className="h-6 w-6" />,
      label: "Reflective",
      example: "Thoughtful prompts",
    },
  };

  const config = toneConfig[tone];

  return (
    <button
      onClick={onClick}
      className={`rounded-lg border p-4 text-left transition-all ${
        selected
          ? "border-blue-500 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30"
          : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
      }`}
    >
      <div className="mb-2 text-blue-600 dark:text-blue-400">{config.icon}</div>
      <div className="font-semibold text-gray-900 dark:text-gray-100">
        {config.label}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {config.example}
      </div>
    </button>
  );
};

export { Nudges };
