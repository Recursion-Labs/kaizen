import React, { useState, useEffect } from 'react';
import { dataPersistence } from '@extension/shared/lib/services/DataPersistence';

const DataExportPage: React.FC = () => {
  const [stats, setStats] = useState<{
    reports: number;
    journalEntries: number;
    storageUsed: number;
    storagePercent: number;
  } | null>(null);
  const [journalNote, setJournalNote] = useState('');
  const [journalMood, setJournalMood] = useState<'great' | 'good' | 'okay' | 'challenging'>('good');
  const [journalTags, setJournalTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [exporting, setExporting] = useState(false);
  const [savingJournal, setSavingJournal] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [counts, storage] = await Promise.all([
        dataPersistence.getRecordCounts(),
        dataPersistence.getStorageStats(),
      ]);

      setStats({
        reports: counts.reports,
        journalEntries: counts.journalEntries,
        storageUsed: Math.round(storage.bytesUsed / 1024), // KB
        storagePercent: Math.round(storage.percentageUsed),
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const jsonData = await dataPersistence.exportAllData();
      
      // Create download
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kaizen-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await dataPersistence.importData(text);
      alert('Data imported successfully!');
      loadStats();
    } catch (error) {
      console.error('Failed to import data:', error);
      alert('Failed to import data. Please check the file format.');
    }
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to clear all behavioral data? This cannot be undone.')) {
      return;
    }

    try {
      await dataPersistence.clearAllData();
      alert('All data cleared successfully.');
      loadStats();
    } catch (error) {
      console.error('Failed to clear data:', error);
      alert('Failed to clear data. Please try again.');
    }
  };

  const handleSaveJournal = async () => {
    if (!journalNote.trim()) return;

    setSavingJournal(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await dataPersistence.saveJournalEntry({
        id: `journal-${Date.now()}`,
        timestamp: Date.now(),
        date: today,
        note: journalNote,
        mood: journalMood,
        tags: journalTags,
      });

      setJournalNote('');
      setJournalTags([]);
      setNewTag('');
      alert('Journal entry saved!');
      loadStats();
    } catch (error) {
      console.error('Failed to save journal:', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setSavingJournal(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !journalTags.includes(newTag.trim())) {
      setJournalTags([...journalTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setJournalTags(journalTags.filter(t => t !== tag));
  };

  const getMoodEmoji = (mood: string) => {
    const emojis = {
      great: '😄',
      good: '🙂',
      okay: '😐',
      challenging: '😔',
    };
    return emojis[mood as keyof typeof emojis] || '🙂';
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data & Reflections</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Export your data, add reflections, and manage your information
        </p>
      </div>

      {/* Storage Stats */}
      {stats && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Storage Overview
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats.reports}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Reports</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats.journalEntries}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Journal Entries</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                {stats.storageUsed} KB
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stats.storagePercent}% Used
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Journal Entry */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ✍️ Add Reflection
        </h2>
        
        <div className="space-y-4">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              How are you feeling?
            </label>
            <div className="flex gap-3">
              {(['great', 'good', 'okay', 'challenging'] as const).map((mood) => (
                <button
                  key={mood}
                  onClick={() => setJournalMood(mood)}
                  className={`
                    flex-1 p-3 rounded-lg border-2 transition-all
                    ${journalMood === mood
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{getMoodEmoji(mood)}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {mood}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your thoughts
            </label>
            <textarea
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="What did you notice about your browsing today? Any insights or patterns?"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (optional)
            </label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {journalTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
              >
                Add
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveJournal}
            disabled={!journalNote.trim() || savingJournal}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {savingJournal ? 'Saving...' : 'Save Reflection'}
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          💾 Data Management
        </h2>
        
        <div className="space-y-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-400"
          >
            {exporting ? 'Exporting...' : '📥 Export All Data (JSON)'}
          </button>

          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <div className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center cursor-pointer">
              📤 Import Data
            </div>
          </label>

          <button
            onClick={handleClearData}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            🗑️ Clear All Data
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          Your data is stored locally and never leaves your browser.
        </p>
      </div>
    </div>
  );
};

export default DataExportPage;
