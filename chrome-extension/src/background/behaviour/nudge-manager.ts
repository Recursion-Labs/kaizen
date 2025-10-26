import type { InterventionScheduler } from "./intervention-scheduler";

export interface NudgeSettings {
  enabled: boolean;
  tone: "calm" | "funny" | "serious" | "reflective";
  timing: "immediate" | "delayed" | "scheduled";
  categories: string[];
  quietHoursEnabled: boolean;
  quietHoursStart: number;
  quietHoursEnd: number;
  maxPerHour: number;
}

export interface NudgeContext {
  category: string;
  severity: "low" | "medium" | "high";
  tabId?: number;
  url?: string;
  domain?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

export type NudgeType = "chrome-notification" | "in-page-alert" | "scheduled-reminder";

/**
 * NudgeManager handles all nudge-related functionality including
 * timing, content generation, and delivery methods
 */
export class NudgeManager {
  private settings: NudgeSettings = {
    enabled: true,
    tone: "calm",
    timing: "delayed",
    categories: ["doomscrolling", "binge-watching", "shopping-loops"],
    quietHoursEnabled: true,
    quietHoursStart: 22,
    quietHoursEnd: 7,
    maxPerHour: 3,
  };

  private scheduler: InterventionScheduler;
  private nudgeHistory: number[] = [];
  private lastNudgeTime = 0;
  private cooldowns: Map<string, number> = new Map();
  private pendingNudges: Map<string, { type: NudgeType; context: NudgeContext; message: string }> = new Map();

  constructor(scheduler: InterventionScheduler) {
    this.scheduler = scheduler;
    this.loadSettings();
    this.setupAlarmListener();
  }

  /**
   * Load nudge settings from chrome storage
   */
  private async loadSettings(): Promise<void> {
    try {
      const result = await chrome.storage.local.get('nudgeSettings');
      if (result.nudgeSettings) {
        this.settings = { ...this.settings, ...result.nudgeSettings };
      }
    } catch (error) {
      console.error('Failed to load nudge settings:', error);
    }
  }

  /**
   * Check if nudges are enabled and within operational hours
   */
  private canSendNudge(): boolean {
    if (!this.settings.enabled) return false;

    // Check quiet hours
    if (this.settings.quietHoursEnabled) {
      const now = new Date();
      const currentHour = now.getHours();
      const { quietHoursStart, quietHoursEnd } = this.settings;

      if (quietHoursStart > quietHoursEnd) {
        // Quiet hours span midnight (e.g., 22:00 to 07:00)
        if (currentHour >= quietHoursStart || currentHour < quietHoursEnd) {
          return false;
        }
      } else {
        // Quiet hours within same day (e.g., 01:00 to 06:00)
        if (currentHour >= quietHoursStart && currentHour < quietHoursEnd) {
          return false;
        }
      }
    }

    // Check rate limiting (max per hour)
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    // Clean old entries
    this.nudgeHistory = this.nudgeHistory.filter(time => time > oneHourAgo);

    if (this.nudgeHistory.length >= this.settings.maxPerHour) {
      console.log('[NudgeManager] Rate limit exceeded, skipping nudge');
      return false;
    }

    return true;
  }

  /**
   * Check if category is enabled for nudges
   */
  private isCategoryEnabled(category: string): boolean {
    return this.settings.categories.includes(category);
  }

