# 🚀 Chrome AI APIs Setup Guide
## Enable Gemini Nano for Kaizen Extension

**Last Updated:** May 2025  
**Based on:** Chrome 138+ stable release  
**Purpose:** Complete guide to enable Chrome Built-in AI APIs  
**Time Required:** 20-30 minutes (including model download)

**Official Documentation:**
- [Chrome AI Get Started Guide](https://developer.chrome.com/docs/ai/get-started)
- [Chrome Built-in APIs Reference](https://developer.chrome.com/docs/ai/built-in-apis)

---

## ⚡ Quick Start (TL;DR)

**Just want to download the model ASAP?** Follow these 5 steps:

1. **Install Chrome Canary 138+** → [Download here](https://www.google.com/chrome/canary/)

2. **Enable these 2 flags:**
   - `chrome://flags/#optimization-guide-on-device-model` → **Enabled BypassPerfRequirement**
   - `chrome://flags/#prompt-api-for-gemini-nano` → **Enabled**

3. **Relaunch Chrome** (click blue "Relaunch" button at bottom of flags page)

4. **Download the model** - Copy-paste this in DevTools Console (F12):
   ```javascript
   document.body.addEventListener('click', async () => {
     console.log('🚀 Downloading Gemini Nano model...');
     const session = await LanguageModel.create();
     console.log('✅ Download started! Monitor: chrome://on-device-internals');
   }, { once: true });
   console.log('👆 Click anywhere on this page!');
   ```
   Then click anywhere on the page.

5. **Wait 5-15 minutes** - Monitor at: `chrome://on-device-internals`

6. **Verify it works:**
   ```javascript
   await LanguageModel.availability()  // Should return: "available"
   ```

**Done!** 🎉 Now read the full guide below for details.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step-by-Step Setup](#step-by-step-setup)
3. [Verification Steps](#verification-steps)
4. [Testing the Extension](#testing-the-extension)
5. [Troubleshooting](#troubleshooting)
6. [Quick Reference](#quick-reference)

---

## 🎯 Prerequisites

### What You Need

- **Chrome Canary 138+** (NOT regular Chrome)
- **At least 22 GB free disk space** (for Gemini Nano model and Chrome profile)
- **Unmetered internet connection** (for model download - Wi-Fi or Ethernet recommended)
- **Hardware:** Either GPU (>4GB VRAM) OR CPU (16GB RAM + 4 cores)
- **20-30 minutes** (mostly waiting for download)

### Why Chrome Canary?

Chrome's Built-in AI APIs are **experimental features** only available in Chrome Canary. Regular Chrome does not support these APIs yet (as of October 2025).

---

## 🔧 Step-by-Step Setup

### Step 1: Install Chrome Canary

#### **Download Chrome Canary:**
```
https://www.google.com/chrome/canary/
```

#### **Verify Installation:**
1. Open Chrome Canary
2. Go to: `chrome://version`
3. Check version is **138.0.xxxx.x** or higher

**Example output:**
```
Google Chrome: 138.0.6820.33 (Official Build) canary (64-bit)
```

✅ If version is 138+, proceed to Step 2  
❌ If version is lower, update Chrome Canary: `chrome://settings/help`

#### **System Requirements:**

| Requirement | Specification |
|-------------|---------------|
| **OS** | Windows 10+, macOS 13+ (Ventura), Linux, ChromeOS (Chromebook Plus) |
| **Storage** | 22 GB free space minimum |
| **GPU** | >4GB VRAM (recommended) |
| **CPU** | 16GB RAM + 4 CPU cores (if no GPU) |
| **Network** | Unmetered connection (Wi-Fi/Ethernet) |

⚠️ **Not Supported:** Android, iOS, regular ChromeOS devices

---

### Step 2: Enable Required Flags

Chrome AI APIs are behind feature flags. You need to enable them manually.

#### **🔴 CRITICAL FLAGS (Must Enable)**

**1. Optimization Guide On-Device Model**
```
chrome://flags/#optimization-guide-on-device-model
```
- Set to: `Enabled BypassPerfRequirement`
- **Why:** Downloads and enables Gemini Nano model

**2. Prompt API for Gemini Nano**
```
chrome://flags/#prompt-api-for-gemini-nano
```
- Set to: `Enabled`
- **Why:** Enables LanguageModel API (core Prompt API, replaces deprecated window.ai)

**3. Prompt API for Gemini Nano (Multimodal Input)**
```
chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
```
- Set to: `Enabled` (if testing on localhost)
- **Why:** Enables Prompt API on localhost:* origins

---

#### **🟡 OPTIONAL FLAGS (Recommended)**

**4. Summarization API**
```
chrome://flags/#summarization-api-for-gemini-nano
```
- Set to: `Enabled`
- **Why:** Enables AISummarizer API (Stable in Chrome 138)

**5. Translation API**
```
chrome://flags/#translation-api
```
- Set to: `Enabled`
- **Why:** Enables AITranslator API (Stable in Chrome 138)

**6. Language Detection API**
```
chrome://flags/#language-detection-api
```
- Set to: `Enabled`
- **Why:** Enables AILanguageDetector API (Stable in Chrome 138)

**7. Writer API**
```
chrome://flags/#writer-api-for-gemini-nano
```
- Set to: `Enabled`
- **Why:** Enables AIWriter API (Origin Trial only)

**8. Rewriter API**
```
chrome://flags/#rewriter-api-for-gemini-nano
```
- Set to: `Enabled`
- **Why:** Enables AIRewriter API (Origin Trial only)

---

#### **📋 API Availability Status (Chrome 138)**

| API | Chrome Extensions | Web Pages | Languages |
|-----|-------------------|-----------|-----------|
| **Prompt API** | ✅ Stable | 🧪 Origin Trial | English |
| **Summarizer** | ✅ Stable | ✅ Stable | English |
| **Translator** | ✅ Stable | ✅ Stable | English, Spanish, Japanese (140+) |
| **Language Detector** | ✅ Stable | ✅ Stable | English, Spanish, Japanese (140+) |
| **Writer** | 🧪 Origin Trial | 🧪 Origin Trial | English |
| **Rewriter** | 🧪 Origin Trial | 🧪 Origin Trial | English |

✅ **Stable** = Available in Chrome 138+ with flags enabled  
🧪 **Origin Trial** = Requires Origin Trial token for web pages

---

### Step 3: Relaunch Browser

⚠️ **CRITICAL:** Flags only take effect after relaunching!

1. After enabling all flags, look for the **blue "Relaunch"** button at the bottom of the page
2. Click **"Relaunch"**
3. Wait for Chrome Canary to fully restart

**Don't skip this step!** If you don't relaunch, the AI APIs (`LanguageModel`, etc.) will be `undefined`.

---

### Step 4: Verify Chrome AI APIs are Available

After relaunch, open **DevTools Console** (F12):

```javascript
// Check if LanguageModel API is available (Chrome 138+)
typeof LanguageModel !== 'undefined'
```

#### **✅ Expected Output (Success):**
```javascript
true
```

You can also check individual APIs:
```javascript
typeof LanguageModel    // → "function"
typeof AISummarizer     // → "function" or "undefined"
typeof AIWriter         // → "function" or "undefined"
typeof AIRewriter       // → "function" or "undefined"
```

⚠️ **Note:** `window.ai` is **DEPRECATED** in Chrome 138+. Use the new global constructors instead:
- ✅ `LanguageModel` (new API)
- ❌ `window.ai.languageModel` (deprecated, will be removed)

#### **❌ If LanguageModel is `undefined`:**

**Troubleshooting:**
- Check you're using Chrome Canary (not regular Chrome)
- Verify flags are enabled (revisit Step 2)
- Make sure you clicked "Relaunch" (Step 3)
- Try closing Chrome completely and reopening

---

### Step 5: Check Model Availability

Check if Gemini Nano model is ready using the **new LanguageModel API** (Chrome 138+):

```javascript
await LanguageModel.availability()
```

#### **Possible Outputs:**

**A) ✅ Model Ready (Best case):**
```javascript
"available"
```
✅ **Model downloaded and ready to use!** Skip to Step 7.

**B) 📥 Model Downloadable (User activation required):**
```javascript
"downloadable"
```
⚠️ **Model not downloaded yet.** You need to trigger download with user activation (click/tap). Continue to Step 6.

**C) ⏬ Download In Progress:**
```javascript
"downloading"
```
⏳ **Model is currently downloading.** Wait for it to finish, then check availability again.

**D) ❌ Not Available:**
```javascript
"unavailable"
```
❌ **Problem with setup.** Check:
- Chrome version is 138+ (Step 1)
- Required flags are enabled (Step 2)
- Browser was relaunched (Step 3)
- System meets hardware requirements (22GB space, GPU/RAM)

See [Troubleshooting](#troubleshooting) for detailed help.

---

#### **Understanding Availability States:**

| State | Meaning | Next Action |
|-------|---------|-------------|
| `"available"` | ✅ Model ready, no download needed | Use the API immediately |
| `"downloadable"` | 📥 Model not present, can download | Trigger download with user activation (Step 6) |
| `"downloading"` | ⏬ Model download in progress | Wait for completion (5-15 minutes) |
| `"unavailable"` | ❌ API not ready or hardware issue | Check setup prerequisites and flags |

---

### Step 6: Download Gemini Nano Model

If availability shows `"downloadable"`, you need to download the AI model with **user activation**.

#### **📦 What is the Model Download?**

The Gemini Nano model is a **~1.5GB AI model binary** that must be downloaded to your computer before you can use Chrome's AI features. Think of it like downloading a game or app - it's a one-time download that gets stored in Chrome's internal folder.

**Key Facts:**
- **Size:** ~1.5GB (compressed binary)
- **Storage Location:** Chrome profile folder (managed by Chrome, not user-accessible)
- **Required Space:** 22GB free space (for download + installation + temporary files)
- **Network:** Must use unmetered connection (Wi-Fi/Ethernet recommended, not mobile data)
- **Time:** 5-15 minutes depending on internet speed
- **Frequency:** One-time download per Chrome profile

#### **Understanding User Activation:**

Chrome requires a **user interaction (click, tap, keypress)** to trigger the model download for privacy/security. You cannot download the model programmatically without user action.

**Why?** To prevent:
- Unauthorized downloads consuming user bandwidth
- Background downloads on metered connections
- Surprise storage consumption
- Privacy violations

**Check if user activation is active:**
```javascript
navigator.userActivation.isActive
// true = can download now
// false = need user interaction first
```

#### **Trigger Download (Method 1: Button Click):**

Create an HTML button and add this event handler:
```html
<button id="downloadBtn">Download AI Model</button>
<script>
document.getElementById('downloadBtn').addEventListener('click', async () => {
  console.log('User activated:', navigator.userActivation.isActive); // Should be true
  
  // Use new LanguageModel API (Chrome 138+)
  const session = await LanguageModel.create();
  console.log('Model download triggered!');
  // Browser will start downloading in background
});
</script>
```

#### **Trigger Download (Method 2: Console after click - RECOMMENDED):**

**The issue:** Running `LanguageModel.create()` directly in console returns a pending promise because there's no user activation.

**The solution:**
1. **Click anywhere on the current webpage** (the body, a link, anywhere)
2. **IMMEDIATELY** (within 5 seconds) run in DevTools Console:
```javascript
// Must run immediately after clicking!
await LanguageModel.create()
```

**Visual Guide:**
```
Step 1: Click on webpage → navigator.userActivation.isActive = true
Step 2: Quickly type in console → await LanguageModel.create()
Step 3: Press Enter → Download starts! ✅
```

⚠️ **Common Mistake:** Running `LanguageModel.create()` without `await` returns a pending promise:
```javascript
// ❌ WRONG - Returns pending promise
LanguageModel.create()
// Promise {<pending>}

// ✅ CORRECT - Waits for completion
await LanguageModel.create()
// → AILanguageModel session object (download triggered)
```

#### **Trigger Download (Method 3: Quick Copy-Paste Trick):**

If Method 2 is hard, use this trick:

1. **Copy this entire code block:**
```javascript
document.body.addEventListener('click', async () => {
  console.log('🚀 Triggering download...');
  const session = await LanguageModel.create();
  console.log('✅ Download started! Check chrome://on-device-internals');
  console.log('Session created:', session);
}, { once: true });
console.log('👆 Now click anywhere on this page!');
```

2. **Paste in DevTools Console** and press Enter
3. **Click anywhere** on the webpage
4. Download will start automatically! ✅

This adds a one-time click listener that triggers the download.

#### **Monitor Download Progress:**

Once you trigger the download, Chrome downloads the model in the background. Here's how to check progress:

**Option 1: Check chrome://on-device-internals (Recommended)**
1. Open new tab: `chrome://on-device-internals`
2. Look for **"Gemini Nano"** section
3. View detailed status:
   - **Model Status:** Installing / Ready / Not Available
   - **Download Progress:** Percentage complete
   - **Model Version:** Version number
   - **Model Size:** 1.5GB
   - **Last Update:** Timestamp
4. Check for errors if any

**Option 2: Check chrome://components**
1. Open new tab: `chrome://components`
2. Find: **"Optimization Guide On Device Model"**
3. Check status progression:
```
Status: Not installed
   ↓ (After triggering download)
Status: Downloading... (5-15 minutes)
   ↓
Status: Up-to-date ✅
```

**Option 3: Check Availability in Console**
```javascript
// Keep checking until "available"
await LanguageModel.availability()

// Status progression:
// "downloadable" → "downloading" → "available"
```

#### **Download Progress Timeline:**

| Time | Status | What's Happening |
|------|--------|------------------|
| 0 min | Trigger download via `LanguageModel.create()` | Initial API call |
| 0-1 min | `availability()` returns "downloading" | Chrome starts download |
| 1-10 min | Downloading in background | ~1.5GB transfer |
| 10-15 min | Installing/Unpacking | Extracting model files |
| 15+ min | `availability()` returns "available" | ✅ Ready to use! |

⏱️ **Wait for "available" status before using AI features.**

#### **What if Download Fails?**

If download stalls or fails:
1. Check internet connection (must be unmetered)
2. Verify 22GB+ free disk space
3. Go to `chrome://components`
4. Find "Optimization Guide On Device Model"
5. Click **"Check for update"**
6. Restart Chrome Canary
7. Try triggering download again: `await LanguageModel.create()`

#### **Check Availability After Download:**

After download completes, verify:
```javascript
await LanguageModel.availability()
// Should now return: "available"
```

---

#### **✅ Download Complete Checklist:**

Before moving to Step 7, verify:
- [ ] `chrome://on-device-internals` shows **Model Status: Ready**
- [ ] `chrome://components` shows **Status: Up-to-date**
- [ ] `await LanguageModel.availability()` returns `"available"`
- [ ] Model size is ~1.5GB
- [ ] No error messages in console

If all checkboxes are ✅, proceed to Step 7!

---

### Step 7: Verify Model is Ready

After download completes, verify availability:

```javascript
await LanguageModel.availability()
```

#### **✅ Expected Output:**
```javascript
"available"
```

**Status:** `"available"` means model is downloaded and ready! 🎉

⚠️ **API Change Notice (Chrome 138+):**
- ✅ **Use:** `await LanguageModel.availability()` (new API)
- ❌ **Avoid:** `await window.ai.languageModel.capabilities()` (deprecated)
- The old `capabilities()` method is **removed** in Chrome 138+
- Use `availability()` to check if the model is ready

---

### Step 8: Test AI Works

Create a session and test using the **new LanguageModel API** (Chrome 138+):

```javascript
// Create AI session (new API)
const session = await LanguageModel.create();

// Test prompt
const response = await session.prompt("Say hello!");

// Log response
console.log(response);
```

#### **✅ Expected Output:**
```
"Hello! How can I assist you today?"
```

✅ **If you see a response, AI is working!**

---

## 🧪 Verification Steps

### Quick Verification Checklist

Run these in DevTools Console to verify everything (using **new Chrome 138+ API**):

```javascript
// 1. Check LanguageModel API exists
typeof LanguageModel !== 'undefined'
// → Should return: true

// 2. Check model availability
await LanguageModel.availability()
// → Should return: "available"

// 3. Create session
const session = await LanguageModel.create()
// → Should return session object

// 4. Test prompt
await session.prompt("Hello!")
// → Should return AI-generated response
```

✅ **All 4 steps work?** You're ready to use the extension!

⚠️ **Migration Note:** If you see code using `window.ai`, it's using the **deprecated API**. Update to:
- ❌ `window.ai.languageModel.create()` → ✅ `LanguageModel.create()`
- ❌ `window.ai.summarizer.create()` → ✅ `AISummarizer.create()`

---

## 🎯 Testing the Extension

### Step 1: Reload Extension

1. Go to: `chrome://extensions`
2. Enable **"Developer mode"** (toggle in top-right)
3. Find **"Kaizen"** extension
4. Click the **reload icon** 🔄

---

### Step 2: Test on Google Search

1. Go to: `https://google.com`
2. Search for: **"how to use chrome ai apis"**
3. **Expected:** Purple AI summary card appears above results

#### **Visual Example:**
```
┌─────────────────────────────────────────────────────┐
│ 🔮  AI-Powered Summary         [Gemini Nano]        │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Chrome's Built-in AI APIs allow developers to       │
│ integrate on-device machine learning...             │
│                                                      │
├─────────────────────────────────────────────────────┤
│  [🌐 Translate]  [📖 Read More]  [💾 Save to Graph] │
├─────────────────────────────────────────────────────┤
│ 🔒 Processed locally - No data sent to servers      │
└─────────────────────────────────────────────────────┘

1. Chrome AI APIs Guide - developer.chrome.com
   Built-in AI features for Chrome extensions...
```

---

### Step 3: Check Console Logs

Open DevTools (F12) → Console tab

#### **✅ Expected Console Output:**
```
[Kaizen] Content-UI loaded 🚀
[Kaizen AI] Initializing AI APIs...
[Kaizen AI] ✓ Prompt API ready
[Kaizen AI] ✅ Initialization complete
[Kaizen Search] Detected Google Search, waiting for results...
[Kaizen Search] Found 10 results
[Kaizen Search] Extracted 5 results
[Kaizen Search] 🔮 Generating AI summary...
[Kaizen Search] ✅ Summary generated (X characters)
[Kaizen Search] ✅ Summary card injected
[Kaizen] All systems operational 🎉
```

✅ **See this output?** Extension is working perfectly!

---

### Step 4: Test Summary Card Actions

Click the buttons on the summary card:

1. **Translate Button** → Should show language selection (placeholder)
2. **Read More Button** → Should expand summary (placeholder)
3. **Save to Graph** → Should save to knowledge graph (placeholder)

**Note:** Some features are placeholders in current version.

---

## 🐛 Troubleshooting

### Issue 1: `LanguageModel is undefined`

#### **Symptoms:**
```javascript
> typeof LanguageModel
"undefined"
```

Console shows:
```
[Kaizen AI] Chrome AI APIs not available
```

⚠️ **Note:** If you see `window.ai`, you're using **deprecated API**. Chrome 138+ uses `LanguageModel` instead.

#### **Solutions:**

**A) Not Using Chrome Canary**
```javascript
// Check browser version
navigator.userAgent
```
Should contain: `Chrome/138.0.` or higher and `Canary`

**Fix:** Download and use Chrome Canary 138+.

---

**B) Flags Not Enabled**

Visit each flag URL and verify status:
```
chrome://flags/#optimization-guide-on-device-model  → Enabled BypassPerfRequirement
chrome://flags/#prompt-api-for-gemini-nano          → Enabled
```

**Fix:** Enable required flags, then relaunch.

---

**C) Didn't Relaunch Browser**

Flags only activate after relaunch.

**Fix:** 
1. Go to `chrome://flags`
2. Click blue "Relaunch" button at bottom
3. Wait for Chrome to fully restart

---

**D) Chrome Version Too Old**

