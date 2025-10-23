import { sampleFunction } from "@src/sample-function";

console.log("[CEB] All content script loaded");

void sampleFunction();

// Track scroll events for doomscrolling detection
let lastScrollTop = 0;
let scrollTimer: NodeJS.Timeout | null = null;

window.addEventListener('scroll', () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollAmount = Math.abs(currentScrollTop - lastScrollTop);
  
  if (scrollAmount > 0) {
    // Debounce scroll events - send every 100ms
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }
    
    scrollTimer = setTimeout(() => {
      // Send scroll event to background script
      chrome.runtime.sendMessage({
        type: 'SCROLL_EVENT',
        scrollAmount: scrollAmount,
        url: window.location.href,
      }).catch(err => console.log('Scroll event not sent:', err));
    }, 100);
  }
  
  lastScrollTop = currentScrollTop;
});

console.log('[Kaizen] Scroll tracking initialized');
