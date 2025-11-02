import React, { useState, useEffect } from 'react';

interface NudgeSettings {
  enabled: boolean;
  tone: 'calm' | 'funny' | 'serious' | 'reflective';
  timing: 'immediate' | 'delayed' | 'scheduled';
  categories: string[];
  quietHoursEnabled: boolean;
  quietHoursStart: number;
  quietHoursEnd: number;
  maxPerHour: number;
}

const ALL_CATEGORIES = [
  { id: 'doomscrolling', label: 'Doomscrolling', icon: '🧘' },
  { id: 'binge-watching', label: 'Binge Watching', icon: '👀' },
  { id: 'shopping-loops', label: 'Shopping Loops', icon: '🛒' },
  { id: 'tab-hoarding', label: 'Tab Hoarding', icon: '📑' },
  { id: 'distracted-browsing', label: 'Distracted Browsing', icon: '🎯' },
];

const TONE_OPTIONS = [
  { value: 'calm', label: 'Calm', description: 'Gentle, mindful reminders', emoji: '🌿' },
  { value: 'funny', label: 'Funny', description: 'Lighthearted and playful', emoji: '😄' },
  { value: 'serious', label: 'Serious', description: 'Direct and factual', emoji: '📊' },
  { value: 'reflective', label: 'Reflective', description: 'Thought-provoking questions', emoji: '🤔' },
];

const TIMING_OPTIONS = [
  { value: 'immediate', label: 'Immediate', description: 'Show nudges right away' },
  { value: 'delayed', label: 'Delayed', description: 'Wait a few seconds before showing' },
  { value: 'scheduled', label: 'Scheduled', description: 'Show at set intervals' },
];

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<NudgeSettings>({
    enabled: true,
    tone: 'calm',
    timing: 'delayed',
    categories: ['doomscrolling', 'binge-watching', 'shopping-loops'],
    quietHoursEnabled: true,
    quietHoursStart: 22,
    quietHoursEnd: 7,
    maxPerHour: 3,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const result = await chrome.storage.local.get('nudgeSettings');
      if (result.nudgeSettings) {
        setSettings(result.nudgeSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await chrome.storage.local.set({ nudgeSettings: settings });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = settings.categories.includes(categoryId)
      ? settings.categories.filter(c => c !== categoryId)
      : [...settings.categories, categoryId];
    
    setSettings({ ...settings, categories: newCategories });
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize how Kaizen helps you maintain mindful browsing
        </p>
      </div>

      {/* Master Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Enable Nudges
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Turn behavior awareness nudges on or off
            </p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
            className={`
              relative inline-flex h-8 w-14 items-center rounded-full transition-colors
              ${settings.enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}
            `}
          >
            <span
              className={`
                inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                ${settings.enabled ? 'translate-x-7' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>

      {/* Tone Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Nudge Tone
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TONE_OPTIONS.map((tone) => (
            <button
              key={tone.value}
              onClick={() => setSettings({ ...settings, tone: tone.value as any })}
              className={`
                p-4 rounded-lg border-2 transition-all text-left
                ${settings.tone === tone.value
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tone.emoji}</span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {tone.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {tone.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Timing Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Nudge Timing
        </h2>
        <div className="space-y-2">
          {TIMING_OPTIONS.map((timing) => (
            <label
              key={timing.value}
              className={`
                flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                ${settings.timing === timing.value
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <input
                type="radio"
                name="timing"
                value={timing.value}
                checked={settings.timing === timing.value}
                onChange={(e) => setSettings({ ...settings, timing: e.target.value as any })}
                className="w-4 h-4 text-indigo-600"
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {timing.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {timing.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Categories to Track */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Behavior Categories to Track
        </h2>
        <div className="space-y-3">
          {ALL_CATEGORIES.map((category) => (
            <label
              key={category.id}
              className={`
                flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                ${settings.categories.includes(category.id)
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              <input
                type="checkbox"
                checked={settings.categories.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <span className="text-2xl">{category.icon}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {category.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quiet Hours
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Disable nudges during specific hours
            </p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, quietHoursEnabled: !settings.quietHoursEnabled })}
            className={`
              relative inline-flex h-8 w-14 items-center rounded-full transition-colors
              ${settings.quietHoursEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}
            `}
          >
            <span
              className={`
                inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                ${settings.quietHoursEnabled ? 'translate-x-7' : 'translate-x-1'}
              `}
            />
          </button>
        </div>

        {settings.quietHoursEnabled && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <select
                value={settings.quietHoursStart}
                onChange={(e) => setSettings({ ...settings, quietHoursStart: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <select
                value={settings.quietHoursEnd}
                onChange={(e) => setSettings({ ...settings, quietHoursEnd: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Rate Limiting */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Nudge Frequency
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Maximum nudges per hour: {settings.maxPerHour}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={settings.maxPerHour}
            onChange={(e) => setSettings({ ...settings, maxPerHour: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Less frequent</span>
            <span>More frequent</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={saveSettings}
          disabled={saving}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-all
            ${saving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }
          `}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
        </button>

        {saved && (
          <span className="text-green-600 dark:text-green-400 font-medium">
            Settings saved successfully!
          </span>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