Check version:
```
chrome://version
```

Should be: `138.0.xxxx.x` or higher

**Fix:** Update Chrome Canary:
```
chrome://settings/help
```

---

### Issue 2: `availability() returns "downloadable"` or Model Won't Download

#### **Symptoms:**
```javascript
await LanguageModel.availability()
// Returns: "downloadable"

// When trying to download:
LanguageModel.create()
// Returns: Promise {<pending>}  ← Stuck here!
```

#### **Root Cause:**

Chrome requires **user activation** (click/tap) to start downloads. Running `LanguageModel.create()` without prior user interaction will fail silently.

#### **Solution - Quick Fix (Copy-Paste Method):**

**Step 1:** Copy this entire code block:
```javascript
document.body.addEventListener('click', async () => {
  console.log('🚀 Starting model download...');
  console.log('User activation:', navigator.userActivation.isActive);
  try {
    const session = await LanguageModel.create();
    console.log('✅ SUCCESS! Download triggered!');
    console.log('Session created:', session);
    console.log('Monitor progress at: chrome://on-device-internals');
  } catch (error) {
    console.error('❌ Download failed:', error);
  }
}, { once: true });
console.log('👆 Click anywhere on this page to start download!');
```

**Step 2:** Paste into DevTools Console and press Enter

**Step 3:** Click **anywhere** on the webpage

