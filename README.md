# kaizen

Privacy-first, locally-run AI assistant for Chrome — scaffold and MVP for the Kaizen hackathon.

Table of contents
- Overview
- Quickstart
- MVP checklist
- Development workflow
- Dev stubs and testing UI without loading the extension
- Building & releasing
- Contributing

## Overview

Kaizen is an experimental Chrome extension that runs local AI (Gemini Nano/Chrome Built-in AI APIs) to summarize content, manage tabs, and build a lightweight session knowledge graph — all on-device.

See the full Product Requirements Document: `Prd.md` (reindexed and prioritized for the hackathon).

## Quickstart

Install dependencies at the repo root:

```powershell
pnpm install
```

Start the extension UI dev server (Vite):

```powershell
cd chrome-extension
pnpm dev
```

Open UI pages in a browser for fast iteration:

- Popup: http://localhost:5173/popup/index.html
- Side panel: http://localhost:5173/side-panel/index.html

When ready to test end-to-end, build and load the unpacked extension:

```powershell
pnpm build
# Load `dist` in chrome://extensions (Developer mode)
```

## MVP checklist (Hackathon)

- Voice + text command interface (popup)
- Tab grouping and management
- Local summarization (active tab + grouped tabs)
- Lightweight RAG knowledge graph (side-panel)
- Doomscroll detection + nudge
- Privacy & consent summarizer

## Development workflow

1. Work on feature branches off `dev`.
2. Run `pnpm install` at the repo root after updating dependencies.
3. Use `pnpm dev` inside `chrome-extension/` for UI hot-reload.
4. Use `package.json.merge` as a suggested merge of boilerplate scripts and devDeps (inspect before adopting).

## Dev stubs — run UI in a normal browser tab

To speed UI development without reloading the extension, we provide `dev-stubs` to emulate `chrome.*` APIs in development. The workflow:

1. Start Vite dev server: `cd chrome-extension && pnpm dev`.
2. Open the popup/side-panel HTML served by Vite.
3. `dev-stubs` provides minimal `chrome.runtime`, `chrome.storage`, and `chrome.tabs` behavior so the UI doesn't crash in normal tabs.

If you'd like, generate `dev-stubs.ts` from actual chrome API usages in `chrome-extension/src` to make stubbing tailored and minimal.

## Building & releasing

Build production assets:

```powershell
pnpm build
```

Zip for distribution or testing (boilerplate may include zipper package):

```powershell
pnpm zip
```

## Contributing

- Work against `dev`, open PRs to `main`.
- Add unit or E2E tests in `tests/` when adding features.
- Keep changes small and focused for quick review during the hackathon.

## Notes & Resources

- Read `PROJECT_SETUP_GUIDE.md` for setup details.
- `Prd.md` contains the reindexed product requirements and roadmap.
- Boilerplate source: https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite

License: MIT