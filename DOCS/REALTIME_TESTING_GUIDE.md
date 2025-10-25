# 🚀 Real-Time Testing Guide - Kaizen Behavioral Engine

## ✅ What's Been Wired Up

All backend components are now connected for **real-time Chrome extension testing**:

1. ✅ **Scroll Tracking** - Content script monitors all scrolling
2. ✅ **Detectors** - Doomscrolling, Shopping, Time tracking
3. ✅ **Knowledge Graph** - Builds relationships in real-time
4. ✅ **Pattern Analyzer** - Detects behavioral patterns
5. ✅ **Intervention Strategy** - Triggers nudges
6. ✅ **Background Integration** - All components wired together
7. ✅ **Test Dashboard** - Real-time visualization

---

## 📋 Testing Steps

### Step 1: Build the Extension

```bash
# From project root
pnpm build
```

This will compile everything including:
- Background script with all detectors
- Content script with scroll tracker
- All packages (detectors, knowledge, interventions)

### Step 2: Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the `dist` folder in your project: `C:\Users\Ayush\OneDrive\Documents\kaizen\dist`
5. Extension should load with Kaizen icon

### Step 3: Open Test Dashboard

1. Open the test dashboard in a new tab:
   ```
   file:///C:/Users/Ayush/OneDrive/Documents/kaizen/TEST_DASHBOARD.html
   ```
   
2. Or right-click the extension icon → **Inspect** → **Service Worker** to see console logs

### Step 4: Test Real-Time Detection

#### Test 1: Doomscrolling Detection

1. **Open Twitter/X** → `https://twitter.com`
2. **Scroll continuously** for 10-15 seconds
3. **Watch the dashboard** - you should see:
   - Console logs showing scroll events
   - Doomscrolling detector activating
   - Severity increasing
   - Knowledge graph nodes being created

**Expected Output:**
```
[TIME] SCROLL  500px on twitter.com
[TIME] SCROLL  800px on twitter.com
[TIME] PATTERN Doomscrolling detected - HIGH severity
[TIME] NUDGE   Mindful Scrolling: Let's take a mindful break...
```

#### Test 2: Shopping Detection

1. **Open Amazon** → `https://amazon.com`
2. **Visit multiple pages**:
   - Product page 1
   - Product page 2
   - Shopping cart
3. **Watch the dashboard** - you should see:
   - Shopping detector activating
   - Visit count increasing
   - Impulsive behavior detected

**Expected Output:**
```
[TIME] PAGE_LOAD amazon.com
[TIME] PAGE_LOAD amazon.com/product/123
[TIME] PATTERN Shopping impulse detected - MEDIUM severity
[TIME] NUDGE   Mindful Shopping: Pause before you purchase...
```

#### Test 3: Time Tracking

1. **Open GitHub** → `https://github.com` (productive site)
2. **Stay on the page for 1-2 minutes**
3. **Switch to YouTube** → `https://youtube.com` (entertainment site)
4. **Watch the dashboard** - you should see:
   - Productivity score updating
   - Time categorization (productive vs entertainment)
   - Pattern analyzer detecting behavior

**Expected Output:**
```
[TIME] SYSTEM  Productivity Score: 85.5%
[TIME] SYSTEM  Productive time: 45.2s
[TIME] SYSTEM  Entertainment time: 12.8s
```

#### Test 4: Pattern Analysis

1. **Switch between tabs rapidly** (5+ times in 2 minutes)
2. **Watch for pattern insights**:
   - Rapid tab switching
   - Focus loss patterns
   - Late night browsing (if testing at night)

**Expected Output:**
```
[TIME] PATTERN Rapid tab switching detected - MEDIUM
[TIME] PATTERN Focus loss - multiple active sessions
```

---

## 🔍 Where to See Real-Time Outputs

### Option 1: Test Dashboard (`TEST_DASHBOARD.html`)

**Features:**
- 📊 Live metrics cards
- 📱 Doomscrolling status
- 🛒 Shopping behavior
- ⏱️ Time tracking
- 🗺️ Knowledge graph stats
- 📊 Real-time event console

**Refresh:** Auto-updates every 2 seconds

### Option 2: Chrome DevTools Console