  /**
   * Generate nudge message based on tone and context
   */
  private generateMessage(context: NudgeContext): string {
    const { category, severity } = context;
    const tone = this.settings.tone;

    const messages = {
      calm: {
        doomscrolling: {
          low: "You've been browsing for a while. Consider a mindful pause.",
          medium: "Notice your scrolling pattern. A short break could help refocus.",
          high: "You've been scrolling for quite some time. Take a gentle moment to breathe.",
        },
        "binge-watching": {
          low: "Enjoying your content? Consider pausing after this video.",
          medium: "Multiple videos in a row. Your eyes might appreciate a break.",
          high: "Extended viewing session detected. Consider stepping away for a moment.",
        },
        "shopping-loops": {
          low: "Multiple shopping visits noticed. Take a moment to reflect.",
          medium: "Shopping pattern detected. Consider your current needs.",
          high: "Frequent shopping site visits. A mindful pause might help.",
        },
        "tab-hoarding": {
          low: "Many tabs open. Consider organizing or closing some.",
          medium: "Tab collection growing. Review what you need open.",
          high: "Significant tab accumulation. Consider a cleanup session.",
        },
        "distracted-browsing": {
          low: "Frequent site switching detected. Consider focusing on one task.",
          medium: "Rapid browsing pattern noticed. Try staying with one activity.",
          high: "High distraction level detected. Consider a focused approach.",
        },
      },
      funny: {
        doomscrolling: {
          low: "Whoa there, scroll master! Your feed is getting jealous of all that attention.",
          medium: "Scroll scroll scroll... your mouse must be getting dizzy!",
          high: "Breaking news: Local user has achieved scroll enlightenment! 🧘‍♀️",
        },
        "binge-watching": {
          low: "Binge watching detected! Your couch is probably worried about you.",
          medium: "Video marathon in progress! Don't forget to hydrate! 💧",
          high: "You've watched more videos than a cat watches laser pointers! 🎥",
        },
        "shopping-loops": {
          low: "Shopping spree alert! Your wallet is texting you for backup.",
          medium: "Retail therapy detected! Hope you're buying happiness, not just stuff.",
          high: "You've shopped more than a personal shopper on caffeine! 🛍️",
        },
        "tab-hoarding": {
          low: "Tab hoarder level: Novice. Your browser is judging you.",
          medium: "Tab hoarder level: Expert. Your RAM is filing a complaint.",
          high: "Tab hoarder level: Master. Your computer is considering early retirement.",
        },
        "distracted-browsing": {
          low: "Browser ADHD detected! Your tabs are doing the cha-cha.",
          medium: "You're switching sites faster than a squirrel in traffic!",
          high: "Your browsing pattern is more chaotic than a cat video compilation! 🌀",
        },
      },
      serious: {
        doomscrolling: {
          low: "Scrolling activity detected. Consider the impact on your focus.",
          medium: "Extended scrolling session. Evaluate your current priorities.",
          high: "Significant scrolling time accumulated. Consider breaking this pattern.",
        },
        "binge-watching": {
          low: "Extended video consumption detected. Monitor viewing habits.",
          medium: "Multiple consecutive videos. Consider time allocation.",
          high: "Extended viewing session. Evaluate content consumption patterns.",
        },
        "shopping-loops": {
          low: "Multiple shopping site visits recorded. Review purchasing decisions.",
          medium: "Shopping pattern identified. Consider financial implications.",
          high: "Frequent shopping activity. Evaluate consumption habits.",
        },
        "tab-hoarding": {
          low: "Multiple tabs accumulated. Consider workspace organization.",
          medium: "Tab collection growing. Review open tabs for necessity.",
          high: "Significant tab accumulation. Implement tab management strategy.",
        },
        "distracted-browsing": {
          low: "Frequent context switching detected. Consider focused work periods.",
          medium: "High distraction level. Implement focus techniques.",
          high: "Severe distraction patterns. Consider productivity interventions.",
        },
      },
      reflective: {
        doomscrolling: {
          low: "In this moment of scrolling, what are you seeking?",
          medium: "Your scrolling journey continues. What wisdom might a pause bring?",
          high: "Deep in the scroll... what might you discover by looking within instead?",
        },
        "binge-watching": {
          low: "As you watch, consider: is this nourishing your soul?",
          medium: "Multiple stories unfolding. What narrative are you creating for yourself?",
          high: "Extended viewing session. What might this time reveal about your relationship with content?",
        },
        "shopping-loops": {
          low: "Each click, a choice. What are you truly seeking to acquire?",
          medium: "Shopping journey continues. What satisfaction are you pursuing?",
          high: "Frequent visits to marketplaces. What deeper needs might this fulfill?",
        },
        "tab-hoarding": {
          low: "Tabs like thoughts, accumulating. What deserves your attention now?",
          medium: "Digital workspace expands. What truly matters in this moment?",
          high: "Many paths open before you. Which one calls to your heart?",
        },
        "distracted-browsing": {
          low: "Mind dances between worlds. What might focused presence offer?",
          medium: "Attention fragments. What wholeness might concentration bring?",
          high: "Scattered journey through digital realms. What might mindful navigation reveal?",
        },
      },
    };

    return messages[tone as keyof typeof messages]?.[category as keyof typeof messages.calm]?.[severity as keyof typeof messages.calm.doomscrolling] || `Behavior pattern detected: ${category}`;
  }

  /**
   * Send a nudge based on context and settings
   */
  public async sendNudge(context: NudgeContext): Promise<void> {
    // Check if nudges are enabled and category is allowed
    if (!this.canSendNudge() || !this.isCategoryEnabled(context.category)) {
      return;
    }

    // Generate message based on tone
    const message = this.generateMessage(context);

    // Determine nudge type and timing
    const nudgeType = this.determineNudgeType(context);
    const delay = this.calculateDelay(context);

    // Schedule the nudge
    if (delay > 0) {
      this.scheduler.scheduleIntervention(`nudge-${context.category}-${Date.now()}`, delay);
      // Store nudge data for when alarm fires
      this.pendingNudges.set(`nudge-${context.category}-${Date.now()}`, {
        type: nudgeType,
        context,
        message,
      });
    } else {
      this.deliverNudge(nudgeType, context, message);
    }
  }

