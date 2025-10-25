// Chrome notification manager for sending user alerts.

import type { Nudge } from "./NudgeGenerator";

export class NotificationManager {
  /**
   * Show a nudge via Chrome notification API or fallback to in-page alert.
   */
  async showNudge(nudge: Nudge) {
    if (typeof chrome !== "undefined" && chrome.notifications) {
      try {
        const icon = chrome.runtime?.getURL?.("icon-128.png") ?? "icon-128.png";
        chrome.notifications.create(undefined, {
          type: "basic",
          iconUrl: icon,
          title: nudge.title,
          message: nudge.message,
          priority: 2,
        });
        return;
      } catch (error) {
        console.warn(
          "[NotificationManager] Chrome notification failed:",
          error,
        );
      }
    }

    // Web fallback (if not running in extension context)
    if (window.Notification && Notification.permission === "granted") {
      new Notification(nudge.title, { body: nudge.message });
    } else if (window.Notification && Notification.permission !== "denied") {
      await Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          new Notification(nudge.title, { body: nudge.message });
        }
      });
    } else {
      // Final fallback
      alert(`${nudge.title}\n\n${nudge.message}`);
    }
  }

  /**
   * Optionally clear previous notifications
   */
  clearAll() {
    if (typeof chrome !== "undefined" && chrome.notifications) {
      chrome.notifications.getAll((notifications) => {
        for (const id in notifications) {
          chrome.notifications.clear(id);
        }
      });
    }
  }
}
