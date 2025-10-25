# 🚀 Quick Start - Test Your Extension NOW!

## ✅ Build Complete!

Your Kaizen behavioral engine is **BUILT and READY** to test!

---

## 📍 Step 1: Load Extension in Chrome (30 seconds)

1. Open Chrome
2. Go to: `chrome://extensions`
3. Toggle **"Developer mode"** ON (top-right corner)
4. Click **"Load unpacked"**
5. Navigate to and select:
   ```
   C:\Users\Ayush\OneDrive\Documents\kaizen\dist
   ```
6. ✅ Extension loaded!

---

## 📍 Step 2: Open Service Worker Console (10 seconds)

1. In `chrome://extensions`, find **Kaizen** extension
2. Click **"Service worker"** (blue link under the extension)
3. DevTools opens → You'll see:
   ```
   [Kaizen] Integration manager initialized with all detectors and knowledge components.
   ```

---

## 📍 Step 3: Test Real-Time Detection (2 minutes)

### Test 1: Doomscrolling 📱

1. Open https://twitter.com (or https://reddit.com)
2. **Scroll continuously for 10 seconds**
3. Watch Service Worker console - you'll see:
   ```
   [Kaizen] Scroll event received: 500px on tab 123
   [Kaizen] Doomscrolling event: Tab 123 has medium severity
   ```

### Test 2: Shopping 🛒

1. Open https://amazon.com
2. Click on 2-3 different products
3. Watch console:
   ```
   [Kaizen] Shopping event: amazon.com has medium severity
   ```

### Test 3: Time Tracking ⏱️

1. Stay on https://github.com for 30 seconds
2. Console shows time tracking working

---

## 📍 Step 4: View Test Dashboard (Optional)

1. **Right-click** the Kaizen extension icon
2. **Inspect** → **Popup**
3. Or open in new tab:
   ```
   file:///C:/Users/Ayush/OneDrive/Documents/kaizen/TEST_DASHBOARD.html
   ```

Dashboard shows:
- Live doomscrolling status
- Shopping behavior
- Time tracking
- Knowledge graph stats
- Real-time event console

---

## 🎯 What You'll See

### In Service Worker Console:

```
Background service worker started and modules initialized.
Integration manager: {detectors: Array(4), knowledge: Array(3)}

[Kaizen] Scroll event received: 800px on tab 5
[Kaizen] Shopping event: amazon.com has medium severity  
[Kaizen] Doomscrolling event: Tab 5 has high severity
[Kaizen] Pattern insight: doomscrollingHabit - Extended scrolling detected
```

### Chrome Notifications:

- **Mindful Scrolling** - "Let's take a mindful break. Your peace matters more than the feed."
- **Mindful Shopping** - "Pause before you purchase — thoughtful choices save peace and money."
- **Usage Limit Reached** - "You have visited this site frequently. Time for a break?"

---

## 🐛 Troubleshooting

### ❌ Extension won't load
**Fix:** Make sure you're selecting the `dist` folder, not the root folder

### ❌ No console logs
**Fix:** 
1. Check Service Worker is running (blue "Service worker" link)
2. Reload extension: `chrome://extensions` → click reload icon
3. Refresh the webpage you're testing on

### ❌ No scroll events
**Fix:**
1. Make sure you're on a supported site (Twitter, Reddit, etc.)
2. Check browser console (F12) for content script errors
3. Reload the page

---

## ✨ Success Indicators

You'll know it's working when:

- ✅ Service Worker console shows "Integration manager initialized"
- ✅ Scroll events appear in console when you scroll
- ✅ Shopping/time tracking logs appear
- ✅ Knowledge graph nodes increase
- ✅ Chrome notifications appear
- ✅ No error messages in console

---

## 📊 Backend Test (Already Passed!)

We already tested the backend components:
```bash
pnpm exec tsx test-backend.ts
```

Result: ✅ All 9 tests passed
- Doomscrolling detector ✅
- Shopping detector ✅
- Time tracker ✅
- Pattern analyzer ✅
- Knowledge graph ✅
- RAG engine ✅
- Intervention strategy ✅
- Nudge generator ✅
- Integration test ✅

---

## 🎯 Quick Test Checklist

- [ ] Extension loaded in Chrome
- [ ] Service Worker console opened
- [ ] Scrolled on Twitter → saw scroll events
- [ ] Visited Amazon → saw shopping detection
- [ ] Stayed on GitHub → saw time tracking
- [ ] Knowledge graph nodes increasing
- [ ] Chrome notification appeared

---

## 📝 Next Steps

1. **Tune thresholds** - Adjust detector sensitivity in:
   - `packages/detectors/Doomscrolling.ts`
   - `packages/detectors/ShoppingDetector.ts`
   - `packages/detectors/TimeTracker.ts`

2. **Add persistence** - Save knowledge graph to Chrome storage

3. **UI integration** - Connect your frontend dashboard

4. **Custom nudges** - Personalize intervention messages

---

## 🎉 You're Live!

Your behavioral engine is now:
- ✅ Monitoring scrolling in real-time
- ✅ Detecting shopping behavior
- ✅ Tracking time spent
- ✅ Analyzing patterns
- ✅ Building knowledge graphs
- ✅ Generating nudges

**Go test it now!** Open Chrome, load the extension, and start browsing! 🚀
