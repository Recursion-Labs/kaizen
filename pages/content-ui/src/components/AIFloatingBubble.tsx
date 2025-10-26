/**
 * Side Panel Launcher
 *
 * Legacy export name retained for compatibility with existing imports.
 * Renders a compact half-circle trigger anchored to the bottom-right of the page.
 */

import inlineCss from "../../dist/all/index.css?inline";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

type LauncherState = "idle" | "opening" | "error";

const AIFloatingBubble = () => {
  const [state, setState] = useState<LauncherState>("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 200);
    return () => window.clearTimeout(timer);
  }, []);

  const resetStateLater = () => {
    window.setTimeout(() => setState("idle"), 2400);
  };

  const requestOpen = async () => {
    if (state === "opening") {
      return;
    }

    if (typeof chrome === "undefined" || !chrome.runtime?.id) {
      setState("error");
      resetStateLater();
      return;
    }

    setState("opening");

    const sendMessage = () =>
      new Promise<void>((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "OPEN_SIDE_PANEL" }, (response) => {
          const runtimeError = chrome.runtime.lastError;

          if (runtimeError) {
            reject(new Error(runtimeError.message));
            return;
          }

          if (response && response.success === false) {
            reject(new Error(response.error ?? "Failed to open side panel"));
            return;
          }

          resolve();
        });
      });

    try {
      await sendMessage();
      setState("idle");
    } catch (error) {
      console.error("[Kaizen] Failed to open side panel from launcher:", error);
      setState("error");
      resetStateLater();
    }
  };

  const label =
    state === "opening"
      ? "Opening..."
      : state === "error"
        ? "Try again"
        : "Open Kaizen";

  return (
    <div
      className={`fixed bottom-4 right-0 z-[99999] pointer-events-none select-none transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
    >
      <div className="pointer-events-auto">
        <button
          type="button"
          onClick={requestOpen}
          aria-label="Open Kaizen side panel"
          title="Open Kaizen side panel"
          className={`group relative flex h-12 w-20 items-center justify-end overflow-visible rounded-l-full rounded-r-none border border-white/20 bg-gradient-to-br text-white shadow-[0_12px_26px_rgba(99,102,241,0.28)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
            state === "error"
              ? "from-rose-500 via-amber-500 to-orange-500 hover:from-rose-500 hover:via-amber-500 hover:to-orange-500"
              : "from-indigo-500 via-purple-500 to-blue-500 hover:from-indigo-400 hover:via-purple-400 hover:to-blue-400"
          }`}
        >
          <span
            className={`absolute left-[-2.35rem] flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl leading-none shadow-[0_12px_22px_rgba(79,70,229,0.28)] transition-transform duration-300 group-hover:scale-105 ${
              state === "error" ? "text-amber-600" : "text-indigo-600"
            }`}
          >
            {state === "error" ? "⚠️" : "🧠"}
          </span>

          <span
            className={`mr-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 transition-opacity duration-200 ${
              state === "idle" ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            }`}
          >
            {label}
          </span>
        </button>
      </div>
    </div>
  );
};

export const showAIFloatingBubble = () => {
  const existingLauncher = document.querySelector(
    "#kaizen-sidepanel-launcher-root",
  );

  if (existingLauncher) {
    return;
  }

  // Remove legacy bubble container if present from previous builds.
  document.querySelector("#kaizen-ai-bubble-root")?.remove();

  const container = document.createElement("div");
  container.id = "kaizen-sidepanel-launcher-root";
  document.body.appendChild(container);

  const shadow = container.attachShadow({ mode: "open" });
  const shadowRoot = document.createElement("div");
  shadow.appendChild(shadowRoot);

  const style = document.createElement("style");
  style.textContent =
    inlineCss +
    `
    :host, :root {
      color-scheme: light dark;
    }
  `;
  shadow.appendChild(style);

  const root = createRoot(shadowRoot);
  root.render(<AIFloatingBubble />);
};

export default AIFloatingBubble;
