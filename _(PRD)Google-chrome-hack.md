# **🧩 Product Requirements Document (PRD)**

## **🏷️ Name**

**\[To Be Decided by Team\]**  
 *(Hint: something like “MindPilot,” “NeuraChrome,” “Orbit,” or “Spectra” could fit later.)*

---

## **🧠 Problem**

Despite the rise of AI browsers, **people still don’t trust them**.

They fear:

* 🧾 **Data misuse:** Every command, every context, every search sent to a server.

* 🤖 **Lack of control:** AI deciding what to open or read, often unpredictably.

* ⚙️ **Overhead and lag:** Cloud-based inference makes interactions slow.

* 🧍 **Adaptation resistance:** Users are reluctant to switch browsers or learn entirely new UX flows.

**The result:**  
 Even in 2025, people stick to Chrome — the most powerful but least intelligent browser.

---

## **💡 Our Solution**

We’re not asking users to switch browsers.  
 We’re turning **their Chrome into an AI-powered browsing brain** — locally, safely, and privately — powered by **Gemini Nano and Chrome Built-in AI APIs**.

Our extension will act as an **autonomous co-pilot** that:

* Understands what you’re doing

* Helps you navigate, research, organize, and protect yourself

* Learns context *without ever leaving your device*

Think of it as a **locally running, privacy-safe Comet \+ Arc \+ Copilot** — all merged into Chrome.

---

## **🧭 Core Vision**

A Chrome extension that:

1. **Understands your browsing intent** (via on-page semantic parsing)

2. **Acts through natural voice or typed commands**

3. **Automates complex browsing actions**

4. **Protects you from prompt injections and unsafe content**

5. **Builds a real-time knowledge graph** of your research & thoughts

6. **Improves your digital wellness** through behavioral awareness

7. **Runs entirely locally** on Gemini Nano — no server calls.

---

## **⚙️ System Architecture (Simplified)**

`┌────────────────────────────┐`  
`│ Chrome Extension Frontend  │`  
`│ - Popup UI (Voice + Text)  │`  
`│ - Side Panel for Graph UI  │`  
`│ - Context Menu Actions     │`  
`└──────────────┬─────────────┘`  
               `│`  
               `▼`  
`┌────────────────────────────┐`  
`│ AI Command Layer (Prompt API + Voice API) │`  
`│ Parses natural commands → structured tasks │`  
`│ e.g., “Group research tabs” → {action: "groupTabs", topic: "research"} │`  
`└──────────────┬─────────────┘`  
               `│`  
               `▼`  
`┌────────────────────────────┐`  
`│ Local AI Processing Core (Gemini Nano) │`  
`│ - Runs NLP, RAG summaries, and logic    │`  
`│ - Generates knowledge graph embeddings  │`  
`└──────────────┬─────────────┘`  
               `│`  
               `▼`  
`┌────────────────────────────┐`  
`│ Browser Action Controller (Chrome API) │`  
`│ - Tabs, windows, groups, sessions       │`  
`│ - Autofill, navigation, screenshotting  │`  
`└──────────────┬─────────────┘`  
               `│`  
               `▼`  
`┌────────────────────────────┐`  
`│ Behavioral & Privacy Layer │`  
`│ - Doomscrolling detector    │`  
`│ - Prompt injection scanner  │`  
`│ - Consent summarizer        │`  
`└────────────────────────────┘`

---

## **🧱 System Components**

| System | Functionality | Built-in AI APIs Used |
| ----- | ----- | ----- |
| 🧭 **AI Command Layer** | Type or say commands: “Group all coding tabs,” “Summarize this doc,” “Find all research on multimodal AI.” | **Prompt \+ Voice APIs** |
| 🧠 **Research Assistant Mode** | Opens tabs, summarizes, groups by theme, builds RAG-based session knowledge graph for your browsing. | **Summarizer \+ Rewriter APIs** |
| 🔒 **Privacy & Consent Auditor** | Detects cookie banners, terms, or popups → summarizes risk before accepting. | **Summarizer \+ Translator APIs** |
| 🛡️ **Safety Shield** | Scans site text/scripts for prompt injection or phishing attempts → alerts/block. | **Proofreader \+ Summarizer APIs** |
| 🎯 **Behavioral Intervention Engine** | Detects doomscrolling, impulsive shopping, overuse → nudges healthier patterns. | **Writer \+ Rewriter APIs** |
| 🧰 **Form Filler \+ Context Automation** | Auto-fills repetitive fields with locally stored data — no cloud sync. | **Prompt \+ Translator APIs** |
| 🎙️ **Voice Command Interface** | Voice-to-action assistant (“Summarize my active tab,” “Close all Reddit tabs”). | **Prompt API \+ Web Speech API** |
| 🧩 **Knowledge Graph Builder** | Builds evolving RAG graph of browsing session; visual mind map of concepts and connections. | **Summarizer \+ Rewriter APIs** |
| ⚡ **Offline AI Core (Gemini Nano)** | Handles reasoning, RAG generation, summarization locally. | **All client-side APIs** |

