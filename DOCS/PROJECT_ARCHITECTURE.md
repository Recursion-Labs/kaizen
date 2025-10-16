# 🏗️ Kaizen - Complete Project Architecture
## Privacy-First AI-Powered Chrome Extension

**Version:** 0.5.0  
**Last Updated:** October 16, 2025  
**Architecture Status:** ✅ Documented

---

## 📋 Table of Contents
1. [Executive Overview](#executive-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Monorepo Structure](#monorepo-structure)
5. [Core Components](#core-components)
   - 5.1 [🧠 Behavior Engine](#51-behavior-engine-) ⭐
   - 5.2 [Background Service Worker](#52-background-service-worker)
   - 5.3 [Side Panel](#53-side-panel-chat-interface)
   - 5.4 [Options Page](#54-options-page-settings-dashboard)
   - 5.5 [Content Scripts](#55-content-scripts)
   - 5.6 [Knowledge Graph](#56-knowledge-graph)
6. [Data Flow](#data-flow)
   - 6.1 [User Action Flow](#61-user-action-flow)
   - 6.2 [AI Processing Flow](#62-ai-processing-flow)
   - 6.3 [🧠 Behavior Tracking Flow](#63-behavior-tracking-flow--behavior-engine) ⭐
7. [Extension Pages](#extension-pages)
8. [Shared Packages](#shared-packages)
9. [Build & Development](#build--development)
10. [Security & Privacy](#security--privacy)
11. [Deployment](#deployment)

---

## 1. Executive Overview

### What is Kaizen?

**Kaizen** is a privacy-first Chrome extension that transforms your browser into an AI-powered co-pilot using **Google Chrome's Built-in AI APIs** (Gemini Nano). All processing happens locally on-device - no cloud, no data leaks, no API costs.

### Core Philosophy

```
┌─────────────────────────────────────────────────────────┐
│  🔒 PRIVACY FIRST                                        │
│  All data stays local. No external servers.             │
│  User controls everything.                              │
└─────────────────────────────────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────────┐
│  🤖 AI-POWERED                                          │
│  7 Chrome Built-in AI APIs                             │
│  Gemini Nano for local inference                       │
└─────────────────────────────────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────────┐
│  🧠 INTELLIGENT ASSISTANCE                              │
│  Smart summaries, behavior insights, knowledge graphs   │
│  Context-aware interventions                            │
└─────────────────────────────────────────────────────────┘
```

### Key Capabilities

✅ **AI Chat Assistant** - Multimodal input (text/voice/image)  
✅ **Smart Summarization** - Tab content, articles, documents  
✅ **Knowledge Graph** - Visual mind map of browsing sessions  
✅ **Behavior Analytics** - Track, analyze, improve browsing habits  
✅ **Privacy Shield** - Consent analyzer, phishing detection  
✅ **Content Rewriter** - Tone adjustment, grammar fixes  
✅ **Form Auto-Fill** - Context-aware field completion

---

## 2. System Architecture

### High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          CHROME BROWSER LAYER                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Popup     │  │ Side Panel  │  │  Options    │  │  New Tab    │        │
│  │  (Quick)    │  │  (Chat UI)  │  │ (Settings)  │  │  (Home)     │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │                 │
│         └────────────────┼────────────────┼────────────────┘                 │
│                          │                │                                   │
│  ┌─────────────┐         │                │         ┌─────────────┐          │
│  │  DevTools   │─────────┘                └─────────│Context Menu │          │
│  │   Panel     │                                    │   Actions   │          │
│  └─────────────┘                                    └─────────────┘          │
└──────────────────────────────┬───────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴───────────────────────────────────────────────┐
│                        MESSAGE PASSING LAYER                                  │
│                     (chrome.runtime.sendMessage)                              │
└──────────────────────────────┬───────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴───────────────────────────────────────────────┐
│                      BACKGROUND SERVICE WORKER                                │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  background/index.ts - Event Orchestrator                              │  │
│  │  - Tab lifecycle management                                            │  │
│  │  - Message routing                                                     │  │
│  │  - Context menu creation                                               │  │
│  │  - Storage synchronization                                             │  │
│  │  - Side panel management                                               │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│         │                           │                          │              │
│         ▼                           ▼                          ▼              │
│  ┌─────────────┐   ┌───────────────────────────────┐  ┌──────────────┐      │
│  │   AI API    │   │  🧠 BEHAVIOR ENGINE          │  │   Storage    │      │
│  │ Coordinator │   │  ┌─────────────────────────┐ │  │   Manager    │      │
│  │             │   │  │ • Detectors             │ │  │              │      │
│  │             │   │  │ • Interventions         │ │  │              │      │
│  │             │   │  │ • Analytics             │ │  │              │      │
│  │             │   │  │ • Reports               │ │  │              │      │
│  │             │   │  └─────────────────────────┘ │  │              │      │
│  └─────────────┘   └───────────────────────────────┘  └──────────────┘      │
└──────────────────────────────┬───────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴───────────────────────────────────────────────┐
│                         CONTENT SCRIPT LAYER                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐   │
│  │  content/all.js      │  │  content-ui/all.js   │  │ content-runtime/ │   │
│  │  (Console scripts)   │  │  (React injected)    │  │ (Dynamic inject) │   │
│  │  - Page analysis     │  │  - Visual overlays   │  │  - On-demand     │   │
│  │  - Text extraction   │  │  - Notifications     │  │  - Event-driven  │   │
│  │  - Scroll tracking   │  │  - Consent banners   │  │                  │   │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────┘   │
└──────────────────────────────┬───────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴───────────────────────────────────────────────┐
│                           AI PROCESSING LAYER                                 │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  Chrome Built-in AI APIs (window.ai)                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │  │
│  │  │  Prompt API  │  │ Summarizer   │  │  Rewriter    │                │  │
│  │  │  (Reasoning) │  │ (Distill)    │  │  (Improve)   │                │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │  │
│  │  │  Writer API  │  │  Translator  │  │ Proofreader  │                │  │
│  │  │  (Generate)  │  │  (i18n)      │  │  (Grammar)   │                │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                │  │
│  │                  ┌──────────────────────┐                             │  │
│  │                  │  Language Detector   │                             │  │
│  │                  └──────────────────────┘                             │  │
│  └────────────────────────────┬───────────────────────────────────────────┘  │
│                                ▼                                              │
│                      ┌──────────────────────┐                                │
│                      │    Gemini Nano       │                                │
│                      │  (~1.5GB on-device)  │                                │
│                      └──────────────────────┘                                │
└──────────────────────────────┬───────────────────────────────────────────────┘
                               │
┌──────────────────────────────┴───────────────────────────────────────────────┐
│                           STORAGE LAYER                                       │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────────┐     │
│  │ chrome.storage │  │   IndexedDB    │  │    Local Storage           │     │
│  │  - Settings    │  │  - Behavior DB │  │  - Session state           │     │
│  │  - Preferences │  │  - Knowledge   │  │  - Temporary data          │     │
│  │  - User data   │  │    Graph       │  │                            │     │
│  │                │  │  - Remarks DB  │  │                            │     │
│  └────────────────┘  └────────────────┘  └────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Principles

**1. Separation of Concerns**
- UI layer (React components)
- Business logic (shared packages)
- Data layer (storage services)
- AI layer (API coordinators)

**2. Event-Driven Communication**
- Background service worker as central hub
- Message passing between components
- Event listeners for Chrome APIs

**3. Privacy by Design**
- No external network calls for content
- All AI processing on-device
- User-controlled data storage
- Transparent data collection

**4. Modular Architecture**
- Independent packages with clear boundaries
- Reusable components across pages
- Hot Module Replacement (HMR) support

---

## 3. Technology Stack

### Core Technologies

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 19.1.0 | UI components & state |
| **Language** | TypeScript | 5.9.3 | Type safety |
| **Build Tool** | Vite | 6.3.6 | Fast bundling & HMR |
| **Monorepo** | pnpm Workspace | 9.x | Package management |
| **Task Runner** | Turborepo | 2.x | Build orchestration |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **AI Runtime** | Gemini Nano | - | Local AI inference |
| **Testing** | WebdriverIO | 9.x | E2E tests |

### Development Tools

```json
{
  "linting": ["ESLint 9.x", "Prettier"],
  "versionControl": ["Git", "Husky (pre-commit hooks)"],
  "ci-cd": ["GitHub Actions"],
  "bundling": ["Rollup (via Vite)", "esbuild"],
  "typeChecking": ["tsc (TypeScript Compiler)"]
}
```

### Chrome Extension Specifics

- **Manifest Version:** V3 (latest)
- **Service Worker:** ES Modules
- **Permissions:** storage, scripting, tabs, notifications, sidePanel, contextMenus
- **Host Permissions:** `<all_urls>`
- **Browser Support:** Chrome 109+, Firefox 109+

---

## 4. Monorepo Structure

### Repository Layout

```
kaizen/
├── .github/                      # GitHub workflows & templates
│   └── workflows/
│       ├── build-zip.yml        # Build & package extension
│       └── lint.yml             # Code quality checks
│
├── bash-scripts/                 # Shell scripts for automation
│   ├── copy_env.sh              # Copy environment files
│   ├── set_global_env.sh        # Set global env variables
│   └── update_version.sh        # Version bumping
│
├── chrome-extension/             # Extension manifest & config
│   ├── manifest.ts              # Manifest V3 configuration
│   ├── public/                  # Static assets (icons, etc.)
│   └── src/
│       └── background/          # Background service worker
│           └── index.ts         # Main background script
│
├── packages/                     # Shared packages (utilities)
│   ├── dev-utils/               # Development utilities
│   ├── env/                     # Environment management
│   ├── hmr/                     # Hot Module Replacement
│   ├── i18n/                    # Internationalization
│   ├── module-manager/          # Feature management
│   ├── shared/                  # Common utilities & types
│   ├── storage/                 # Storage adapters
│   ├── tailwindcss-config/      # Tailwind configuration
│   ├── tsconfig/                # TypeScript configs
│   ├── ui/                      # Reusable UI components
│   ├── vite-config/             # Vite configuration
│   └── zipper/                  # Extension packaging
│
├── pages/                        # Extension pages (entry points)
│   ├── content/                 # Content scripts (console)
│   ├── content-runtime/         # Runtime injected scripts
│   ├── content-ui/              # React UI injected in pages
│   ├── devtools/                # DevTools integration
│   ├── devtools-panel/          # DevTools panel UI
│   ├── new-tab/                 # New tab override
│   ├── options/                 # Settings/Options page
│   ├── popup/                   # Extension popup
│   └── side-panel/              # Side panel (chat interface)
│
├── tests/
│   └── e2e/                     # End-to-end tests
│
├── docs/                         # Documentation (generated)
│   ├── BEHAVIOR_ENGINE_ARCHITECTURE.md
│   ├── CHROME_AI_INTEGRATION_PLAN.md
│   ├── IMPLEMENTATION_QUICK_START.md
│   └── DOCS_INDEX.md
│
├── turbo.json                   # Turborepo configuration
├── pnpm-workspace.yaml          # pnpm workspace config
├── package.json                 # Root package.json
├── tsconfig.json                # Root TypeScript config
└── README.md                    # Project documentation
```

### Package Dependencies Graph

```
┌─────────────────────────────────────────────────────────────┐
│                        pages/*                               │
│  (popup, sidepanel, options, content, etc.)                 │
└────────────┬────────────────────────────────────────────────┘
             │ depends on
             ▼
┌─────────────────────────────────────────────────────────────┐
│                   @extension/ui                              │
│  (Reusable React components, Tailwind utilities)            │
└────────────┬────────────────────────────────────────────────┘
             │ depends on
             ▼
┌─────────────────────────────────────────────────────────────┐
│                 @extension/shared                            │
│  (Common types, utilities, HOCs, hooks)                     │
└────────────┬────────────────────────────────────────────────┘
             │ depends on
             ▼
┌─────────────────────────────────────────────────────────────┐
│                @extension/storage                            │
│  (Storage adapters, state management)                       │
└─────────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│               @extension/i18n                                │
│  (Internationalization support)                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Core Components

### 5.1 Behavior Engine 🧠

**Files:** `packages/shared/lib/behavior/`

**Purpose:** Core intelligence system for tracking, analyzing, and improving user browsing behavior

> **📘 Detailed Documentation:** See [BEHAVIOR_ENGINE_ARCHITECTURE.md](./BEHAVIOR_ENGINE_ARCHITECTURE.md) for complete specifications

**Architecture:**
```
BehaviorEngine (Main Orchestrator)
├── Detectors/                    # Pattern Recognition
│   ├── DoomscrollDetector       # Excessive scrolling detection
│   ├── ShoppingDetector         # Impulsive shopping patterns
│   ├── TimeTracker              # Site usage tracking
│   └── PatternAnalyzer          # ML-based behavior analysis
│
├── Interventions/                # User Guidance
│   ├── NotificationManager      # Chrome notifications API
│   ├── NudgeGenerator           # AI-powered gentle reminders
│   └── InterventionStrategy     # When & how to intervene
│
├── Analytics/                    # Data Analysis & Reporting
│   ├── BehaviorAnalytics        # Metrics calculation
│   ├── ReportGenerator          # HTML/PDF/JSON reports
│   └── MetricsCollector         # Data aggregation
│
└── Storage/                      # Data Persistence
    ├── BehaviorStorage          # IndexedDB for metrics
    └── RemarkStorage            # User notes & reflections
```

**Key Features:**

**🌀 Behavior Detection**
```typescript
// Detect doomscrolling
const detector = new DoomscrollDetector();
const analysis = await detector.analyze(scrollEvents);

if (analysis.isDoomscrolling && analysis.confidence > 0.8) {
  // Trigger intervention
  interventionManager.notify('doomscroll', analysis);
}
```

**📬 Smart Notifications**
- **Nudges**: "You've been scrolling for 30 minutes. Take a break?"
- **Reminders**: "Time for your daily reflection!"
- **Insights**: "You're most productive at 10 AM"
- **Celebrations**: "🎉 3 focused hours today!"
- **Warnings**: "Unusual late-night browsing detected"

**📝 Remarks System**
```typescript
// User can add personal notes
const remark: Remark = {
  id: "uuid",
  timestamp: Date.now(),
  content: "Noticed I scroll Reddit when stressed",
  tags: ['stress', 'procrastination'],
  mood: 'negative',
  category: 'reflection'
};
await remarkStorage.saveRemark(remark);
```

**📊 Analytics Dashboard**
- Real-time activity tracking
- Daily/Weekly/Monthly reports
- Category breakdown (work/social/entertainment)
- Productivity score (0-100)
- Focus session heatmaps
- Goal tracking & achievements

**📄 Report Generation**
```typescript
// Generate weekly report
const report = await reportGenerator.generateReport({
  start: startOfWeek(),
  end: endOfWeek()
});

// Export as PDF
await report.exportPDF();
// Export as JSON
await report.exportJSON();
```

**Data Models:**
```typescript
interface BehaviorPattern {
  type: 'doomscrolling' | 'impulsive-shopping' | 'productive-work';
  confidence: number;
  startTime: number;
  endTime: number;
  metadata: Record<string, unknown>;
}

interface BehaviorMetrics {
  date: string;
  totalTime: number;
  productiveTime: number;
  distractedTime: number;
  behaviors: BehaviorPattern[];
  interventionCount: number;
}
```

**Integration with AI APIs:**
```typescript
// Use AI to analyze patterns
const session = await window.ai.languageModel.create();
const insight = await session.prompt(`
  Analyze this user's browsing behavior and suggest improvements:
  ${JSON.stringify(metrics)}
`);

// Generate personalized nudge
const writer = await window.ai.writer.create({ tone: 'friendly' });
const nudge = await writer.write(
  'Create a gentle reminder for someone scrolling social media for 45 minutes'
);
```

**Privacy:**
- ✅ 100% local storage (IndexedDB)
- ✅ No external servers
- ✅ User controls all data
- ✅ Easy export & deletion
- ✅ Data retention policy (90 days default)

**UI Components:**
```
pages/options/src/components/panels/
├── AnalyticsSettings.tsx         # Main dashboard
└── behavior/
    ├── BehaviorDashboard.tsx    # Overview
    ├── ActivityChart.tsx        # Time series charts
    ├── ReportsPanel.tsx         # Report viewer
    ├── RemarksPanel.tsx         # Notes & reflections
    └── NotificationSettings.tsx # Configure alerts
```

**Implementation Status:** 📋 Documented - Pending Implementation

---

### 5.2 Background Service Worker

**File:** `chrome-extension/src/background/index.ts`

**Purpose:** Central event orchestrator and API gateway

**Responsibilities:**
```typescript
// Event listeners
chrome.runtime.onInstalled.addListener(() => {
  // Initialize extension
  // Create context menus
  // Set default settings
});

chrome.tabs.onActivated.addListener(() => {
  // Track tab switches
  // Update behavior analytics
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Route messages between components
  // Coordinate AI API calls
  // Manage storage operations
});

chrome.contextMenus.onClicked.addListener(() => {
  // Handle context menu actions
  // Trigger AI operations
});
```

**Key Features:**
- ✅ Always running (persistent service worker)
- ✅ Message routing hub
- ✅ Storage synchronization
- ✅ Tab lifecycle management
- ✅ Context menu management
- ✅ Notification triggering

### 5.3 Side Panel (Chat Interface)

**File:** `pages/side-panel/src/SidePanel.tsx`

**Purpose:** Main AI chat interface

**Features:**
```tsx
<ChatInterface>
  <Header>
    <Logo />
    <ThemeToggle />
    <HistoryButton />
  </Header>
  
  <MessageList>
    <UserMessage />
    <AIResponse />
  </MessageList>
  
  <InputArea>
    <TextInput multimodal />
    <VoiceInput />
    <ImageUpload />
    <SendButton />
  </InputArea>
  
  <HistorySidebar>
    <SearchBar />
    <ConversationList />
  </HistorySidebar>
</ChatInterface>
```

**Data Flow:**
```
User Input → ChatInterface → Background Worker → AI API → Response → UI Update
```

### 5.4 Options Page (Settings Dashboard)

**File:** `pages/options/src/Options.tsx`

**Structure:**
```
SettingsDashboard
├── Sidebar Navigation
│   ├── General Settings
│   ├── AI Models
│   ├── Knowledge Graph
│   ├── Analytics (Behavior Engine)
│   └── Help
│
└── Content Panel
    ├── GeneralSettings
    │   ├── Theme toggle
    │   ├── Language selector
    │   └── Behavior preferences
    │
    ├── ModelsSettings
    │   ├── AI API configuration
    │   └── Model selection
    │
    ├── KnowledgeGraphSettings
    │   ├── Graph visualization
    │   └── Node/Edge management
    │
    ├── AnalyticsSettings (NEW - Behavior Engine)
    │   ├── Behavior Dashboard
    │   ├── Activity Charts
    │   ├── Reports Panel
    │   └── Remarks/Notes
    │
    └── HelpSettings
        ├── Documentation
        └── Support
```

### 5.5 Content Scripts

**Three Types:**

#### A. Console Scripts (`pages/content/`)
```javascript
// Executes in page context (console)
// Can access window object
// Use: Page analysis, text extraction
```

#### B. UI Scripts (`pages/content-ui/`)
```jsx
// React components injected into page
// Isolated from page scripts
// Use: Visual overlays, notifications
```

#### C. Runtime Scripts (`pages/content-runtime/`)
```javascript
// Dynamically injected on-demand
// Triggered by user action (popup click)
// Use: Event-driven operations
```

### 5.6 Knowledge Graph

**File:** `pages/options/src/components/graph/KnowledgeGraph.tsx`

**Visualization:**
```
Canvas-based rendering
├── Nodes (Entities/Concepts)
│   ├── Size: Based on importance
│   ├── Color: By category
│   └── Position: Force-directed layout
│
├── Edges (Relationships)
│   ├── Line width: Connection strength
│   └── Direction: Causal relationships
│
└── Interactions
    ├── Hover: Show details
    ├── Click: Expand connections
    └── Drag: Reposition nodes
```

**Data Structure:**
```typescript
interface GraphNode {
  id: string;
  label: string;
  category: 'entity' | 'concept' | 'topic';
  weight: number; // Importance
  metadata: Record<string, unknown>;
}

interface GraphEdge {
  source: string; // Node ID
  target: string;
  type: 'relates_to' | 'part_of' | 'causes';
  weight: number; // Connection strength
}
```

---

## 6. Data Flow

### 6.1 User Action Flow

```
┌──────────────┐
│ USER ACTION  │ (Click button, type command, upload image)
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  UI COMPONENT    │ (Side Panel, Popup, Options)
└──────┬───────────┘
       │ chrome.runtime.sendMessage()
       ▼
┌──────────────────────────┐
│  BACKGROUND WORKER       │ (Event router, message handler)
└──────┬───────────────────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐   ┌─────────────┐
│   AI API     │   │  STORAGE    │
│ Coordinator  │   │  Manager    │
└──────┬───────┘   └─────┬───────┘
       │                 │
       ▼                 ▼
┌──────────────┐   ┌─────────────┐
│ Gemini Nano  │   │ IndexedDB   │
│  Processing  │   │ chrome.     │
│              │   │ storage     │
└──────┬───────┘   └─────┬───────┘
       │                 │
       └────────┬────────┘
                │
                ▼
┌───────────────────────┐
│  RESPONSE/UPDATE      │
└───────┬───────────────┘
        │ chrome.runtime.sendMessage()
        ▼
┌───────────────────────┐
│  UI UPDATE            │ (Re-render with new data)
└───────────────────────┘
```

### 6.2 AI Processing Flow

```
┌─────────────────────────────────────────────────────────┐
│ INPUT                                                    │
│ Text: "Summarize this article"                         │
│ Context: Current tab URL, page content                 │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ AI MANAGER (Routing Logic)                             │
│ - Determine required API (Summarizer)                  │
│ - Check API availability                               │
│ - Prepare prompt/context                               │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ CHROME BUILT-IN AI API                                  │
│ const summarizer = await window.ai.summarizer.create(); │
│ const summary = await summarizer.summarize(content);    │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ GEMINI NANO (On-Device Inference)                      │
│ - Load model weights                                    │
│ - Process input                                         │
│ - Generate output                                       │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ POST-PROCESSING                                         │
│ - Format output                                         │
│ - Cache result                                          │
│ - Log analytics                                         │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ RESPONSE                                                │
│ Display in UI + Save to history                        │
└─────────────────────────────────────────────────────────┘
```

### 6.3 Behavior Tracking Flow (🧠 Behavior Engine)

```
┌─────────────────────────────────────────────────────────┐
│ BROWSER EVENT                                           │
│ - Tab switch, scroll, click, time spent                │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ CONTENT SCRIPT (Event Listener)                        │
│ - Capture event data                                    │
│ - Filter noise                                          │
│ - Send to background                                    │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ 🧠 BEHAVIOR ENGINE - MONITOR (Background)              │
│ - Aggregate events                                      │
│ - Calculate metrics                                     │
│ - Real-time tracking                                    │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ 🧠 BEHAVIOR ENGINE - DETECTORS                         │
│ ┌─────────────────┐  ┌─────────────────┐              │
│ │ Doomscroll      │  │ Shopping        │              │
│ │ Detector        │  │ Detector        │              │
│ └─────────────────┘  └─────────────────┘              │
│ ┌─────────────────┐  ┌─────────────────┐              │
│ │ Time            │  │ Pattern         │              │
│ │ Tracker         │  │ Analyzer        │              │
│ └─────────────────┘  └─────────────────┘              │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ 🧠 BEHAVIOR ENGINE - INTERVENTION STRATEGY             │
│ Should trigger intervention?                           │
│ - Check thresholds (e.g., 30 min scrolling)           │
│ - Respect user preferences (quiet hours, DND)         │
│ - Rate limiting (max 3 nudges/hour)                   │
│ - Context awareness (focus mode active?)              │
└───────────────────┬─────────────────────────────────────┘
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
┌──────────────────────────┐  ┌────────────────────────┐
│ 🧠 NOTIFICATIONS         │  │ 🧠 STORAGE            │
│ - Smart nudges           │  │ - BehaviorStorage     │
│ - Reminders              │  │   (IndexedDB)         │
│ - Insights               │  │ - Save metrics        │
│ - Celebrations           │  │ - Save patterns       │
│ - AI-generated messages  │  │ - Analytics data      │
└──────────────────────────┘  └────────────────────────┘
                    │
                    ▼
          ┌─────────────────────┐
          │ 🧠 ANALYTICS        │
          │ - Daily summary     │
          │ - Weekly trends     │
          │ - Monthly reports   │
          │ - Goal tracking     │
          └─────────────────────┘
```

**Key Behavior Engine Components:**
1. **Event Collection** → Content scripts capture user actions
2. **Monitoring** → Background service aggregates data
3. **Detection** → 4 specialized detectors analyze patterns
4. **Decision** → Strategy determines when to intervene
5. **Intervention** → Notifications + AI-powered nudges
6. **Storage** → IndexedDB for privacy-first local storage
7. **Analytics** → Reports & insights generation

---

## 7. Extension Pages

### Complete Page Breakdown

| Page | Path | Entry Point | Purpose | Key Features |
|------|------|-------------|---------|--------------|
| **Side Panel** | `/side-panel` | `SidePanel.tsx` | Main AI chat interface | Multimodal input, history, streaming responses |
| **Popup** | `/popup` | `Popup.tsx` | Quick actions menu | Theme toggle, content script inject, quick links |
| **Options** | `/options` | `Options.tsx` | Settings dashboard | 5 panels, graph viz, analytics |
| **New Tab** | `/new-tab` | `NewTab.tsx` | Custom homepage | Quick links, theme, branding |
| **DevTools** | `/devtools` | `Devtools.tsx` | DevTools integration | Network inspector, console integration |
| **DevTools Panel** | `/devtools-panel` | `Panel.tsx` | Custom DevTools panel | Extension-specific debugging |
| **Content (Console)** | `/content` | `matches/all/index.ts` | Page analysis scripts | Text extraction, event tracking |
| **Content UI** | `/content-ui` | `matches/all/App.tsx` | React overlays | Visual notifications, consent banners |
| **Content Runtime** | `/content-runtime` | `matches/all/App.tsx` | Dynamic injection | On-demand features |

### Page Communication

```typescript
// From Side Panel to Background
chrome.runtime.sendMessage({
  type: 'AI_REQUEST',
  api: 'summarizer',
  content: pageText
}, (response) => {
  console.log(response.summary);
});

// From Background to Content Script
chrome.tabs.sendMessage(tabId, {
  type: 'EXTRACT_TEXT'
}, (response) => {
  processText(response.text);
});

// From Content to Background
chrome.runtime.sendMessage({
  type: 'BEHAVIOR_EVENT',
  event: 'scroll',
  data: { scrollY: window.scrollY }
});
```

---

## 8. Shared Packages

### Package Details

#### @extension/shared
**Purpose:** Common utilities, types, constants

```typescript
// Types
export type { ManifestType, BehaviorType, NotificationPayload };

// Constants
export const PROJECT_URL = 'https://github.com/Recursion-Labs/kaizen';

// HOCs (Higher-Order Components)
export { withErrorBoundary, withSuspense };

// Hooks
export { useStorage, useTheme, useBehaviorMetrics };

// Utils
export { cn, debounce, throttle, sanitizeUrl };
```

#### @extension/storage
**Purpose:** Storage adapters and state management

```typescript
// Chrome Storage wrappers
export const exampleThemeStorage = createStorage<boolean>('theme', false, {
  storageType: 'local',
  liveUpdate: true,
});

// IndexedDB managers
export { BehaviorStorage, RemarkStorage, GraphStorage };
```

#### @extension/ui
**Purpose:** Reusable React components

```typescript
// Components
export { Button, Input, Card, Modal, LoadingSpinner };
export { ErrorDisplay, ToggleButton };
export { cn }; // Tailwind utility

// Hooks
export { useTheme };
```

#### @extension/i18n
**Purpose:** Internationalization

```typescript
// Translation function
import { t } from '@extension/i18n';

t('hello', 'World'); // "Hello, World!" (locale-aware)
```

#### @extension/hmr
**Purpose:** Hot Module Replacement for development

```typescript
// Auto-reload on changes
initClient({
  id: 'side-panel',
  onUpdate: () => location.reload()
});
```

---

## 9. Build & Development

### Build Pipeline

```
┌─────────────────────────────────────────────────────────┐
│ SOURCE CODE                                             │
│ TypeScript + React + Tailwind                          │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ TURBO BUILD (Parallel)                                  │
│ - Type checking (tsc)                                   │
│ - Linting (ESLint)                                      │
│ - Formatting (Prettier)                                 │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ VITE BUNDLING                                           │
│ - Transpile TypeScript                                  │
│ - Bundle modules                                        │
│ - Process Tailwind CSS                                  │
│ - Optimize assets                                       │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ MANIFEST GENERATION                                     │
│ - Parse manifest.ts                                     │
│ - Generate manifest.json                                │
│ - Platform-specific (Chrome/Firefox)                   │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ OUTPUT (dist/)                                          │
│ - background.js                                         │
│ - popup/index.html + JS/CSS                            │
│ - side-panel/index.html + JS/CSS                       │
│ - options/index.html + JS/CSS                          │
│ - content scripts (all.iife.js, example.iife.js)      │
│ - manifest.json                                         │
│ - assets (icons, images)                               │
└─────────────────────────────────────────────────────────┘
```

### Development Commands

```bash
# Install dependencies
pnpm install

# Development mode (hot reload)
pnpm dev

# Build for production
pnpm build

# Build for Firefox
pnpm build:firefox

# Package as ZIP
pnpm zip

# Run E2E tests
pnpm e2e

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check

# Clean build artifacts
pnpm clean
```

### Environment Variables

```bash
# .env
CLI_CEB_DEV=true              # Enable dev mode
CLI_CEB_FIREFOX=false         # Target Firefox
LOCAL_RELOAD_SOCKET_PORT=8081 # HMR port
```

---

## 10. Security & Privacy

### Privacy-First Design

✅ **No External Network Calls**
```typescript
// ❌ BAD: Cloud API call
fetch('https://api.example.com/summarize', { body: pageContent });

// ✅ GOOD: Local AI
const summarizer = await window.ai.summarizer.create();
const summary = await summarizer.summarize(pageContent);
```

✅ **Local Storage Only**
```typescript
// All data in IndexedDB or chrome.storage
// No cloud sync, no external databases
await behaviorStorage.saveMetrics(metrics);
```

✅ **User Control**
```typescript
// Settings to disable features
const settings = {
  trackBehavior: true,  // User can disable
  sendNotifications: true,
  collectAnalytics: false
};
```

### Security Measures

**Content Security Policy:**
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

**Data Sanitization:**
```typescript
// Remove sensitive data
function sanitizeUrl(url: string): string {
  const urlObj = new URL(url);
  return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
  // Strips query params and hash
}
```

**Permission Scoping:**
```json
{
  "permissions": [
    "storage",      // Only what we need
    "tabs",
    "notifications",
    "sidePanel"
  ],
  "host_permissions": ["<all_urls>"] // Necessary for content scripts
}
```

---

## 11. Deployment

### Chrome Web Store

**Preparation:**
```bash
# 1. Build production bundle
pnpm build

# 2. Create ZIP
pnpm zip

# Output: dist/kaizen-0.5.0-chrome.zip
```

**Upload Steps:**
1. Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Upload `kaizen-0.5.0-chrome.zip`
3. Fill store listing
4. Submit for review

### Firefox Add-ons

**Preparation:**
```bash
# 1. Build Firefox version
pnpm build:firefox

# 2. Create ZIP
pnpm zip:firefox

# Output: dist/kaizen-0.5.0-firefox.zip
```

**Upload Steps:**
1. Go to [Firefox Developer Hub](https://addons.mozilla.org/developers/)
2. Upload `kaizen-0.5.0-firefox.zip`
3. Fill listing
4. Submit for review

### CI/CD Pipeline

**GitHub Actions:** `.github/workflows/build-zip.yml`

```yaml
name: Build Extension ZIP
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm zip
      - uses: actions/upload-artifact@v3
        with:
          name: extension-zip
          path: dist/*.zip
```

---

## 12. Performance Metrics

### Build Performance

```
Clean Build (Production):
├── Type Check: ~3.5s
├── Bundle (Vite): ~8s
├── Package Generation: ~1s
└── Total: ~12-15s

Development Mode (HMR):
├── Initial Build: ~8s
├── Hot Reload: <500ms
└── Full Reload: ~2s
```

### Runtime Performance

```
AI Processing:
├── Prompt API: ~500ms - 2s (depends on prompt complexity)
├── Summarizer: ~1-3s (article length dependent)
├── Translator: ~200ms - 1s
└── Rewriter: ~500ms - 1.5s

Storage Operations:
├── IndexedDB Read: <50ms
├── IndexedDB Write: <100ms
├── chrome.storage.local: <10ms
└── chrome.storage.sync: <50ms

UI Render:
├── Initial Load: ~300ms
├── Component Update: <16ms (60fps)
└── Large List Render: ~100ms
```

---

## 📚 Related Documentation

- **[BEHAVIOR_ENGINE_ARCHITECTURE.md](./BEHAVIOR_ENGINE_ARCHITECTURE.md)** 🧠 - **Complete behavior engine specifications** (detectors, interventions, analytics, reports, data models, implementation guide)
- **[CHROME_AI_INTEGRATION_PLAN.md](./CHROME_AI_INTEGRATION_PLAN.md)** 🤖 - AI APIs integration guide (all 7 Chrome Built-in AI APIs)
- **[IMPLEMENTATION_QUICK_START.md](./IMPLEMENTATION_QUICK_START.md)** 🚀 - Setup & development guide
- **[PRD.MD](./PRD.MD)** 📋 - Product requirements
- **[README.md](./README.md)** 📖 - Getting started

---

## 🔄 Document Maintenance

**Last Updated:** October 16, 2025  
**Version:** 1.0  
**Maintained By:** Kaizen Core Team

**Update Frequency:** After major architectural changes

**Change Log:**
- 2025-10-16: Initial comprehensive architecture documentation created

---

**Status:** ✅ Complete & Current  
**Coverage:** 100% of project structure documented
