import { createRoot } from 'react-dom/client';
import BehaviorNudge from './components/BehaviorNudge';

interface NudgeMessage {
  type: 'BEHAVIOR_ALERT';
  category: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  url: string;
  timestamp: number;
}

let currentNudgeContainer: HTMLElement | null = null;
let currentNudgeRoot: ReturnType<typeof createRoot> | null = null;

/**
 * Display a behavior nudge on the page
 */
export function showNudge(nudgeData: NudgeMessage) {
  // Remove existing nudge if present
  if (currentNudgeContainer) {
    dismissNudge();
  }

  // Create container
  currentNudgeContainer = document.createElement('div');
  currentNudgeContainer.id = 'kaizen-nudge-root';
  currentNudgeContainer.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    z-index: 999999;
    pointer-events: none;
  `;

  // Make sure we don't interfere with page styles
  const shadow = currentNudgeContainer.attachShadow({ mode: 'open' });
  
  // Create a style element for Tailwind
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shrink {
      from { width: 100%; }
      to { width: 0%; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
  `;
  shadow.appendChild(style);

  // Create mount point inside shadow DOM
  const mountPoint = document.createElement('div');
  mountPoint.style.pointerEvents = 'auto';
  shadow.appendChild(mountPoint);

  document.body.appendChild(currentNudgeContainer);

  // Render React component
  currentNudgeRoot = createRoot(mountPoint);
  currentNudgeRoot.render(
    <BehaviorNudge
      category={nudgeData.category}
      severity={nudgeData.severity}
      title={nudgeData.title}
      message={nudgeData.message}
      timestamp={nudgeData.timestamp}
      onDismiss={dismissNudge}
    />
  );

  console.log('[Kaizen] Nudge displayed:', nudgeData.category);
}

/**
 * Dismiss current nudge
 */
export function dismissNudge() {
  if (currentNudgeRoot) {
    currentNudgeRoot.unmount();
    currentNudgeRoot = null;
  }
  if (currentNudgeContainer) {
    currentNudgeContainer.remove();
    currentNudgeContainer = null;
  }
}

/**
 * Setup message listener for behavior alerts
 */
export function setupNudgeListener() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'BEHAVIOR_ALERT') {
      showNudge(message as NudgeMessage);
      sendResponse({ success: true });
    }
    return false;
  });

  console.log('[Kaizen] Nudge listener initialized');
}

// Auto-initialize
if (typeof window !== 'undefined') {
  setupNudgeListener();
}