---

## **🧪 Example Use Cases**

### **🧠 Research Flow**

**User says:**

“Find all docs related to WebGPU optimization.”  
 **Extension does:**

* Opens 5 docs from top sources

* Summarizes each

* Groups them under “WebGPU Research” tab group

* Builds a local knowledge graph showing relations between terms (e.g., “shader → parallelism → compute pipeline”)

* User can ask: “Show how WebGPU relates to Canvas2D” → Graph highlights link, opens related resource.

---

### **⚙️ Task Automation**

**User says:**

“Fill this contact form with my portfolio info and send.”  
 Extension autofills safely using local data vault → sends → logs completion.

---

### **🛡️ Safety & Behavior**

**User scrolls Reddit for 40 minutes.**  
 Extension detects doomscrolling → overlays a subtle reminder:

“You’ve been here for 40 minutes. Want to pause and summarize what you’ve read?”  
 Option to trigger research summary mode.

---

### **🧩 Knowledge Navigation**

User opens multiple AI browser articles →  
 Extension dynamically links terms: “Gemini Nano,” “Comet,” “Arc Browser” in an interactive sidebar graph →  
 User can explore interconnections, click “Summarize relation between Gemini and Comet’s architecture.”

---

## **🧰 Tech Stack Overview**

| Layer | Tech | Notes |
| ----- | ----- | ----- |
| **Frontend** | HTML, CSS, JS (Manifest V3), React (optional for side panel) | Fast, minimal Chrome UI |
| **Speech Processing** | Web Speech API \+ Prompt API | Converts commands to structured tasks |
| **AI Processing** | Gemini Nano via Chrome Built-in AI APIs | Local reasoning, summarization, rewriting |
| **Storage** | IndexedDB / Chrome Storage | Store graph data, preferences locally |
| **Visualization** | D3.js or Cytoscape.js | For real-time knowledge graph |
| **Security** | Chrome Permissions \+ sandboxed service workers | Maintain user privacy and scope |
| **Behavior Detection** | ML pattern recognition (local JS models) | Detect overuse, habits |

---

## **🌍 Why This Matters**

This project will:

* Pioneer the **first privacy-first AI Chrome layer**

* Transform Chrome into a **context-aware, self-organizing browser**

* Solve the **trust problem** AI browsers face

* Demonstrate **real-world use** of Gemini Nano for on-device intelligence

* Be fully hackathon-feasible (20 days MVP) yet visionary for future scalability.

---

## **🏁 MVP Goals (for Hackathon)**

* Voice \+ text command interface

* Tab grouping and management

* Local summarization (active tab \+ opened group)

* Doomscroll detection \+ behavioral nudge

* Privacy & consent summarizer

* Real-time RAG graph (light version)

##   Resources   [https://developer.chrome.com/docs/extensions/get-started](https://developer.chrome.com/docs/extensions/get-started)    [https://github.com/GoogleChrome/chrome-extensions-samples](https://github.com/GoogleChrome/chrome-extensions-samples)  [https://github.com/darkreader/darkreader](https://github.com/darkreader/darkreader)   [https://github.com/lxieyang/chrome-extension-boilerplate-react](https://github.com/lxieyang/chrome-extension-boilerplate-react)   [https://github.com/nanobrowser/nanobrowser](https://github.com/nanobrowser/nanobrowser)   [https://github.com/AutomaApp/automa](https://github.com/AutomaApp/automa)   [https://github.com/requestly/requestly](https://github.com/requestly/requestly)   [https://github.com/orbitbot/chrome-extensions-examples](https://github.com/orbitbot/chrome-extensions-examples)   https://github.com/learn-anything/chrome-extensions


## Judeing critera


# Functionality
How scalable is the application? How well are the APIs used within the project? Can it be used in other regions, or can it be used by more than one type of audience?

# Purpose
Does your project meaningfully improve a common user journey or task? Does your project unlock a new capability, previously impractical on the web?

# Content
How creative is the application? What’s the visual quality like?

# User Experience
How well executed is the application? Is it easy to use and understand?

# Technological Execution
How well are you showcasing 1 or more of the APIs powered by AI models built into Google Chrome?