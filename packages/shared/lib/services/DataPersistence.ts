/**
 * Data Persistence Service
 * Manages storage and retrieval of behavioral data, reports, and user preferences
 */

export interface BehavioralReport {
  id: string;
  timestamp: number;
  date: string; // YYYY-MM-DD format
  productivityScore: number;
  totalTime: number;
  productiveTime: number;
  distractedTime: number;
  topDomains: Array<{
    domain: string;
    time: number;
    category: string;
  }>;
  insights: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    confidence: number;
    timestamp: number;
  }>;
  doomscrollMetrics: {
    totalDistance: number;
    averagePerSession: number;
    highSeverityCount: number;
  };
  shoppingMetrics: {
    visitCount: number;
    totalTime: number;
    uniqueDomains: number;
  };
}

export interface UserJournalEntry {
  id: string;
  timestamp: number;
  date: string;
  note: string;
  mood?: 'great' | 'good' | 'okay' | 'challenging';
  tags: string[];
}

export class DataPersistenceService {
  private static instance: DataPersistenceService;
  private readonly STORAGE_VERSION = 1;
  private readonly KEYS = {
    REPORTS: 'kaizen_reports',
    JOURNAL: 'kaizen_journal',
    PREFERENCES: 'kaizen_preferences',
    VERSION: 'kaizen_storage_version',
    NUDGE_SETTINGS: 'nudgeSettings',
  };

  private constructor() {
    this.initializeStorage();
  }

  public static getInstance(): DataPersistenceService {
    if (!DataPersistenceService.instance) {
      DataPersistenceService.instance = new DataPersistenceService();
    }
    return DataPersistenceService.instance;
  }

  /**
   * Initialize storage and handle migrations
   */
  private async initializeStorage(): Promise<void> {
    try {
      const result = await chrome.storage.local.get(this.KEYS.VERSION);
      const currentVersion = result[this.KEYS.VERSION] || 0;

      if (currentVersion < this.STORAGE_VERSION) {
        await this.migrateStorage(currentVersion, this.STORAGE_VERSION);
        await chrome.storage.local.set({ [this.KEYS.VERSION]: this.STORAGE_VERSION });
      }
    } catch (error) {
      console.error('[DataPersistence] Failed to initialize storage:', error);
    }
  }

  /**
   * Handle storage migrations
   */
  private async migrateStorage(fromVersion: number, toVersion: number): Promise<void> {
    console.log(`[DataPersistence] Migrating storage from v${fromVersion} to v${toVersion}`);
    
    // Add migration logic here as needed
    if (fromVersion === 0 && toVersion === 1) {
      // Initial setup - ensure all keys exist
      const defaults = {
        [this.KEYS.REPORTS]: {},
        [this.KEYS.JOURNAL]: {},
        [this.KEYS.PREFERENCES]: {
          dataRetentionDays: 90,
          autoExport: false,
          privacyMode: false,
        },
      };

      await chrome.storage.local.set(defaults);
    }
  }

  /**
   * Save a daily behavioral report
   */
  public async saveReport(report: BehavioralReport): Promise<void> {
    try {
      const result = await chrome.storage.local.get(this.KEYS.REPORTS);
      const reports = result[this.KEYS.REPORTS] || {};
      
      reports[report.date] = report;
      
      // Clean up old reports based on retention policy
      await this.cleanupOldData(reports);
      
      await chrome.storage.local.set({ [this.KEYS.REPORTS]: reports });
      console.log(`[DataPersistence] Report saved for ${report.date}`);
    } catch (error) {
      console.error('[DataPersistence] Failed to save report:', error);
      throw error;
    }
  }

  /**
   * Get behavioral reports for a date range
   */
  public async getReports(startDate: string, endDate: string): Promise<BehavioralReport[]> {
    try {
      const result = await chrome.storage.local.get(this.KEYS.REPORTS);
      const reports = result[this.KEYS.REPORTS] || {};
      
      const filtered = Object.values(reports).filter((report: any) => {
        return report.date >= startDate && report.date <= endDate;
      }) as BehavioralReport[];
      
      return filtered.sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('[DataPersistence] Failed to get reports:', error);
      return [];
    }
  }

  /**
   * Get report for a specific date
   */
  public async getReportForDate(date: string): Promise<BehavioralReport | null> {
    try {
      const result = await chrome.storage.local.get(this.KEYS.REPORTS);
      const reports = result[this.KEYS.REPORTS] || {};
      return reports[date] || null;
    } catch (error) {
      console.error('[DataPersistence] Failed to get report for date:', error);
      return null;
    }
  }

  /**
   * Save a journal entry
   */
  public async saveJournalEntry(entry: UserJournalEntry): Promise<void> {
    try {
      const result = await chrome.storage.local.get(this.KEYS.JOURNAL);
      const journal = result[this.KEYS.JOURNAL] || {};
      
      if (!journal[entry.date]) {
        journal[entry.date] = [];
      }
      
      journal[entry.date].push(entry);
      
      await chrome.storage.local.set({ [this.KEYS.JOURNAL]: journal });
      console.log(`[DataPersistence] Journal entry saved for ${entry.date}`);
    } catch (error) {
      console.error('[DataPersistence] Failed to save journal entry:', error);
      throw error;
    }
  }