**Step 4:** You should see:
```
👆 Click anywhere on this page to start download!
🚀 Starting model download...
User activation: true
✅ SUCCESS! Download triggered!
Session created: AILanguageModel {...}
Monitor progress at: chrome://on-device-internals
```

**Step 5:** Check download progress:
```javascript
await LanguageModel.availability()
// Should now return: "downloading" (then "available" after 5-15 min)
```

#### **Alternative Solution - Manual Method:**

If copy-paste doesn't work:

1. **Click anywhere on the webpage** (body, link, button, etc.)
2. **Immediately** (within 5 seconds) type in console:
```javascript
await LanguageModel.create()
```
3. Press Enter quickly before user activation expires

**Verification:**
```javascript
// Check if user activation is still active
navigator.userActivation.isActive  // Should be: true

// If false, click again and retry
```

**Important:** Must be called within a click/tap event handler or immediately after user interaction.

Then monitor at: `chrome://on-device-internals` or `chrome://components`

Wait 5-15 minutes for download to complete.

---

### Issue 3: `availability() returns "unavailable"`

#### **Symptoms:**
```javascript
await LanguageModel.availability()
// Returns: "unavailable"
```

#### **Possible Causes:**

**A) Wrong Chrome Version**

Check: `chrome://version`

Required: Chrome Canary 138+

