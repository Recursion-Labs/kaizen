/**
 * Behavior Storage Service
 * IndexedDB storage for behavioral analytics data
 */

import type {
  BehaviorMetrics,
  BehaviorPattern,
  SiteActivity,
  BehaviorReport,
  StoredBehaviorData,
} from "../types";

const DB_NAME = "KaizenBehaviorDB";
const DB_VERSION = 1;
const STORES = {
  METRICS: "metrics",
  PATTERNS: "patterns",
  SITES: "sites",
  REPORTS: "reports",
};

class BehaviorStorage {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Metrics store (key: YYYY-MM-DD)
        if (!db.objectStoreNames.contains(STORES.METRICS)) {
          db.createObjectStore(STORES.METRICS, { keyPath: "date" });
        }

        // Patterns store
        if (!db.objectStoreNames.contains(STORES.PATTERNS)) {
          const patternsStore = db.createObjectStore(STORES.PATTERNS, {
            keyPath: "id",
          });
          patternsStore.createIndex("type", "type", { unique: false });
          patternsStore.createIndex("startTime", "startTime", {
            unique: false,
          });
        }

        // Sites store (key: domain)
        if (!db.objectStoreNames.contains(STORES.SITES)) {
          const sitesStore = db.createObjectStore(STORES.SITES, {
            keyPath: "domain",
          });
          sitesStore.createIndex("category", "category", { unique: false });
        }

        // Reports store
        if (!db.objectStoreNames.contains(STORES.REPORTS)) {
          const reportsStore = db.createObjectStore(STORES.REPORTS, {
            keyPath: "id",
          });
          reportsStore.createIndex("generatedAt", "generatedAt", {
            unique: false,
          });
        }
      };
    });
  }

  // ============================================================================
  // Metrics Operations
  // ============================================================================

  async saveMetrics(date: string, metrics: BehaviorMetrics): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.METRICS], "readwrite");
      const store = transaction.objectStore(STORES.METRICS);
      const request = store.put(metrics);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getMetrics(date: string): Promise<BehaviorMetrics | null> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.METRICS], "readonly");
      const store = transaction.objectStore(STORES.METRICS);
      const request = store.get(date);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async getMetricsRange(
    startDate: string,
    endDate: string,
  ): Promise<BehaviorMetrics[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.METRICS], "readonly");
      const store = transaction.objectStore(STORES.METRICS);
      const range = IDBKeyRange.bound(startDate, endDate);
      const request = store.getAll(range);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // ============================================================================
  // Pattern Operations
  // ============================================================================

  async savePattern(pattern: BehaviorPattern): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.PATTERNS], "readwrite");
      const store = transaction.objectStore(STORES.PATTERNS);
      const request = store.put(pattern);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getPatternsByType(type: string): Promise<BehaviorPattern[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.PATTERNS], "readonly");
      const store = transaction.objectStore(STORES.PATTERNS);
      const index = store.index("type");
      const request = index.getAll(type);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getRecentPatterns(limit: number = 50): Promise<BehaviorPattern[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.PATTERNS], "readonly");
      const store = transaction.objectStore(STORES.PATTERNS);
      const index = store.index("startTime");
      const request = index.openCursor(null, "prev");
      const results: BehaviorPattern[] = [];

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
    });
  }

  // ============================================================================
  // Site Activity Operations
  // ============================================================================

  async saveSiteActivity(site: SiteActivity): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.SITES], "readwrite");
      const store = transaction.objectStore(STORES.SITES);
      const request = store.put(site);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getSiteActivity(domain: string): Promise<SiteActivity | null> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.SITES], "readonly");
      const store = transaction.objectStore(STORES.SITES);
      const request = store.get(domain);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async getAllSites(): Promise<SiteActivity[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.SITES], "readonly");
      const store = transaction.objectStore(STORES.SITES);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // ============================================================================
  // Report Operations
  // ============================================================================

  async saveReport(report: BehaviorReport): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.REPORTS], "readwrite");
      const store = transaction.objectStore(STORES.REPORTS);
      const request = store.put(report);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getReport(id: string): Promise<BehaviorReport | null> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.REPORTS], "readonly");
      const store = transaction.objectStore(STORES.REPORTS);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async getAllReports(): Promise<BehaviorReport[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.REPORTS], "readonly");
      const store = transaction.objectStore(STORES.REPORTS);
      const index = store.index("generatedAt");
      const request = index.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // ============================================================================
  // Cleanup Operations
  // ============================================================================

  async clearOldData(retentionDays: number): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    const cutoffStr = cutoffDate.toISOString().split("T")[0];

    // Clear old metrics
    const transaction = this.db.transaction(
      [STORES.METRICS, STORES.PATTERNS],
      "readwrite",
    );
    const metricsStore = transaction.objectStore(STORES.METRICS);
    const patternsStore = transaction.objectStore(STORES.PATTERNS);

    // Delete metrics before cutoff date
    metricsStore.delete(IDBKeyRange.upperBound(cutoffStr, true));

    // Delete patterns before cutoff timestamp
    const cutoffTimestamp = cutoffDate.getTime();
    const patternsIndex = patternsStore.index("startTime");
    const request = patternsIndex.openCursor(
      IDBKeyRange.upperBound(cutoffTimestamp, true),
    );

    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [STORES.METRICS, STORES.PATTERNS, STORES.SITES, STORES.REPORTS],
        "readwrite",
      );

      const stores = [
        transaction.objectStore(STORES.METRICS),
        transaction.objectStore(STORES.PATTERNS),
        transaction.objectStore(STORES.SITES),
        transaction.objectStore(STORES.REPORTS),
      ];

      const clearPromises = stores.map((store) => {
        return new Promise<void>((res, rej) => {
          const request = store.clear();
          request.onerror = () => rej(request.error);
          request.onsuccess = () => res();
        });
      });

      Promise.all(clearPromises)
        .then(() => resolve())
        .catch(reject);
    });
  }
}

// Export singleton instance
export const behaviorStorage = new BehaviorStorage();