  /**
   * Get journal entries for a date range
   */
  public async getJournalEntries(startDate: string, endDate: string): Promise<UserJournalEntry[]> {
    try {
      const result = await chrome.storage.local.get(this.KEYS.JOURNAL);
      const journal = result[this.KEYS.JOURNAL] || {};
      
      const entries: UserJournalEntry[] = [];
      for (const date in journal) {
        if (date >= startDate && date <= endDate) {
          entries.push(...journal[date]);
        }
      }
      
      return entries.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('[DataPersistence] Failed to get journal entries:', error);
      return [];
    }
  }

  /**
   * Export all data as JSON
   */
  public async exportAllData(): Promise<string> {
    try {
      const [reports, journal, preferences, nudgeSettings] = await Promise.all([
        chrome.storage.local.get(this.KEYS.REPORTS),
        chrome.storage.local.get(this.KEYS.JOURNAL),
        chrome.storage.local.get(this.KEYS.PREFERENCES),
        chrome.storage.local.get(this.KEYS.NUDGE_SETTINGS),
      ]);

      const exportData = {
        version: this.STORAGE_VERSION,
        exportDate: new Date().toISOString(),
        reports: reports[this.KEYS.REPORTS] || {},
        journal: journal[this.KEYS.JOURNAL] || {},
        preferences: preferences[this.KEYS.PREFERENCES] || {},
        nudgeSettings: nudgeSettings[this.KEYS.NUDGE_SETTINGS] || {},
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('[DataPersistence] Failed to export data:', error);
      throw error;
    }
  }

  /**
   * Import data from JSON
   */
  public async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate the imported data
      if (!data.version || typeof data.reports !== 'object') {
        throw new Error('Invalid data format');
      }

      // Import the data
      await chrome.storage.local.set({
        [this.KEYS.REPORTS]: data.reports || {},
        [this.KEYS.JOURNAL]: data.journal || {},
        [this.KEYS.PREFERENCES]: data.preferences || {},
        [this.KEYS.NUDGE_SETTINGS]: data.nudgeSettings || {},
      });

      console.log('[DataPersistence] Data imported successfully');
    } catch (error) {
      console.error('[DataPersistence] Failed to import data:', error);
      throw error;
    }
  }

  /**
   * Clear all data (for privacy/reset)
   */
  public async clearAllData(): Promise<void> {
    try {
      await chrome.storage.local.remove([
        this.KEYS.REPORTS,
        this.KEYS.JOURNAL,
      ]);
      
      console.log('[DataPersistence] All data cleared');
    } catch (error) {
      console.error('[DataPersistence] Failed to clear data:', error);
      throw error;
    }
  }

  /**
   * Get storage usage stats
   */
  public async getStorageStats(): Promise<{
    bytesUsed: number;
    bytesAvailable: number;
    percentageUsed: number;
  }> {
    try {
      const bytesInUse = await chrome.storage.local.getBytesInUse();
      const QUOTA_BYTES = chrome.storage.local.QUOTA_BYTES || 5242880; // 5MB default
      
      return {
        bytesUsed: bytesInUse,
        bytesAvailable: QUOTA_BYTES - bytesInUse,
        percentageUsed: (bytesInUse / QUOTA_BYTES) * 100,
      };
    } catch (error) {
      console.error('[DataPersistence] Failed to get storage stats:', error);
      return {
        bytesUsed: 0,
        bytesAvailable: 0,
        percentageUsed: 0,
      };
    }
  }

  /**
   * Clean up old data based on retention policy
   */
  private async cleanupOldData(reports: Record<string, BehavioralReport>): Promise<void> {
    try {
      const result = await chrome.storage.local.get(this.KEYS.PREFERENCES);
      const preferences = result[this.KEYS.PREFERENCES] || { dataRetentionDays: 90 };
      const retentionDays = preferences.dataRetentionDays;
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
      
      // Remove old reports
      for (const date in reports) {
        if (date < cutoffDateStr) {
          delete reports[date];
        }
      }
    } catch (error) {
      console.error('[DataPersistence] Failed to cleanup old data:', error);
    }
  }

  /**
   * Get total records count
   */
  public async getRecordCounts(): Promise<{
    reports: number;
    journalEntries: number;
  }> {
    try {
      const [reportsResult, journalResult] = await Promise.all([
        chrome.storage.local.get(this.KEYS.REPORTS),
        chrome.storage.local.get(this.KEYS.JOURNAL),
      ]);

      const reports = reportsResult[this.KEYS.REPORTS] || {};
      const journal = journalResult[this.KEYS.JOURNAL] || {};
      
      const journalCount = Object.values(journal).reduce(
        (total: number, entries: any) => total + entries.length,
        0
      );

      return {
        reports: Object.keys(reports).length,
        journalEntries: journalCount,
      };
    } catch (error) {
      console.error('[DataPersistence] Failed to get record counts:', error);
      return { reports: 0, journalEntries: 0 };
    }
  }
}

// Export singleton instance
export const dataPersistence = DataPersistenceService.getInstance();