---

**B) Flags Not Properly Set**

Verify required flags:
```
chrome://flags/#optimization-guide-on-device-model  → Enabled BypassPerfRequirement
chrome://flags/#prompt-api-for-gemini-nano          → Enabled
```

---

**C) System Requirements Not Met**

Gemini Nano requires:
- **Storage:** 22GB+ free space
- **Hardware:** GPU (>4GB VRAM) OR CPU (16GB RAM + 4 cores)
- **OS:** Windows 10+, macOS 13+ (Ventura), Linux, ChromeOS Chromebook Plus
- **Network:** Unmetered connection (Wi-Fi/Ethernet)

Check system resources.

---

**D) Download Failed**

Check: `chrome://components`

If "Optimization Guide On Device Model" shows error:
1. Click "Check for update"
2. Restart Chrome Canary
3. Try creating session again

---

### Issue 4: Summary Card Not Appearing

#### **Symptoms:**

Google Search works, but no purple card appears.

#### **Debugging Steps:**

**1. Check Console for Errors**

Open DevTools (F12) → Console

Look for:
```
[Kaizen Search] Error: ...
```

---

**2. Verify Search Results Detected**

Console should show:
```
[Kaizen Search] Detected Google Search, waiting for results...
[Kaizen Search] Found X results
```

