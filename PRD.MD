*** Begin Reindexed PRD*

# Kaizen — Product Requirements Document (PRD)

Version: 0.1 — Hackathon MVP
Date: 2025-10-15

Table of contents
1. Objective & Scope
2. Problem Statement
3. Vision & Value Proposition
4. Target Users & Personas
5. System Overview
6. MVP Features (user stories + acceptance criteria)
7. Architecture & Key Components
8. Tech Stack & Non-functional Requirements
9. Roadmap & Milestones
10. Success Metrics & Risks
11. Resources

---

## 1. Objective & Scope

Objective: build a privacy-first Chrome extension that turns Chrome into a locally-run AI co-pilot for browsing (Kaizen). The scope for the hackathon MVP (20 days) focuses on local summarization, basic tab automation, voice/text commands, and a minimal knowledge graph.

In scope for MVP:
- Voice and text command interface (popup)
- Tab grouping and management
- Local summarization for active tab / grouped tabs
- Lightweight RAG knowledge graph visualization (side-panel)
- Doomscroll detection with behavioral nudge
- Privacy & consent summarizer

Out of scope for MVP:
- Cloud sync / account integration
- Full-scale offline LLM training
- Advanced multi-device sync

---

## 2. Problem Statement

People hesitate to use AI browser features due to privacy, lack of control, and latency from cloud inference. Kaizen solves this by providing an on-device, privacy-focused assistant using Gemini Nano and Chrome-built-in AI APIs.

---

## 3. Vision & Value Proposition

Kaizen transforms Chrome into a context-aware assistant that helps research, automates repetitive browsing tasks, and protects users from unsafe content — all without sending their browsing data to remote servers.

Key value props:
- Privacy-first local AI
- Context-aware automation (tabs, groups, navigation)
- Lightweight knowledge graph to surface relationships

---

## 4. Target Users & Personas

Primary users:
- Researchers and knowledge workers who open many tabs and want to synthesize findings quickly
- Power users who automate workflows (tab management, autofill)

Secondary users:
- Privacy-conscious users who want AI assistance without cloud data sharing

---

## 5. System Overview

High-level flow:
- User issues a command (voice or text) in popup → AI Command Layer parses intent → Background/AI service performs actions (tabs, summarize, build graph) → UI updates in popup/side-panel.

Core runtime boundaries:
- UI (popup/side-panel) — React + Vite dev server for development
- Background service worker — message routing and tabs API
- Content scripts — page-level extraction and behavioral monitoring
- Local AI core — Gemini Nano via Chrome Built-in AI APIs (production)

---

## 6. MVP Features (User stories + Acceptance Criteria)

6.1 Voice & Text Command Interface
- Story: As a user, I want to tell Kaizen to "summarize this tab" so I get a short summary without leaving the page.
- Acceptance: Popup accepts text/voice input, returns a 2–4 sentence summary for the active tab.

6.2 Tab Grouping & Management
- Story: As a researcher, I want Kaizen to group tabs related to a topic.
- Acceptance: Kaizen can create a tab group and move selected tabs into it via a command.

6.3 Local Summarization & RAG
- Story: As a user, I want summaries of a tab group and a lightweight knowledge graph of extracted concepts.
- Acceptance: Kaizen produces a group summary and a small graph (nodes/edges) for the session.

6.4 Doomscroll Detection & Nudge
- Story: As a user, I want Kaizen to detect extended scrolling and offer a summary or a break.
- Acceptance: After N minutes of continuous scrolling on the same domain, Kaizen displays a nudge in the popup.

6.5 Privacy & Consent Summarizer
- Story: As a user, I want Kaizen to detect consent dialogs or policy text and provide a short risk summary.
- Acceptance: On page load, Kaizen flags major consent text and provides a 1–2 line summary.

---

## 7. Architecture & Key Components

7.1 Frontend
- Popup (voice/text input, actions)
- Side-panel (knowledge graph visualization)

7.2 Background (API Gateway)
- Routes messages, manages state, executes tab actions

7.3 Content Scripts
- Extract page text, detect doomscrolling and consent banners

7.4 Local AI (Gemini Nano)
- Responsible for summarization, rewriting, and graph embedding generation

7.5 Storage
- Chrome storage / IndexedDB for session graphs and local preferences

---

## 8. Tech Stack & Non-functional Requirements

Tech choices:
- Frontend: React + Vite
- Graph: Cytoscape.js or D3
- Storage: IndexedDB / chrome.storage.local
- Dev: pnpm workspaces, turbo (optional)

Non-functional:
- Privacy: no network calls for content by default
- Performance: local inference should not block UI; use web workers where appropriate
- Compatibility: Chrome stable supporting Chrome Built-in AI APIs (note feature flags may be required)

---

## 9. Roadmap & Milestones (Hackathon)

Day 1–3: scaffold, popup UI, background routing
Day 4–8: local summarization + content extraction
Day 9–13: tab grouping + side-panel graph UI
Day 14–18: doomscroll detection + privacy summarizer
Day 19–20: polish, testing, demo prep

---

## 10. Success Metrics & Risks

Success Metrics (for MVP):
- Completion of 6 core features above
- Demoable local summarization latency < 2s (for short pages)
- User flow time-to-summarize < 10s end-to-end

Top risks:
- Gemini Nano availability and compatibility across Chrome versions
- Local performance and memory usage
- Permission and manifest restrictions for side panel APIs

Mitigations:
- Fall back to lighter summarization methods; use web workers; document required Chrome flags

---

## 11. Resources

- https://developer.chrome.com/docs/extensions/get-started
- https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite
- https://github.com/nanobrowser/nanobrowser
- https://github.com/lxieyang/chrome-extension-boilerplate-react

---

*End reindexed PRD*