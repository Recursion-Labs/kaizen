/**
 * Scroll Tracker Content Script
 * Monitors user scrolling and sends events to background script
 */

let lastScrollTop = 0;
let scrollTimeout: NodeJS.Timeout | null = null;
let accumulatedScroll = 0;

// Throttle scroll events to avoid overwhelming the background script
const SCROLL_THROTTLE_MS = 500;

console.log('[Kaizen] Scroll tracker initialized on:', window.location.href);

/**
 * Handle scroll events
 */
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollAmount = Math.abs(scrollTop - lastScrollTop);
  
  // Accumulate scroll amount
  accumulatedScroll += scrollAmount;
  lastScrollTop = scrollTop;

  // Clear existing timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  // Send accumulated scroll after throttle period
  scrollTimeout = setTimeout(() => {
    if (accumulatedScroll > 0) {
      // Send message to background script
      chrome.runtime.sendMessage({
        type: 'SCROLL_EVENT',
        scrollAmount: accumulatedScroll,
        url: window.location.href,
        timestamp: Date.now()
      }).catch((error) => {
        console.error('[Kaizen] Failed to send scroll event:', error);
      });

      console.log(`[Kaizen] Scroll event sent: ${accumulatedScroll}px on ${window.location.hostname}`);
      
      // Reset accumulator
      accumulatedScroll = 0;
    }
  }, SCROLL_THROTTLE_MS);
};

// Add scroll listener
window.addEventListener('scroll', handleScroll, { passive: true });

// Send initial page load event
chrome.runtime.sendMessage({
  type: 'PAGE_LOAD',
  url: window.location.href,
  timestamp: Date.now()
}).catch((error) => {
  console.error('[Kaizen] Failed to send page load event:', error);
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
});