If not found:
- Try different search query
- Check if on `google.com/search?q=...`
- Try refreshing page

---

**3. Check if Card Injected**

In DevTools Console:
```javascript
document.querySelector('#kaizen-search-summary')
```

Should return: `<div id="kaizen-search-summary">...</div>`

If `null`:
- Check console for injection errors
- Verify SearchEnhancer initialized
- Check CSS loaded: `document.querySelector('style[data-kaizen]')`

---

**4. Check AI Response**

Look for:
```
[Kaizen Search] 🔮 Generating AI summary...
[Kaizen Search] ✅ Summary generated
```

If summary generation failed:
- Verify `await LanguageModel.availability()` returns `"available"`
- Try creating session manually to test: `await LanguageModel.create()`
- Check for rate limiting errors

---

### Issue 5: Extension Not Loading

#### **Symptoms:**

No console logs appear at all.

#### **Solutions:**

**1. Check Extension Loaded**

Go to: `chrome://extensions`

Verify:
- Kaizen extension is listed
- Toggle is **ON** (blue)
- No errors shown

---

**2. Check Content Script Injected**

In DevTools → Elements tab:

Look for:
```html
<div id="kaizen-overlay-root"></div>
```

If not found:
- Check manifest permissions
- Verify content script matches URL
- Try reloading extension

