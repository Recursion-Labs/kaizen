# 🎯 Quick Start: Implementing Chrome AI APIs

## Immediate Setup (Next 30 Minutes)

### Step 1: Enable Chrome AI Features

1. **Install Chrome Canary** (if not already installed)
   - Download from: https://www.google.com/chrome/canary/
   
2. **Enable AI Flags:**
   ```
   Navigate to: chrome://flags
   
   Enable these flags:
   ✅ Prompt API for Gemini Nano
   ✅ Summarization API for Gemini Nano  
   ✅ Rewriter API
   ✅ Translation API
   ✅ Writer API
   ✅ Proofreader API
   ✅ Optimization Guide On Device Model
   
   Then: Relaunch Chrome Canary
   ```

3. **Verify API Availability:**
   ```javascript
   // Open DevTools Console (F12)
   // Run:
   await window.ai?.languageModel?.capabilities()
   
   // Should return: { available: "readily", defaultTemperature: 0.8, ... }
   ```

### Step 2: Download Gemini Nano Model

```javascript
// In Chrome DevTools Console:
const session = await window.ai.languageModel.create();
// This will trigger model download (~1.5GB)
// Progress shown in chrome://components
```

### Step 3: Test First API Call

```javascript
// Test Prompt API:
const session = await window.ai.languageModel.create();
const response = await session.prompt("Hello, are you working?");
console.log(response);

// Test streaming:
const stream = await session.promptStreaming("Tell me about Chrome");
for await (const chunk of stream) {
  console.log(chunk);
}
```

---

## Development Checklist

### Phase 1: Foundation (Days 1-3)

#### Day 1: Core Services
- [ ] Create `packages/shared/lib/ai/` directory
- [ ] Add `AIManager.ts` - Main AI orchestration service
- [ ] Add `capabilities.ts` - Check API availability
- [ ] Add `types.ts` - TypeScript definitions
- [ ] Add `AIContext.tsx` - React context provider

**Files to Create:**

```typescript
// packages/shared/lib/ai/AIManager.ts
export class AIManager {
  private static instance: AIManager;
  private sessions: Map<string, any> = new Map();
  
  static getInstance(): AIManager {
    if (!AIManager.instance) {
      AIManager.instance = new AIManager();
    }
    return AIManager.instance;
  }
  
  async checkCapabilities() {
    return {
      promptAPI: await window.ai?.languageModel?.capabilities(),
      summarizer: await window.ai?.summarizer?.capabilities(),
      rewriter: await window.ai?.rewriter?.capabilities(),
      translator: await window.ai?.translator?.capabilities(),
      writer: await window.ai?.writer?.capabilities(),
      proofreader: await window.ai?.proofreader?.capabilities(),
    };
  }
  
  async createPromptSession(options?: any) {
    const session = await window.ai.languageModel.create(options);
    const id = Math.random().toString(36);
    this.sessions.set(id, session);
    return { id, session };
  }
}
```

```typescript
// packages/shared/lib/ai/types.ts
export interface AICapabilities {
  available: 'readily' | 'after-download' | 'no';
  defaultTemperature?: number;
  defaultTopK?: number;
  maxTopK?: number;
}

export interface AIModelCreateOptions {
  systemPrompt?: string;
  temperature?: number;
  topK?: number;
}

export interface AIMessageOptions {
  context?: string;
  image?: string; // base64
}
```

#### Day 2: Chat Integration
- [ ] Update `ChatInterface.tsx` to use AIManager
- [ ] Add streaming response UI
- [ ] Implement message history
- [ ] Add multimodal support (image upload)

#### Day 3: Summarization Features
- [ ] Create `TabSummarizerService.ts`
- [ ] Add context menu for summarization
- [ ] Build summary display UI
- [ ] Test with various content types

### Phase 2: Advanced Features (Days 4-10)

#### Days 4-5: Knowledge Graph
- [ ] Implement entity extraction with Prompt API
- [ ] Build graph data structure
- [ ] Create interactive visualization
- [ ] Add RAG-based Q&A

#### Days 6-7: Content Enhancement
- [ ] Form auto-filler service
- [ ] Text rewriter integration
- [ ] Grammar proofreader
- [ ] Tone adjustment feature

#### Days 8-9: Privacy & Wellness
- [ ] Privacy policy analyzer
- [ ] Cookie banner explainer
- [ ] Doomscrolling detector
- [ ] Session summary generator

#### Day 10: Testing & Polish
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] UI polish

---

## API Usage Examples

### 1. Chat with Context

```typescript
const aiManager = AIManager.getInstance();
const { session } = await aiManager.createPromptSession({
  systemPrompt: 'You are Kaizen, a helpful browsing assistant.',
  temperature: 0.8,
});

// Get current tab context
const [tab] = await chrome.tabs.query({ active: true });
const context = `Current page: ${tab.title}\nURL: ${tab.url}`;

// Send message with context
const response = await session.prompt(`
  Context: ${context}
  
  User question: ${userMessage}
`);
```

### 2. Summarize Tab

```typescript
// Get tab content
const [tab] = await chrome.tabs.query({ active: true });
const [{ result }] = await chrome.scripting.executeScript({
  target: { tabId: tab.id },
  func: () => document.body.innerText,
});

// Summarize
const summarizer = await window.ai.summarizer.create({
  type: 'key-points',
  format: 'markdown',
  length: 'medium',
});

const summary = await summarizer.summarize(result);
console.log(summary);
```

