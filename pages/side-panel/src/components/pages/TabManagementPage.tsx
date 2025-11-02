import React, { useState, useEffect } from 'react';
import { tabGroupingService, type TabGroup } from '@extension/shared/lib/services/TabGroupingService';

const TabManagementPage: React.FC = () => {
  const [groups, setGroups] = useState<TabGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoGroupEnabled, setAutoGroupEnabled] = useState(false);

  useEffect(() => {
    loadGroups();
    loadSettings();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const allGroups = await tabGroupingService.getAllGroups();
      setGroups(allGroups);
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const result = await chrome.storage.local.get(['tabGroupingSettings']);
      const settings = result.tabGroupingSettings || {};
      setAutoGroupEnabled(settings.autoGroupOnCreate || false);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleGroupByCategory = async () => {
    try {
      await tabGroupingService.groupAllTabsByCategory();
      await loadGroups();
    } catch (error) {
      alert('Failed to group tabs. Please try again.');
    }
  };

  const handleGroupByDomain = async () => {
    try {
      await tabGroupingService.groupAllTabsByDomain();
      await loadGroups();
    } catch (error) {
      alert('Failed to group tabs. Please try again.');
    }
  };

  const handleUngroupAll = async () => {
    if (!confirm('Ungroup all tabs in this window?')) return;
    
    try {
      await tabGroupingService.ungroupAllTabs();
      await loadGroups();
    } catch (error) {
      alert('Failed to ungroup tabs. Please try again.');
    }
  };

  const handleToggleCollapse = async (groupId: number) => {
    try {
      await tabGroupingService.toggleGroupCollapse(groupId);
      await loadGroups();
    } catch (error) {
      console.error('Failed to toggle collapse:', error);
    }
  };

  const handleCloseGroup = async (groupId: number, title: string) => {
    if (!confirm(`Close all tabs in "${title}" group?`)) return;
    
    try {
      await tabGroupingService.closeGroup(groupId);
      await loadGroups();
    } catch (error) {
      alert('Failed to close group. Please try again.');
    }
  };

  const handleToggleAutoGroup = async () => {
    const newValue = !autoGroupEnabled;
    setAutoGroupEnabled(newValue);
    
    try {
      await tabGroupingService.saveSettings({
        autoGroupOnCreate: newValue,
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      grey: 'bg-gray-500',
      blue: 'bg-blue-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      pink: 'bg-pink-500',
      purple: 'bg-purple-500',
      cyan: 'bg-cyan-500',
      orange: 'bg-orange-500',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tab Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize and manage your browser tabs efficiently
          </p>
        </div>
        <button
          onClick={loadGroups}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Auto-Group Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Auto-Group New Tabs
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Automatically organize new tabs into categories as you browse
            </p>
          </div>
          <button
            onClick={handleToggleAutoGroup}
            className={`
              relative inline-flex h-8 w-14 items-center rounded-full transition-colors
              ${autoGroupEnabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}
            `}
          >
            <span
              className={`
                inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                ${autoGroupEnabled ? 'translate-x-7' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={handleGroupByCategory}
            className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            📂 Group by Category
          </button>
          <button
            onClick={handleGroupByDomain}
            className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            🌐 Group by Domain
          </button>
          <button
            onClick={handleUngroupAll}
            className="p-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            ✖️ Ungroup All
          </button>
        </div>
      </div>

      {/* Current Groups */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current Tab Groups ({groups.length})
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No tab groups yet. Use the quick actions above to organize your tabs!
            </p>
            <div className="text-6xl mb-4">📑</div>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* Color Indicator */}
                  <div className={`w-4 h-4 rounded-full ${getColorClass(group.color)}`} />
                  
                  {/* Group Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {group.title}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                        {group.tabIds.length} {group.tabIds.length === 1 ? 'tab' : 'tabs'}
                      </span>
                      {group.collapsed && (
                        <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full">
                          Collapsed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleCollapse(group.id)}
                      className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      title={group.collapsed ? 'Expand' : 'Collapse'}
                    >
                      {group.collapsed ? '📂' : '📁'}
                    </button>
                    <button
                      onClick={() => handleCloseGroup(group.id, group.title)}
                      className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      title="Close all tabs"
                    >
                      ✖️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Info */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-indigo-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          💡 How Tab Grouping Works
        </h3>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>• <strong>Category Mode:</strong> Groups tabs by type (Social Media, Shopping, Video, etc.)</p>
          <p>• <strong>Domain Mode:</strong> Groups tabs from the same website together</p>
          <p>• <strong>Auto-Group:</strong> New tabs are automatically organized as you browse</p>
          <p>• <strong>Colors:</strong> Each group gets a distinct color for easy identification</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-gray-600">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Supported Categories:</strong> Social Media, Video, Shopping, News, Development, Productivity
          </p>
        </div>
      </div>
    </div>
  );
};

export default TabManagementPage;
