// Expose a safe page-level bridge: window.KAIZEN.getProductivityStats(), getRAGContext()
// Page -> content-script: window.postMessage({ source: 'KAIZEN_PAGE', id, cmd })
// Content-script -> background: chrome.runtime.sendMessage(...)
// Replies are posted back as { source: 'KAIZEN_CONTENT', id, ok, data, error }

const BRIDGE_SOURCE_PAGE = 'KAIZEN_PAGE';
const BRIDGE_SOURCE_CONTENT = 'KAIZEN_CONTENT';

// Install page-side API by injecting a <script> into the page world
function injectPageAPI() {
  const script = document.createElement('script');
  script.textContent = `(() => {
    const BRIDGE_SOURCE_PAGE = '${BRIDGE_SOURCE_PAGE}';
    const BRIDGE_SOURCE_CONTENT = '${BRIDGE_SOURCE_CONTENT}';
    const send = (cmd, payload) => new Promise((resolve, reject) => {
      const id = Date.now() + '-' + Math.random().toString(36).slice(2,8);
      const handler = (event) => {
        const msg = event.data;
        if (!msg || msg.source !== BRIDGE_SOURCE_CONTENT || msg.id !== id) return;
        window.removeEventListener('message', handler);
        if (msg.ok) resolve(msg.data); else reject(new Error(msg.error || 'Bridge error'));
      };
      window.addEventListener('message', handler);
      window.postMessage({ source: BRIDGE_SOURCE_PAGE, id, cmd, payload }, '*');
    });

    // Expose global helper
    window.KAIZEN = {
      getProductivityStats: () => send('GET_PRODUCTIVITY_STATS'),
      getRAGContext:       () => send('GET_RAG_CONTEXT'),
      getKnowledgeGraph:   () => send('GET_KNOWLEDGE_GRAPH'),
      getKnowledgeGraphStats: () => send('GET_KG_STATS'),
      getRecentInsights:   () => send('GET_RECENT_INSIGHTS'),
      getContextualRecommendations: (query) => send('GET_CONTEXTUAL_RECS', { query }),
    };
  })();`;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}

// Listen in content-script world and forward to background
function installContentListener() {
  window.addEventListener('message', (event) => {
    const msg = event.data as any;
    if (!msg || msg.source !== BRIDGE_SOURCE_PAGE || !msg.id || !msg.cmd) return;

    chrome.runtime.sendMessage({ type: msg.cmd, payload: msg.payload }, (resp) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        window.postMessage({ source: BRIDGE_SOURCE_CONTENT, id: msg.id, ok: false, error: lastError.message }, '*');
        return;
      }
      window.postMessage({ source: BRIDGE_SOURCE_CONTENT, id: msg.id, ok: true, data: resp }, '*');
    });
  });
}

export function initRuntimeBridge() {
  try {
    injectPageAPI();
    installContentListener();
  } catch (e) {
    console.warn('[Kaizen] Runtime bridge failed to init:', e);
  }
}