---

**3. Check Build**

In terminal:
```bash
cd e:\Codebase\Hackathon\kaizen
pnpm build
```

Verify build succeeds without errors.

---

**4. Check Console for Build Errors**

DevTools → Console

Look for:
```
Failed to load resource: net::ERR_FILE_NOT_FOUND
```

If found:
- Rebuild extension: `pnpm build`
- Reload extension in `chrome://extensions`

---

### Issue 6: Slow AI Responses

#### **Symptoms:**

Summary takes 10+ seconds to generate.

#### **Causes & Solutions:**

**A) First Run (Normal)**

First AI call downloads additional data.

**Solution:** Wait. Subsequent calls will be faster.

---

**B) Large Prompts**

Extracting too many search results.

**Solution:** Already optimized (extracts only top 5 results).

---

**C) Low System Resources**

Check:
- **RAM:** Should have 4GB+ available
- **CPU:** Should be < 80% usage

**Solution:** Close other apps, especially browsers/IDEs.

---

**D) Model Not Fully Downloaded**

Check: `chrome://components`

Verify "Optimization Guide On Device Model" shows "Up-to-date".

---

## 📚 Quick Reference

### Essential Commands (Chrome 138+ New API)

```javascript
// ⚠️ IMPORTANT: Use new API (Chrome 138+)
// ❌ OLD: window.ai.languageModel (DEPRECATED)
// ✅ NEW: LanguageModel (global constructor)

// Check if API available
typeof LanguageModel !== 'undefined'  // → true

// Check model availability (recommended)
await LanguageModel.availability()
// Returns: "available", "downloadable", "downloading", or "unavailable"

// Check user activation (before downloading)
navigator.userActivation.isActive  // true = can download

// Download model (requires user activation)
await LanguageModel.create()

// Create AI session with options
const session = await LanguageModel.create({
  systemPrompt: "You are a helpful assistant.",
  temperature: 0.8,
  topK: 3
});

// Generate response
const response = await session.prompt("Your question here");
console.log(response);

// Streaming response
const stream = session.promptStreaming("Your question");
for await (const chunk of stream) {
  console.log(chunk);
}

// Count tokens
const tokenCount = await session.countPromptTokens("Your text");

// Check remaining tokens
console.log(session.tokensLeft, session.maxTokens);

// Clone session (preserves context)
const clone = await session.clone();

// Destroy session (cleanup)
session.destroy();
```

### Other Chrome 138+ AI APIs

```javascript
// Summarizer API
const summarizer = await AISummarizer.create({
  type: "key-points",
  format: "markdown",
  length: "medium"
});
const summary = await summarizer.summarize(longText);

// Translator API
const translator = await AITranslator.create({
  sourceLanguage: "en",
  targetLanguage: "es"
});
const translated = await translator.translate("Hello world");

// Language Detector API
const detector = await AILanguageDetector.create();
const results = await detector.detect("Bonjour le monde");
// → [{ detectedLanguage: "fr", confidence: 0.95 }]
```

---

### Important URLs

| URL | Purpose |
|-----|---------|
| `chrome://version` | Check Chrome version (need 138+) |
| `chrome://flags` | Enable feature flags |
| `chrome://on-device-internals` | Monitor AI model status (recommended) |
| `chrome://components` | Monitor model download progress |
| `chrome://extensions` | Manage extensions |
| `chrome://inspect/#service-workers` | Debug background scripts |

---

### Flag URLs (Copy-Paste Ready)

**Required:**
```
chrome://flags/#optimization-guide-on-device-model
chrome://flags/#prompt-api-for-gemini-nano
```

**Optional (Recommended):**
```
chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
chrome://flags/#summarization-api-for-gemini-nano
chrome://flags/#translation-api
chrome://flags/#language-detection-api
chrome://flags/#writer-api-for-gemini-nano
chrome://flags/#rewriter-api-for-gemini-nano
```

