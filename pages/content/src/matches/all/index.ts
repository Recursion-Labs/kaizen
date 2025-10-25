import { sampleFunction } from "@src/sample-function";

console.log("[CEB] All content script loaded");

void sampleFunction();

// Track scroll events for doomscrolling detection
let lastScrollTop = 0;
let scrollTimer: ReturnType<typeof setTimeout> | null = null;
let accumulatedScroll = 0;

// Throttle to avoid overwhelming background script
const SCROLL_THROTTLE_MS = 400;

console.log('[Kaizen] Behavioral monitoring initialized on:', window.location.href);

window.addEventListener('scroll', () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollAmount = Math.abs(currentScrollTop - lastScrollTop);
  
  // Accumulate scroll amount
  accumulatedScroll += scrollAmount;
  lastScrollTop = currentScrollTop;
  
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }
  
  // Send accumulated scroll after throttle period
  scrollTimer = setTimeout(() => {
    if (accumulatedScroll > 0) {
      chrome.runtime.sendMessage({
        type: 'SCROLL_EVENT',
        scrollAmount: accumulatedScroll,
        url: window.location.href,
        timestamp: Date.now()
      }).catch(err => console.log('[Kaizen] Scroll event not sent:', err));
      
      console.log(`[Kaizen] Scroll event: ${accumulatedScroll}px on ${window.location.hostname}`);
      accumulatedScroll = 0;
    }
  }, SCROLL_THROTTLE_MS);
}, { passive: true });

// Send initial page load event
chrome.runtime.sendMessage({
  type: 'PAGE_LOAD',
  url: window.location.href,
  timestamp: Date.now()
}).catch(err => console.log('[Kaizen] Page load event not sent:', err));

console.log('[Kaizen] Scroll tracker active and monitoring');
