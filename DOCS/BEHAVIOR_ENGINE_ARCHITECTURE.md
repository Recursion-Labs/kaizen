# 🧠 Behavior Engine Architecture
## Kaizen Extension - Core Behavioral Analytics & Wellness System

**Date:** October 16, 2025  
**Status:** 📋 Documented - Implementation Pending  
**Purpose:** Privacy-first behavior tracking, analytics, notifications, remarks, and reports

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Core Components](#core-components)
4. [Features](#features)
5. [Data Models](#data-models)
6. [Implementation Guide](#implementation-guide)
7. [Privacy & Security](#privacy--security)

---

## 1. Overview

### What is the Behavior Engine?

The **Behavior Engine** is Kaizen's core intelligence system that monitors, analyzes, and provides insights into user browsing behaviors. It's designed with **privacy-first principles** - all data stays local, no cloud sync, no external tracking.

### Key Capabilities

✅ **Behavior Detection**
- Doomscrolling detection
- Impulsive shopping patterns
- Excessive browsing analysis
- Productivity tracking
- Focus session monitoring

✅ **Smart Notifications**
- Gentle behavioral nudges
- Achievement celebrations
- Focus reminders
- Break suggestions
- Goal progress updates

✅ **User Remarks System**
- Personal notes & reflections
- Mood tracking
- Goal setting
- Daily journaling
- Tagged insights

✅ **Comprehensive Reports**
- Daily/Weekly/Monthly summaries
- Site usage analytics
- Productivity metrics
- Behavior trend analysis
- Exportable PDF/HTML reports

---

## 2. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Analytics   │  │   Reports    │  │   Remarks    │          │
│  │  Dashboard   │  │    Viewer    │  │   Editor     │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌─────────────────────────────────────────────────────────────────┐
│                     Behavior Engine Core                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  BehaviorEngine.ts - Main Orchestrator                   │   │
│  │  - Coordinate all behavior subsystems                     │   │
│  │  - Event aggregation & dispatch                           │   │
│  │  - Real-time behavior analysis                            │   │
│  │  - Intervention triggering                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│    Detectors     │ │Interventions │ │    Analytics     │
│                  │ │              │ │                  │
│ • Doomscroll     │ │ • Notifier   │ │ • Metrics        │
│ • Shopping       │ │ • Nudger     │ │ • Reports        │
│ • TimeTracker    │ │ • Strategy   │ │ • Aggregation    │
│ • Patterns       │ │              │ │                  │
└────────┬─────────┘ └──────┬───────┘ └────────┬─────────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            │
                            ▼
         ┌─────────────────────────────────────┐
         │         Storage Layer               │
         │  ┌─────────────┐  ┌──────────────┐ │
         │  │  Behavior   │  │   Remarks    │ │
         │  │  Storage    │  │   Storage    │ │
         │  │ (IndexedDB) │  │  (IndexedDB) │ │
         │  └─────────────┘  └──────────────┘ │
         └─────────────────────────────────────┘
                            │
                            ▼
         ┌─────────────────────────────────────┐
         │      Background Monitoring          │
         │  • Tab activity tracking            │
         │  • Scroll event monitoring          │
         │  • Time on site calculation         │
         │  • Pattern recognition              │
         └─────────────────────────────────────┘
```

---

## 3. Core Components

### 📁 File Structure

```
packages/shared/lib/behavior/
├── types.ts                          # TypeScript types & interfaces
├── BehaviorEngine.ts                 # Main orchestrator
│
├── detectors/                        # Behavior Detection Systems
│   ├── DoomscrollDetector.ts        # Detect excessive scrolling
│   ├── ShoppingDetector.ts          # Impulsive shopping patterns
│   ├── TimeTracker.ts               # Site usage time tracking
│   └── PatternAnalyzer.ts           # ML-based pattern recognition
│
├── interventions/                    # Intervention Systems
│   ├── NotificationManager.ts       # Chrome notifications API
│   ├── NudgeGenerator.ts            # AI-powered nudge messages
│   └── InterventionStrategy.ts      # Decision logic & timing
│
├── analytics/                        # Analytics & Reporting
│   ├── BehaviorAnalytics.ts         # Core analytics engine
│   ├── ReportGenerator.ts           # PDF/HTML report generation
│   └── MetricsCollector.ts          # Data aggregation & stats
│
└── storage/                          # Data Persistence
    ├── BehaviorStorage.ts           # Behavior data (IndexedDB)
    └── RemarkStorage.ts             # User notes/remarks (IndexedDB)

pages/options/src/components/panels/
├── AnalyticsSettings.tsx             # Main analytics dashboard
│
└── behavior/                         # Behavior UI Components
    ├── BehaviorDashboard.tsx        # Overview dashboard
    ├── ActivityChart.tsx            # Time series charts
    ├── ReportsPanel.tsx             # Report viewer
    ├── RemarksPanel.tsx             # Notes & reflections
    ├── NotificationSettings.tsx     # Configure notifications
    └── GoalsPanel.tsx               # Set & track goals

chrome-extension/src/background/
└── behaviors/                        # Background Services
    ├── behavior-monitor.ts          # Tab/scroll event monitoring
    ├── intervention-scheduler.ts    # Schedule interventions
    └── metrics-collector.ts         # Aggregate metrics
```

---

## 4. Features

### 4.1 Behavior Detection

#### 🌀 Doomscrolling Detection

**Algorithm:**
```typescript
interface DoomscrollCriteria {
  minDuration: 20; // minutes
  minScrollEvents: 100;
  maxContentRetention: 30%; // Low retention = mindless scrolling
  domains: ['reddit.com', 'twitter.com', 'tiktok.com', 'instagram.com'];
}
```

**Detection Logic:**
1. Monitor scroll events per minute
2. Calculate scroll speed variance
3. Track time on page without interaction
4. Measure content engagement (clicks, shares)
5. Combine metrics for confidence score

**Output:**
```typescript
{
  isDoomscrolling: true,
  confidence: 0.87,
  duration: 42, // minutes
  scrollCount: 234,
  averageScrollSpeed: 1200, // px/sec
  recommendation: "You've been scrolling for 42 minutes. Take a 5-minute break?"
}
```

#### 🛒 Impulsive Shopping Detection

**Triggers:**
- Multiple e-commerce tabs open simultaneously
- Rapid cart additions (< 2 min between)
- Late-night shopping (10 PM - 2 AM)
- Price comparison across 3+ sites quickly

**Intervention:**
"Noticed you're browsing multiple shopping sites. Want to save these for tomorrow?"

#### ⏱️ Time Tracking

**Metrics Tracked:**
- Active time per site
- Total daily browsing time
- Category breakdown (work/social/news/entertainment)
- Focus session duration
- Peak productivity hours

### 4.2 Smart Notifications

#### 📬 Notification Types

| Type | Priority | Purpose | Example |
|------|----------|---------|---------|
| **Nudge** | Medium | Behavioral intervention | "You've been scrolling for 30 min. Take a break?" |
| **Reminder** | High | Time-based alerts | "Daily reflection time! Add a remark." |
| **Insight** | Low | Data-driven observation | "You're most productive at 10 AM!" |
| **Celebration** | Medium | Positive reinforcement | "🎉 3 focused hours today!" |
| **Warning** | High | Critical patterns | "Unusual late-night browsing detected" |

#### ⚙️ Notification Manager Features

```typescript
class NotificationManager {
  // Rate limiting
  maxPerHour = 3;
  
  // User preferences
  quietHours = { start: 22, end: 7 }; // 10 PM - 7 AM
  
  // Smart scheduling
  avoidDuringFocus = true;
  respectDND = true;
  
  // Delivery methods
  methods = ['chrome-notification', 'badge', 'sidepanel-popup'];
}
```

### 4.3 Remarks System

#### 📝 Personal Notes & Reflections

**Features:**
- Quick notes attached to behaviors
- Daily reflection prompts
- Mood tracking
- Goal progress journaling
- Tag-based organization

**Example Usage:**
```typescript
const remark: Remark = {
  id: "uuid-123",
  timestamp: Date.now(),
  behaviorId: "doomscroll-event-456",
  content: "Noticed I always scroll Reddit when stressed about deadlines",
  tags: ['stress', 'procrastination', 'reddit'],
  mood: 'negative',
  category: 'reflection'
};
```

**UI Features:**
- Markdown support
- Search & filter
- Export to JSON/TXT
- AI-powered insights from remarks

### 4.4 Analytics Dashboard

#### 📊 Key Metrics

**Daily View:**
- Total active time
- Top 5 sites visited
- Behavior patterns detected
- Interventions triggered
- Goals achieved

**Weekly View:**
- Time trend chart
- Category breakdown pie chart
- Productivity score (0-100)
- Focus session heatmap
- Comparison to previous week

**Monthly View:**
- Long-term trend analysis
- Habit formation tracking
- Goal completion rate
- Behavioral insights
- Achievements unlocked

#### 📈 Visualization Components

```typescript
// Activity Chart Component
<ActivityChart
  data={behaviorMetrics}
  timeRange="7d"
  metric="activeTime"
  chartType="line"
/>

// Category Breakdown
<PieChart
  data={categoryBreakdown}
  colors={categoryColors}
  showPercentages={true}
/>

// Heatmap (Hour x Day)
<HeatMap
  data={focusSessionData}
  xAxis="dayOfWeek"
  yAxis="hourOfDay"
  colorScale="green"
/>
```

### 4.5 Reports Generation

#### 📄 Report Types

**Daily Summary**
- Total time online
- Top activities
- Behaviors detected
- Key insights

**Weekly Report**
- 7-day overview
- Productivity trends
- Goal progress
- Recommendations

**Monthly Report**
- Comprehensive analysis
- Habit tracking
- Achievement summary
- Personalized insights

#### 🎨 Report Formats

**HTML Report:**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Kaizen Behavior Report - Week 42</title>
    <style>/* Tailwind CSS */</style>
  </head>
  <body>
    <!-- Interactive charts with Chart.js -->
    <!-- Collapsible sections -->
    <!-- Exportable data tables -->
  </body>
</html>
```

**PDF Export:**
- Generated via Chrome's printing API
- Professional formatting
- Charts & graphs included
- Shareable/printable

**JSON Export:**
```json
{
  "reportId": "monthly-2025-10",
  "period": { "start": "2025-10-01", "end": "2025-10-31" },
  "summary": {
    "totalTime": 84600,
    "productiveTime": 52800,
    "topSites": [...]
  },
  "rawData": {...}
}
```

---

## 5. Data Models

### Core TypeScript Interfaces

```typescript
// Main behavior event
interface BehaviorPattern {
  type: 'doomscrolling' | 'impulsive-shopping' | 'excessive-browsing' | 
        'productive-work' | 'research-mode' | 'distraction';
  confidence: number; // 0-1
  startTime: number;
  endTime: number;
  metadata: {
    url?: string;
    scrollEvents?: number;
    tabsOpened?: number;
    // ... context-specific fields
  };
}

// Daily aggregated metrics
interface BehaviorMetrics {
  date: string; // YYYY-MM-DD
  totalTime: number; // minutes
  productiveTime: number;
  distractedTime: number;
  sitesVisited: number;
  tabsSwitched: number;
  interventionCount: number;
  behaviors: BehaviorPattern[];
}

// Site activity tracking
interface SiteActivity {
  url: string;
  domain: string;
  title: string;
  visitCount: number;
  totalTime: number; // seconds
  lastVisit: number;
  category?: 'work' | 'social' | 'news' | 'shopping' | 'entertainment' | 'other';
}

// User remarks
interface Remark {
  id: string;
  timestamp: number;
  behaviorId?: string; // Link to specific behavior
  content: string;
  tags: string[];
  mood?: 'positive' | 'neutral' | 'negative';
  category?: 'goal' | 'reflection' | 'achievement' | 'challenge';
}

// Notification payload
interface NotificationPayload {
  id: string;
  type: 'nudge' | 'reminder' | 'insight' | 'celebration';
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: number;
}

// Generated report
interface BehaviorReport {
  id: string;
  generatedAt: number;
  period: { start: number; end: number };
  summary: {
    totalTime: number;
    productiveTime: number;
    topSites: Array<{ url: string; time: number }>;
    behaviorBreakdown: Record<BehaviorType, number>;
    interventionsTriggered: number;
    goalsAchieved: number;
  };
  insights: string[];
  recommendations: string[];
  charts: {
    dailyActivity: Array<{ date: string; minutes: number }>;
    categoryBreakdown: Array<{ category: string; percentage: number }>;
  };
}
```

---

## 6. Implementation Guide

### Phase 1: Foundation (Days 1-3)

**Tasks:**
1. ✅ Create data models & TypeScript types
2. ✅ Implement BehaviorStorage (IndexedDB)
3. ✅ Implement RemarkStorage
4. ⬜ Build BehaviorEngine core class
5. ⬜ Setup background monitoring service

**Files to Create:**
- `packages/shared/lib/behavior/types.ts`
- `packages/shared/lib/behavior/storage/BehaviorStorage.ts`
- `packages/shared/lib/behavior/storage/RemarkStorage.ts`
- `packages/shared/lib/behavior/BehaviorEngine.ts`
- `chrome-extension/src/background/behaviors/behavior-monitor.ts`

### Phase 2: Detectors (Days 4-6)

**Tasks:**
1. ⬜ DoomscrollDetector implementation
2. ⬜ TimeTracker implementation
3. ⬜ ShoppingDetector implementation
4. ⬜ PatternAnalyzer implementation
5. ⬜ Test detection accuracy

**Algorithm Details:**

**DoomscrollDetector:**
```typescript
class DoomscrollDetector {
  private scrollBuffer: ScrollEvent[] = [];
  private readonly DETECTION_WINDOW = 5 * 60 * 1000; // 5 min
  
  async analyze(): Promise<DoomscrollAnalysis> {
    const recentScrolls = this.getRecentScrolls();
    
    // Calculate metrics
    const scrollFrequency = recentScrolls.length / 5; // per minute
    const avgSpeed = this.calculateAvgScrollSpeed(recentScrolls);
    const variance = this.calculateVariance(recentScrolls);
    
    // Low variance + high frequency = doomscrolling
    const isDoomscrolling = scrollFrequency > 20 && variance < 0.3;
    const confidence = this.calculateConfidence(scrollFrequency, variance);
    
    return {
      isDoomscrolling,
      confidence,
      duration: this.getTotalDuration(),
      scrollCount: recentScrolls.length,
      averageScrollSpeed: avgSpeed,
      recommendation: this.generateRecommendation(confidence)
    };
  }
}
```

### Phase 3: Interventions (Days 7-9)

**Tasks:**
1. ⬜ NotificationManager implementation
2. ⬜ NudgeGenerator with AI integration
3. ⬜ InterventionStrategy logic
4. ⬜ User preference controls
5. ⬜ Test notification delivery

**AI Integration:**
```typescript
class NudgeGenerator {
  async generateNudge(behavior: BehaviorPattern): Promise<string> {
    const writer = await window.ai.writer.create({
      tone: 'friendly',
      length: 'short'
    });
    
    const nudge = await writer.write(`
      Generate a gentle, non-judgmental nudge for someone who has been
      ${behavior.type} for ${this.formatDuration(behavior.endTime - behavior.startTime)}.
      
      Style: Encouraging, supportive, actionable
      Max length: 100 characters
    `);
    
    return nudge;
  }
}
```

### Phase 4: Analytics UI (Days 10-13)

**Tasks:**
1. ⬜ Update AnalyticsSettings.tsx with full dashboard
2. ⬜ Create ActivityChart component
3. ⬜ Create RemarksPanel component
4. ⬜ Create ReportsPanel component
5. ⬜ Create NotificationSettings component

**Component Structure:**
```tsx
// pages/options/src/components/panels/AnalyticsSettings.tsx
export const AnalyticsSettings: React.FC = ({ theme }) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [metrics, setMetrics] = useState<BehaviorMetrics[]>([]);
  
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header with time range selector */}
      <DashboardHeader timeRange={timeRange} onChange={setTimeRange} />
      
      {/* Key metrics cards */}
      <MetricsGrid metrics={metrics} />
      
      {/* Activity chart */}
      <ActivityChart data={metrics} timeRange={timeRange} />
      
      {/* Category breakdown */}
      <CategoryBreakdown data={metrics} />
      
      {/* Recent behaviors */}
      <RecentBehaviors behaviors={getRecentBehaviors(metrics)} />
      
      {/* Generate report button */}
      <ReportGenerator period={timeRange} />
    </div>
  );
};
```

### Phase 5: Reports (Days 14-16)

**Tasks:**
1. ⬜ ReportGenerator implementation
2. ⬜ HTML report template
3. ⬜ PDF export functionality
4. ⬜ JSON export
5. ⬜ AI-powered insights generation

**Report Generation:**
```typescript
class ReportGenerator {
  async generateReport(period: Period): Promise<BehaviorReport> {
    const metrics = await behaviorStorage.getMetricsRange(
      period.start,
      period.end
    );
    
    // Use AI to generate insights
    const session = await window.ai.languageModel.create();
    const insights = await session.prompt(`
      Analyze this user's browsing behavior and provide 3-5 key insights:
      ${JSON.stringify(this.summarizeMetrics(metrics))}
      
      Focus on: patterns, productivity trends, areas for improvement
      Format: Bullet points, actionable
    `);
    
    return {
      id: generateId(),
      generatedAt: Date.now(),
      period,
      summary: this.calculateSummary(metrics),
      insights: this.parseInsights(insights),
      recommendations: await this.generateRecommendations(metrics),
      charts: this.prepareChartData(metrics)
    };
  }
}
```

---

## 7. Privacy & Security

### Privacy-First Design

✅ **100% Local Storage**
- All data stored in IndexedDB (client-side)
- No cloud sync, no external servers
- User controls all data

✅ **Data Minimization**
- Only store essential metrics
- No personally identifiable information (PII)
- Aggregate data where possible

✅ **User Control**
- Easy data export
- One-click data deletion
- Granular feature toggles
- Transparent data collection

✅ **Secure Storage**
- IndexedDB encryption (browser-level)
- No plaintext passwords or credentials
- Sanitized URLs (remove query params)

### Security Measures

```typescript
// Data sanitization
function sanitizeUrl(url: string): string {
  const urlObj = new URL(url);
  // Remove query params, only keep domain + path
  return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
}

// Data retention policy
const RETENTION_DAYS = 90; // Auto-delete old data
await behaviorStorage.clearOldData(RETENTION_DAYS);

// Export controls
function exportUserData(): Promise<string> {
  // User-initiated only, requires confirmation
  return JSON.stringify(await getAllData(), null, 2);
}
```

---

## 8. Integration with Chrome AI APIs

### AI-Powered Features

#### 🤖 Behavior Analysis
**API:** Prompt API  
**Use Case:** Analyze patterns, generate insights

```typescript
const session = await window.ai.languageModel.create();
const analysis = await session.prompt(`
  Analyze these browsing patterns:
  ${JSON.stringify(userMetrics)}
  
  Return JSON:
  {
    "primaryPattern": "string",
    "confidence": 0-1,
    "insight": "string",
    "recommendation": "string"
  }
`);
```

#### 📝 Smart Nudges
**API:** Writer API + Rewriter API  
**Use Case:** Generate personalized intervention messages

```typescript
const writer = await window.ai.writer.create({
  tone: 'encouraging',
  length: 'short'
});

const nudge = await writer.write(
  `Create a gentle reminder for someone who's been browsing social media for 45 minutes`
);
```

#### 📊 Report Insights
**API:** Summarizer API  
**Use Case:** Summarize long-form behavior data

```typescript
const summarizer = await window.ai.summarizer.create({
  type: 'key-points',
  length: 'medium'
});

const weekSummary = await summarizer.summarize(
  JSON.stringify(weeklyMetrics)
);
```

---

## 9. Success Metrics

### For Hackathon Judging

✅ **Innovation (25%)**
- Unique behavior detection algorithms
- AI-powered personalized interventions
- Privacy-first analytics

✅ **Technical Excellence (25%)**
- Efficient IndexedDB usage
- Real-time monitoring without performance impact
- Clean architecture & TypeScript types

✅ **User Value (25%)**
- Measurable behavior improvement
- Actionable insights
- Non-intrusive interventions

✅ **Completeness (15%)**
- All features implemented
- Comprehensive testing
- Documentation complete

✅ **Polish (10%)**
- Beautiful UI/UX
- Smooth animations
- Professional reports

---

## 10. Next Steps

### Immediate Actions (Week 1)

1. ✅ **Review this documentation** with team
2. ⬜ **Implement core storage layers** (BehaviorStorage, RemarkStorage)
3. ⬜ **Build background monitoring service**
4. ⬜ **Create basic analytics dashboard UI**
5. ⬜ **Implement one detector** (DoomscrollDetector as proof of concept)

### Week 2 Goals

1. ⬜ Complete all detectors
2. ⬜ Implement notification system
3. ⬜ Build full analytics UI
4. ⬜ Add remarks functionality

### Week 3 Goals

1. ⬜ Report generation
2. ⬜ AI integration for insights
3. ⬜ Polish & testing
4. ⬜ Demo preparation

---

## 📚 Additional Resources

- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Chrome Notifications API](https://developer.chrome.com/docs/extensions/reference/notifications/)
- [Gemini Nano Documentation](https://developer.chrome.com/docs/ai/built-in)
- [Chart.js for visualizations](https://www.chartjs.org/)

---

**Last Updated:** October 16, 2025  
**Document Version:** 1.0  
**Status:** 📋 Planning Phase - Ready for Implementation