  /**
   * Determine the type of nudge to send
   */
  private determineNudgeType(context: NudgeContext): NudgeType {
    // High severity gets chrome notification
    if (context.severity === "high") {
      return "chrome-notification";
    }

    // Medium severity gets in-page alert
    if (context.severity === "medium") {
      return "in-page-alert";
    }

    // Low severity gets scheduled reminder
    return "scheduled-reminder";
  }

  /**
   * Calculate delay based on timing settings
   */
  private calculateDelay(context: NudgeContext): number {
    const { timing } = this.settings;

    switch (timing) {
      case "immediate":
        return 0;
      case "delayed":
        return context.severity === "high" ? 2000 : 5000; // 2s for high, 5s for others
      case "scheduled":
        return context.severity === "high" ? 10000 : 30000; // 10s for high, 30s for others
      default:
        return 5000;
    }
  }

  /**
   * Deliver the nudge using the appropriate method
   */
  private deliverNudge(type: NudgeType, context: NudgeContext, message: string): void {
    // Record the nudge
    this.nudgeHistory.push(Date.now());
    this.lastNudgeTime = Date.now();

    switch (type) {
      case "chrome-notification":
        this.sendChromeNotification(context, message);
        break;
      case "in-page-alert":
        this.sendInPageAlert(context, message);
        break;
      case "scheduled-reminder":
        this.sendScheduledReminder(context, message);
        break;
    }
  }

  /**
   * Send Chrome notification
   */
  private sendChromeNotification(context: NudgeContext, message: string): void {
    const title = this.getNotificationTitle(context.category, context.severity);

    // Rate limiting is already handled in canSendNudge()
    chrome.notifications.create(`nudge-${Date.now()}`, {
      type: "basic",
      iconUrl: chrome.runtime.getURL("icon-128.png"),
      title,
      message,
    });
  }

  /**
   * Send in-page alert to the active tab
   */
  private sendInPageAlert(context: NudgeContext, message: string): void {
    if (!context.tabId) return;

    const title = this.getNotificationTitle(context.category, context.severity);

    chrome.tabs.sendMessage(context.tabId, {
      type: 'BEHAVIOR_ALERT',
      category: context.category,
      severity: context.severity,
      title,
      message,
      url: context.url,
      timestamp: context.timestamp,
    }).catch(() => {
      // Fallback to Chrome notification if content script not ready
      this.sendChromeNotification(context, message);
    });
  }

  /**
   * Send scheduled reminder (could be a different type of notification)
   */
  private sendScheduledReminder(context: NudgeContext, message: string): void {
    // For now, just send a Chrome notification with a gentler title
    const title = `Gentle reminder: ${context.category}`;

    chrome.notifications.create(`reminder-${Date.now()}`, {
      type: "basic",
      iconUrl: chrome.runtime.getURL("icon-128.png"),
      title,
      message,
    });
  }

  /**
   * Get appropriate notification title
   */
  private getNotificationTitle(category: string, severity: string): string {
    const titles = {
      doomscrolling: severity === "high" ? "Mindful Scrolling" : "Scroll Awareness",
      "binge-watching": severity === "high" ? "Viewing Break" : "Content Reminder",
      "shopping-loops": severity === "high" ? "Shopping Pause" : "Purchase Reflection",
      "tab-hoarding": severity === "high" ? "Tab Management" : "Workspace Organization",
      "distracted-browsing": severity === "high" ? "Focus Support" : "Attention Guide",
    };

    return titles[category as keyof typeof titles] || "Behavior Insight";
  }

  /**
   * Update nudge settings
   */
  public updateSettings(newSettings: Partial<NudgeSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Get current nudge settings
   */
  public getSettings(): NudgeSettings {
    return { ...this.settings };
  }

  /**
   * Setup alarm listener for scheduled nudges
   */
  private setupAlarmListener(): void {
    // We need to hook into the scheduler's alarm handling
    // This would typically be done by modifying the InterventionScheduler to accept a callback
    // For now, we'll assume the main background script will call handleAlarm when nudges fire
  }

  /**
   * Handle alarm firing for scheduled nudges
   */
  public handleAlarm(alarmName: string): void {
    const nudgeData = this.pendingNudges.get(alarmName);
    if (nudgeData) {
      this.deliverNudge(nudgeData.type, nudgeData.context, nudgeData.message);
      this.pendingNudges.delete(alarmName);
    }
  }
}