### 3. Rewrite Text

```typescript
const rewriter = await window.ai.rewriter.create({
  tone: 'more-formal',
  length: 'as-is',
});

const rewritten = await rewriter.rewrite(selectedText);
```

### 4. Proofread

```typescript
const proofreader = await window.ai.proofreader.create();
const corrections = await proofreader.proofread(text);

corrections.forEach(correction => {
  console.log(`Issue: ${correction.original}`);
  console.log(`Suggestion: ${correction.suggestion}`);
  console.log(`Type: ${correction.type}`);
});
```

### 5. Translate

```typescript
const translator = await window.ai.translator.create({
  sourceLanguage: 'en',
  targetLanguage: 'es',
});

const translated = await translator.translate(text);
```

---

## Testing Checklist

### API Availability Tests
- [ ] All 7 APIs return "readily" status
- [ ] Gemini Nano model downloaded
- [ ] APIs work in extension context
- [ ] APIs work in content scripts

### Performance Tests
- [ ] Prompt API responds in < 2s
- [ ] Summarization completes in < 3s
- [ ] Memory usage < 200MB
- [ ] No memory leaks after 100 operations

### Functionality Tests
- [ ] Chat maintains conversation context
- [ ] Summaries are accurate and concise
- [ ] Rewriting preserves meaning
- [ ] Translations are accurate
- [ ] Proofreading catches errors
- [ ] Generated text is coherent

### User Experience Tests
- [ ] Loading states show clearly
- [ ] Errors handled gracefully
- [ ] Offline mode works
- [ ] UI remains responsive during AI operations

---

## Common Issues & Solutions

### Issue 1: APIs Not Available
**Error:** `window.ai is undefined`

**Solution:**
1. Check Chrome version (need Canary 121+)
2. Enable all AI flags in chrome://flags
3. Restart Chrome
4. Verify with: `console.log(window.ai)`

### Issue 2: Model Not Downloaded
**Error:** `capabilities().available === 'after-download'`

**Solution:**
1. Trigger download: `await window.ai.languageModel.create()`
2. Check progress: chrome://components
3. Wait for "Optimization Guide On Device Model" to update
4. May take 5-10 minutes

### Issue 3: Slow Performance
**Symptoms:** Responses take > 5 seconds

**Solutions:**
1. Reduce prompt length (max ~2048 tokens)
2. Lower temperature setting
3. Use streaming for long responses
4. Cache frequently used prompts

### Issue 4: Memory Leaks
**Symptoms:** Extension memory grows over time

**Solutions:**
1. Destroy sessions when done: `await session.destroy()`
2. Limit concurrent sessions (max 3-5)
3. Clear old message history
4. Monitor with Chrome Task Manager

---

## Performance Optimization Tips

### 1. Prompt Engineering
```typescript
// ❌ Bad - Too verbose
const prompt = "I need you to please help me summarize this very long article...";

// ✅ Good - Concise and clear
const prompt = "Summarize in 3 bullet points:\n" + content;
```

### 2. Streaming for UX
```typescript
// Show immediate feedback
const stream = await session.promptStreaming(prompt);
let fullResponse = '';

for await (const chunk of stream) {
  fullResponse += chunk;
  updateUI(fullResponse); // Update as we receive
}
```

### 3. Batch Operations
```typescript
// Process multiple tabs efficiently
const summaries = await Promise.all(
  tabs.map(tab => summarizeTab(tab.id))
);
```

### 4. Caching
```typescript
// Cache API sessions
private sessions = new Map<string, AISession>();

async getSession(key: string) {
  if (!this.sessions.has(key)) {
    this.sessions.set(key, await window.ai.languageModel.create());
  }
  return this.sessions.get(key);
}
```

---

## Deployment Checklist

### Before Submission
- [ ] All 7 APIs demonstrably used
- [ ] Privacy policy included
- [ ] User guide written
- [ ] Demo video recorded
- [ ] Performance benchmarks met
- [ ] Accessibility tested
- [ ] Error handling complete
- [ ] Code documented
- [ ] Extension tested in clean Chrome profile
- [ ] Manifest valid and complete

### Submission Materials
- [ ] Extension .zip file
- [ ] README with setup instructions
- [ ] Demo video (< 3 minutes)
- [ ] Architecture diagram
- [ ] API usage documentation
- [ ] Performance metrics
- [ ] Screenshots
- [ ] Hackathon submission form

---

## Resources

### Documentation
- [Chrome AI Built-in APIs](https://developer.chrome.com/docs/ai/built-in)
- [Prompt API Guide](https://developer.chrome.com/docs/ai/built-in#prompt_api)
- [Extension Development](https://developer.chrome.com/docs/extensions/)

### Community
- [Chrome AI Early Preview Program](https://docs.google.com/forms/d/e/1FAIpQLSfZXeiwj9KO9jMctffHPym88ln12xNWCrVkMY_u06WfSTulQg/viewform)
- [Stack Overflow - chrome-ai tag](https://stackoverflow.com/questions/tagged/chrome-ai)

### Tools
- Chrome Canary: https://www.google.com/chrome/canary/
- Chrome DevTools
- Extension Reloader: chrome://extensions

---

**Last Updated:** October 16, 2025  
**Status:** Ready to implement  
**Next Action:** Set up Chrome Canary and enable AI flags