---

### Verification Checklist

```
Setup Verification:
[ ] Chrome Canary 138+ installed (not 131+)
[ ] At least 22GB free disk space available
[ ] GPU (>4GB VRAM) OR CPU (16GB RAM + 4 cores)
[ ] All required flags enabled
[ ] Browser relaunched after enabling flags
[ ] window.ai is defined (not undefined)
[ ] availability() returns "available" (not "unavailable")
[ ] Test prompt returns response

Extension Verification:
[ ] Extension loaded in chrome://extensions
[ ] Content-UI loaded (check console)
[ ] AI Manager initialized (check console)
[ ] SearchEnhancer initialized (check console)
[ ] Summary card appears on Google Search
[ ] Console shows no errors

Functional Verification:
[ ] AI summary generated successfully
[ ] Summary is relevant to search query
[ ] Card has proper styling (purple gradient)
[ ] Action buttons visible (Translate, Read More, Save)
[ ] Privacy badge visible ("Processed locally")
```

---

## 🎓 Understanding Chrome AI APIs

### ⚠️ API Migration Notice (Chrome 138+)

**BREAKING CHANGE:** `window.ai` is **DEPRECATED** and removed in Chrome 138+.

| Old API (Deprecated) | New API (Chrome 138+) | Status |
|---------------------|----------------------|--------|
| `window.ai.languageModel` | `LanguageModel` | ✅ Use global constructor |
| `window.ai.summarizer` | `AISummarizer` | ✅ Use global constructor |
| `window.ai.writer` | `AIWriter` | ✅ Use global constructor |
| `window.ai.rewriter` | `AIRewriter` | ✅ Use global constructor |
| `window.ai.translator` | `AITranslator` | ✅ Use global constructor |
| `window.ai.languageDetector` | `AILanguageDetector` | ✅ Use global constructor |

**Migration Example:**
```javascript
// ❌ OLD (Deprecated - Don't use)
const session = await window.ai.languageModel.create();

// ✅ NEW (Chrome 138+)
const session = await LanguageModel.create();
```

### Architecture

```
Your Extension (Kaizen)
        ↓
LanguageModel/AISummarizer APIs (Chrome 138+)
        ↓
Gemini Nano (~1.5GB model)
        ↓
Local Inference (on-device)
        ↓
AI Response
```

### Key Concepts

**1. On-Device AI**
- All processing happens locally
- No data sent to cloud
- Works offline
- No API costs
- Privacy-first

**2. Gemini Nano**
- Google's small AI model
- ~1.5GB size
- Optimized for browser
- Fast inference
- Multiple capabilities

**3. API Types**

| API | Purpose | Chrome Extensions | Web Pages | Languages |
|-----|---------|-------------------|-----------|-----------|
| **Prompt API** | General reasoning, text generation | ✅ Stable (138+) | 🧪 Origin Trial | English |
| **Summarizer API** | Text summarization | ✅ Stable (138+) | ✅ Stable (138+) | English |
| **Translator API** | Language translation | ✅ Stable (138+) | ✅ Stable (138+) | EN, ES, JA (140+) |
| **Language Detector** | Language detection | ✅ Stable (138+) | ✅ Stable (138+) | EN, ES, JA (140+) |
| **Writer API** | Content generation | 🧪 Origin Trial | 🧪 Origin Trial | English |
| **Rewriter API** | Text improvement | 🧪 Origin Trial | 🧪 Origin Trial | English |
| **Proofreader API** | Grammar checking | 🧪 Origin Trial | 🧪 Origin Trial | English |

**Legend:**
- ✅ **Stable** = Available with flags enabled in Chrome 138+
- 🧪 **Origin Trial** = Requires Origin Trial token (for web pages)
- **EN** = English, **ES** = Spanish, **JA** = Japanese

**Note:** As of May 2025, Prompt, Summarizer, Translator, and Language Detector are stable for Chrome extensions with flags enabled.

---

## 🔒 Privacy & Security

### Data Privacy

✅ **100% Local Processing**
- All AI runs on your device
- No data sent to Google servers
- No cloud API calls
- No data stored in cloud

✅ **User Control**
- You control the model
- You control the data
- Delete model anytime
- Disable anytime

✅ **Transparent**
- Open source extension code
- Clear data usage
- No tracking
- No analytics sent externally

### Security

✅ **Sandboxed**
- AI runs in Chrome sandbox
- Cannot access system files
- Cannot access other extensions
- Isolated from web pages

✅ **Permissions**
- Only requests necessary permissions
- Clear permission descriptions
- Revocable anytime

---

## 📖 Additional Resources

### Official Documentation