1. Right-click extension icon → **Inspect** → **Service Worker**
2. See detailed logs:
   ```
   [Kaizen] Scroll event received: 500px on tab 123
   [Kaizen] Shopping event: amazon.com has medium severity
   [Kaizen] Pattern insight: doomscrollingHabit - Extended scrolling...
   ```

### Option 3: Chrome Extension Popup

Open the extension popup to see:
- Current session stats
- Active detections
- Recent nudges

---

## 📊 What You'll See in Real-Time

### Doomscrolling Detection
```json
{
  "isDoomScrolling": true,
  "severity": "high",
  "accumulatedScroll": 2400,
  "scrollEvents": 8,
  "domain": "twitter.com"
}
```

### Shopping Detection
```json
{
  "isImpulsive": true,
  "severity": "medium",
  "visitCount": 3,
  "timeSpent": 45000,
  "domain": "amazon.com"
}
```

### Time Tracking
```json
{
  "productivityScore": 0.75,
  "productive": 120000,
  "entertainment": 30000,
  "neutral": 10000
}
```

### Knowledge Graph
```json
{
  "nodeCount": 12,
  "edgeCount": 8,
  "nodeTypes": {
    "behavior": 4,
    "pattern": 2,
    "domain": 3,
    "session": 3
  }
}
```

### Pattern Insights
```json
{
  "type": "doomscrollingHabit",
  "severity": "high",
  "description": "Extended scrolling detected in tab 1",
  "confidence": 0.9,
  "timestamp": 1234567890
}
```

---

## 🐛 Troubleshooting

### Issue: No scroll events detected

**Solution:**
1. Check DevTools console for errors
2. Verify content script loaded: `chrome://extensions` → Details → Inspect views
3. Reload the page you're testing on

### Issue: Dashboard shows "Extension API not available"

**Solution:**
1. Make sure TEST_DASHBOARD.html is opened in a tab (not locally)
2. Extension must be loaded in Chrome
3. Try opening: `chrome-extension://YOUR_EXTENSION_ID/TEST_DASHBOARD.html`

### Issue: Background script errors

**Solution:**
1. Check Service Worker console: Right-click extension → Inspect → Service Worker
2. Look for import errors or TypeScript issues
3. Rebuild: `pnpm build`

### Issue: No nudges appearing

**Solution:**
1. Check notification permissions: Chrome Settings → Notifications
2. Verify detector thresholds are being met
3. Check background script logs for intervention triggers

---

## 🎯 Success Criteria

You'll know it's working when you see:

✅ **Console logs** showing scroll events from content script  
✅ **Dashboard metrics** updating in real-time  
✅ **Detector statuses** changing from inactive to active  
✅ **Knowledge graph** nodes and edges increasing  
✅ **Pattern insights** appearing in the console  
✅ **Chrome notifications** with nudges appearing  
✅ **Session tracking** showing time spent correctly  

---

## 📝 Next Steps After Testing

1. **Validate Accuracy** - Test with various websites
2. **Tune Thresholds** - Adjust detector sensitivity
3. **UI Integration** - Connect to your frontend dashboard
4. **Persistence** - Add Chrome storage for knowledge graph
5. **Advanced Features**:
   - Export knowledge graph
   - Pattern visualization
   - Custom nudge templates
   - User preferences

---

## 🔥 Quick Test Checklist

- [ ] Extension built (`pnpm build`)
- [ ] Extension loaded in Chrome
- [ ] Test dashboard opened
- [ ] Twitter scrolling → doomscrolling detected
- [ ] Amazon browsing → shopping impulse detected
- [ ] GitHub usage → productivity tracked
- [ ] Tab switching → patterns detected
- [ ] Knowledge graph populating
- [ ] Nudges appearing
- [ ] Console logs showing events
- [ ] Dashboard updating automatically

---

## 📞 Debug Commands

```bash
# Rebuild extension
pnpm build

# Check TypeScript errors
pnpm type-check

# Run linter
pnpm lint

# Watch mode (auto-rebuild)
pnpm dev

# Backend unit test (simulated)
pnpm exec tsx test-backend.ts
```

---

## 🎉 You're Ready!

Everything is wired up for real-time testing. Just:

1. `pnpm build`
2. Load extension in Chrome
3. Open TEST_DASHBOARD.html
4. Start browsing and watch the magic happen! ✨

Your behavioral engine is now **LIVE and monitoring in real-time!** 🚀
