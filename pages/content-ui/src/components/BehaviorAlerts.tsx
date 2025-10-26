import inlineCss from "../../dist/all/index.css?inline";
import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";


type Toast = BehaviorAlertPayload & { id: string };

type DismissState = {
  doomscrolling: Map<string, number>; // host -> last dismissed milestone
};

const SeverityStyles: Record<Toast["severity"], { bg: string; border: string; text: string; accent: string }> = {
  low: {
    bg: "bg-white dark:bg-gray-800",
    border: "border border-emerald-200 dark:border-emerald-900/40",
    text: "text-gray-900 dark:text-gray-100",
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  medium: {
    bg: "bg-white dark:bg-gray-800",
    border: "border border-amber-200 dark:border-amber-900/40",
    text: "text-gray-900 dark:text-gray-100",
    accent: "text-amber-600 dark:text-amber-400",
  },
  high: {
    bg: "bg-white dark:bg-gray-800",
    border: "border border-rose-300 dark:border-rose-900/50",
    text: "text-gray-900 dark:text-gray-100",
    accent: "text-rose-600 dark:text-rose-400",
  },
};

const CategoryIcon = ({ category }: { category: string }) => {
  const icon = useMemo(() => {
    switch (category) {
      case "shopping":
        return "🛒";
      case "doomscrolling":
        return "🌀";
      case "time":
        return "⏳";
      default:
        return "🔔";
    }
  }, [category]);
  return <span className="text-xl" aria-hidden>{icon}</span>;
};

const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) => {
  const styles = SeverityStyles[toast.severity];
  return (
    <div
      className={`relative w-[360px] ${styles.bg} ${styles.border} rounded-xl shadow-2xl p-4 mb-3 animate-in`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-700 flex items-center justify-center ${styles.accent}`}>
          <CategoryIcon category={toast.category} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`font-semibold ${styles.text} truncate`}>{toast.title}</h4>
            <button
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              aria-label="Dismiss notification"
              onClick={() => onClose(toast.id)}
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 leading-snug">
            {toast.message}
          </p>
          {toast.url && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
              {new URL(toast.url).hostname}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const BehaviorAlerts = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, number>>(new Map());
  const dismissState = useRef<DismissState>({ doomscrolling: new Map() });
  
  useEffect(() => {
    const lastShown = new Map<string, number>(); // key by category
    const DEFAULT_COOLDOWN_MS = 90 * 1000; // 90s per category

    const handler = (message: any) => {
      if (message && message.type === "BEHAVIOR_ALERT") {
        const payload = message as BehaviorAlertPayload;
        const key = `${payload.category}`;
        const now = Date.now();

        // Doomscrolling: sticky and update-in-place, no cooldown between milestones
        if (payload.category === 'doomscrolling') {
          const host = (() => { try { return new URL(payload.url || location.href).hostname; } catch { return 'unknown'; } })();
          const lastDismissedMilestone = dismissState.current.doomscrolling.get(host) ?? -1;
          const milestone = typeof (payload as any).milestone === 'number' ? (payload as any).milestone : 0;
          if (lastDismissedMilestone >= milestone) return; // user dismissed this or a newer milestone already

          setToasts((prev) => {
            const existing = prev.find((t) => t.category === 'doomscrolling');
            if (existing) {
              return prev.map((t) => t.id === existing.id ? { ...existing, ...payload, id: existing.id } : t);
            }
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            return [...prev, { id, ...payload }];
          });
          return; // stickies have no auto-dismiss
        }

        // Other categories: apply cooldown
        const nextAllowed = lastShown.get(key) || 0;
        if (now < nextAllowed) return; // skip duplicate toasts
        lastShown.set(key, now + DEFAULT_COOLDOWN_MS);

        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const toast: Toast = { id, ...payload };
        // Keep at most 2 to avoid flooding
        setToasts((prev) => [...prev, toast].slice(-2));

        // Auto-dismiss after 6s (longer for high severity), except doomscrolling handled above
        const timeout = window.setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
          timers.current.delete(id);
        }, payload.severity === "high" ? 8000 : 6000);
        timers.current.set(id, timeout as unknown as number);
      }
    };

    // Listen for messages from background scripts
    chrome.runtime.onMessage.addListener(handler);
    return () => {
      chrome.runtime.onMessage.removeListener(handler);
      // clear pending timers
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current.clear();
      lastShown.clear();
    };
  }, []);

  const closeToast = (id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      // Record doomscrolling dismissal milestone per host
      if (toast?.category === 'doomscrolling') {
        const host = (() => { try { return new URL(toast.url || location.href).hostname; } catch { return 'unknown'; } })();
        const milestone = typeof (toast as any).milestone === 'number' ? (toast as any).milestone : 0;
        const prevMilestone = dismissState.current.doomscrolling.get(host) ?? -1;
        if (milestone > prevMilestone) dismissState.current.doomscrolling.set(host, milestone);
      }
      return prev.filter((t) => t.id !== id);
    });
    const t = timers.current.get(id);
    if (t) {
      window.clearTimeout(t);
      timers.current.delete(id);
    }
  };
  
  return (
    <div className="fixed left-4 bottom-4 z-[100000] flex flex-col-reverse items-start pointer-events-none" style={{ isolation: "isolate" }}>
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={closeToast} />
        </div>
      ))}
    </div>
  );
};

export const initBehaviorAlerts = () => {
  // Prevent duplicates
  if (document.querySelector("#kaizen-behavior-alerts-root")) return;

  const container = document.createElement("div");
  container.id = "kaizen-behavior-alerts-root";
  document.body.appendChild(container);

  const shadow = container.attachShadow({ mode: "open" });
  const shadowRoot = document.createElement("div");
  shadow.appendChild(shadowRoot);

  // Tailwind CSS
  const style = document.createElement("style");
  style.textContent = inlineCss + `
    @keyframes slide-in-from-bottom-2 {
      from { opacity: 0; transform: translateY(0.5rem); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-in { animation: slide-in-from-bottom-2 0.25s ease-out; }
  `;
  shadow.appendChild(style);

  const root = createRoot(shadowRoot);
  root.render(<BehaviorAlerts />);
};

export type BehaviorAlertPayload = {
  type: "BEHAVIOR_ALERT";
  category: "shopping" | "doomscrolling" | "time" | string;
  severity: "low" | "medium" | "high";
  title: string;
  message: string;
  url?: string;
  timestamp?: number;
};