- [Chrome Built-in AI APIs](https://developer.chrome.com/docs/ai/built-in)
- [Prompt API Guide](https://developer.chrome.com/docs/ai/built-in-apis)
- [Chrome Extensions Developer Guide](https://developer.chrome.com/docs/extensions/)

### Community

- [Chrome AI Challenge Discord](https://discord.gg/4ERQ6jgV9a)
- [Kaizen GitHub Repository](https://github.com/Recursion-Labs/kaizen)

### Internal Documentation

- [Project Architecture](./PROJECT_ARCHITECTURE.md)
- [Chrome AI Integration Plan](./CHROME_AI_INTEGRATION_PLAN.md)
- [Content-UI Implementation](./CONTENT_UI_IMPLEMENTATION_PLAN.md)
- [Build Complete Guide](./BUILD_COMPLETE.md)

---

## ❓ FAQ

### Q: How do I download the Gemini Nano model?

**A:** 
1. Enable flags and relaunch Chrome
2. Check availability: `await LanguageModel.availability()`
3. If it returns `"downloadable"`, click anywhere on a webpage
4. Immediately run: `await LanguageModel.create()`
5. Monitor at `chrome://on-device-internals`
6. Wait 5-15 minutes for download to complete
7. Check again: `await LanguageModel.availability()` should return `"available"`

**Important:** You **must** have user interaction (click) before calling `create()` to trigger download.

---

### Q: Why won't the model download?

**Common Issues:**
- ❌ **No user activation:** Must click on page first, then immediately call `create()`
- ❌ **Metered connection:** Chrome won't download on mobile data - use Wi-Fi
- ❌ **Insufficient space:** Need 22GB+ free disk space
- ❌ **Flags not enabled:** Check all required flags are enabled
- ❌ **Old Chrome version:** Need Chrome Canary 138+

**Troubleshooting "Promise {<pending>}" Issue:**

If you see this in console:
```javascript
> LanguageModel.create()
Promise {<pending>}
```

**The problem:** No user activation (you didn't click on the page first).

**The fix:** Use Method 3 above (copy-paste the click listener code), or:
```javascript
// 1. Copy this code
document.body.addEventListener('click', async () => {
  const session = await LanguageModel.create();
  console.log('✅ Download triggered!', session);
}, { once: true });

// 2. Paste and press Enter
// 3. Click anywhere on page
// 4. Download starts!
```

---

### Q: Where is the model stored?

**A:** 
The model is stored in Chrome's internal profile folder:
- **Windows:** `%LOCALAPPDATA%\Google\Chrome Canary\User Data\OptimizationGuide\`
- **macOS:** `~/Library/Application Support/Google/Chrome Canary/OptimizationGuide/`
- **Linux:** `~/.config/google-chrome-canary/OptimizationGuide/`

⚠️ **Note:** You should NOT manually modify these files. Use `chrome://components` to manage the model.

---

### Q: Do I need internet for AI to work?

**A:** 
- **Download:** Yes (to download 1.5GB model once)
- **Usage:** No (works 100% offline after download)

---

### Q: How much disk space does it use?

**A:** 
- **Free space required:** At least 22 GB (for download and installation)
- **Model size:** ~1.5 GB (Gemini Nano binary)
- **Additional space:** ~20.5 GB for temporary files during download/installation

---

### Q: Can I use regular Chrome instead of Canary?

**A:** No. Chrome AI APIs require Chrome Canary 138+ (as of May 2025). Not available in stable Chrome yet.

---

### Q: Will this slow down my browser?

**A:** 
- **Idle:** No impact
- **AI Usage:** Minimal (efficient on-device inference)
- **Memory:** ~200MB additional when AI active

---

### Q: Can I delete the model?

**A:** Yes. Go to `chrome://components`, find "Optimization Guide On Device Model", and remove it.

---

### Q: Does this work on mobile?

**A:** Not yet. Chrome AI APIs are desktop-only (Windows 10+, macOS 13+, Linux, ChromeOS Chromebook Plus). Android and iOS are not supported as of May 2025.

---

### Q: How do I update the model?

**A:** Chrome updates it automatically via `chrome://components`.

---

### Q: Can other extensions use my AI session?

**A:** No. Each extension has isolated AI sessions.

---

## 🎉 Success!

If you've completed all steps and see the purple summary card on Google Search, **congratulations!** 🎊

You've successfully:
- ✅ Installed Chrome Canary
- ✅ Enabled Chrome AI APIs
- ✅ Downloaded Gemini Nano
- ✅ Verified AI works
- ✅ Tested Kaizen extension

**Next steps:**
1. Try different search queries
2. Explore other features (coming soon)
3. Read [Content-UI Implementation Plan](./CONTENT_UI_IMPLEMENTATION_PLAN.md)
4. Join [Discord](https://discord.gg/4ERQ6jgV9a) for updates

---

**Document Status:** ✅ Complete Setup Guide  
**Last Updated:** October 19, 2025  
**Version:** 1.0  
**Tested On:** Chrome Canary 131.0.6778.33

---

*Need help? Check [Troubleshooting](#troubleshooting) or ask in Discord!* 💬
