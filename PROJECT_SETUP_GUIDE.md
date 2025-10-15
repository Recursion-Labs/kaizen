# **🚀 Project Setup Guide: kaizen Chrome Extension**

## **📋 Overview**

This guide outlines how to initialize the project structure for **kaizen** (or your chosen name), a Chrome extension that turns Chrome into an AI-powered browsing brain using Gemini Nano and Chrome Built-in AI APIs.

**Important Clarification:** This is **not a Next.js project**. It's a **Chrome extension** built with pnpm workspaces, Vite, and TypeScript. We'll use the **Jonghakseo/chrome-extension-boilerplate-react-vite** boilerplate as our starting point, which provides a solid foundation similar to nanobrowser.

---

## **🛠️ Prerequisites**

Before starting, ensure you have:
- **Node.js** (v22.12.0 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v9.15.1 or higher) - Install via `npm install -g pnpm` or [pnpm.io](https://pnpm.io/installation)
- **Git** for version control
- **Chrome Browser** for testing the extension

---

## **📁 Recommended Project Structure**

Using the boilerplate, your project will have this structure:

```
kaizen/  # Root project folder
├── package.json  # Root dependencies and scripts
├── pnpm-workspace.yaml  # Workspace configuration (if expanding to monorepo)
├── turbo.json  # Build orchestration (optional)
├── chrome-extension/  # Main extension package (from boilerplate)
│   ├── package.json
│   ├── manifest.js  # Generates manifest.json
│   ├── vite.config.ts
│   └── src/
│       ├── background/  # Service worker
│       ├── content/  # Content scripts
│       ├── popup/  # Popup UI
│       └── utils/
├── pages/  # Additional UI pages (add these)
│   ├── side-panel/  # Knowledge graph UI
│   └── options/  # Settings page
└── packages/  # Shared libraries (add these)
    ├── shared/
    └── storage/
```

---

## **🚀 Quick Start with Boilerplate**

### **Step 1: Clone the Boilerplate**

```bash
# Use degit for clean clone (no git history)
npx degit Jonghakseo/chrome-extension-boilerplate-react-vite kaizen

# Or clone directly
git clone https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite.git kaizen

cd kaizen
```

### **Step 2: Install Dependencies**

```bash
pnpm install
```

### **Step 3: Test the Boilerplate**

```bash
# Build the extension
pnpm build

# Start dev mode
pnpm dev
```

The boilerplate includes:
- ✅ React + TypeScript
- ✅ Vite for fast builds
- ✅ Hot Module Replacement (HMR)
- ✅ Tailwind CSS
- ✅ Chrome Manifest V3
- ✅ Popup, background, content scripts
- ✅ Basic project structure

### **Step 4: Load in Chrome**

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder
5. Test the popup and basic functionality

---

## **🔧 Customize for kaizen**

### **Step 5: Update Package Info**

Edit `package.json` and `manifest.js`:

```json
// package.json
{
  "name": "kaizen",
  "version": "0.1.0",
  "description": "AI-powered Chrome browsing brain"
}
```

```javascript
// manifest.js
const manifest = {
  name: 'kaizen',
  description: 'AI-powered Chrome browsing brain',
  // ... other config
}
```

### **Step 6: Add Side Panel (Knowledge Graph)**

The boilerplate doesn't include side panel by default. Add it:

1. Create `pages/side-panel/` folder
2. Copy structure from nanobrowser's side panel
3. Update `manifest.js` to include side panel:

```javascript
const manifest = {
  // ... existing config
  side_panel: {
    default_path: 'side-panel/index.html',
  },
  permissions: ['sidePanel'], // Add this
}
```

### **Step 7: Add Options Page**

1. Create `pages/options/` folder
2. Add options UI for AI model settings
3. Update manifest:

```javascript
const manifest = {
  // ... existing config
  options_page: 'options/index.html',
}
```

### **Step 8: Expand to Monorepo (Optional)**

If you want shared packages like nanobrowser:

1. Create `pnpm-workspace.yaml`:

```yaml
packages:
  - "chrome-extension"
  - "pages/*"
  - "packages/*"
```

2. Move main package to `chrome-extension/`
3. Create shared packages in `packages/`

---

## **🧩 Key Boilerplate Features**

| Feature | Description | kaizen Usage |
|---------|-------------|-----------------|
| **React + TypeScript** | Modern UI development | Build popup and side panel |
| **Vite** | Fast builds and HMR | Quick development iteration |
| **Tailwind CSS** | Utility-first styling | Premium UI design |
| **Chrome APIs** | Extension functionality | Tabs, storage, messaging |
| **Manifest V3** | Latest extension standard | Required for Chrome Web Store |

---

## **🔍 Boilerplate Structure Explained**

```
src/
├── background/          # Service worker (API gateway)
├── content/            # Page injection scripts
├── popup/              # Main UI (voice/text input)
├── options/            # Settings page (AI models)
├── side-panel/         # Knowledge graph (add this)
└── utils/              # Shared utilities
```

### **Background Script**
- Handles extension lifecycle
- Manages AI processing
- Coordinates between components

### **Content Scripts**
- Interact with web pages
- Extract data for AI analysis
- Privacy scanning

### **Popup**
- Voice/text command interface
- Quick actions and status

---

## **🚀 Development Workflow**

```bash
# Development
pnpm dev          # Start dev server with HMR
pnpm build        # Production build
pnpm preview      # Test production build

# Testing
pnpm test         # Run tests
pnpm lint         # Code linting
```

### **Chrome DevTools**
- Use `chrome://extensions/` to reload extension
- Check console for errors
- Test popup and side panel

---

## **📚 Resources**

- [Boilerplate README](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## **🎯 Next Steps**

1. **Get boilerplate running** - Follow steps 1-4 above
2. **Customize manifest** - Update name, description, permissions
3. **Add side panel** - Implement knowledge graph UI
4. **Build popup** - Voice/text command interface
5. **Integrate AI** - Connect to Gemini Nano APIs

This boilerplate gives you a production-ready foundation. Focus on the premium UI and AI features!

**Questions?** Let me know if you need help with any customization step! 🚀
    ├── storage/
    └── hmr/  # Hot reload for dev
```

---

## **🚀 Step-by-Step Initialization**

### **Step 1: Create Root Project Folder**

```bash
mkdir kaizen
cd kaizen
git init  # Initialize Git repo
```

### **Step 2: Initialize pnpm Workspace**

```bash
pnpm init
```

This creates a basic `package.json`. Edit it to match the root config from nanobrowser:

```json
{
  "name": "kaizen",
  "version": "0.1.0",
  "description": "AI-powered Chrome browsing brain",
  "license": "Apache-2.0",
  "type": "module",
  "scripts": {
    "clean": "rimraf dist && turbo clean",
    "build": "turbo ready && turbo build",
    "dev": "turbo ready && cross-env __DEV__=true turbo watch dev --concurrency 20",
    "lint": "turbo lint",
    "type-check": "turbo type-check"
  },
  "devDependencies": {
    "@types/node": "^22.5.5",
    "cross-env": "^7.0.3",
    "rimraf": "^6.0.1",
    "turbo": "^2.5.3",
    "typescript": "5.5.4"
  },
  "packageManager": "pnpm@9.15.1"
}
```

### **Step 3: Create pnpm-workspace.yaml**

Create `pnpm-workspace.yaml` in the root:

```yaml
packages:
  - "chrome-extension"
  - "pages/*"
  - "packages/*"
```

This tells pnpm which folders are workspace packages.

### **Step 4: Install Root Dependencies**

```bash
pnpm install
```

### **Step 5: Set Up Turbo (Optional, for Build Performance)**

Turbo helps orchestrate builds across packages. Create `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {}
  }
}
```

### **Step 6: Create Package Folders**

```bash
mkdir -p chrome-extension pages/side-panel pages/options packages/shared packages/storage packages/hmr
```

### **Step 7: Initialize Each Package**

For each package, run `pnpm init` in its folder and configure `package.json`. Use nanobrowser's packages as templates.

Example for `chrome-extension/package.json`:

```json
{
  "name": "chrome-extension",
  "version": "0.1.0",
  "description": "Main extension package",
  "type": "module",
  "scripts": {
    "build": "vite build",
    "dev": "cross-env __DEV__=true vite build --mode development"
  },
  "dependencies": {
    "webextension-polyfill": "^0.12.0"
  },
  "devDependencies": {
    "@types/chrome": "0.0.326",
    "vite": "6.3.6",
    "typescript": "5.5.4"
  }
}
```

Repeat for other packages, adapting from nanobrowser.

### **Step 8: Set Up Vite Configs**

For packages using Vite (chrome-extension, pages/*), create `vite.config.mts` files. Reference nanobrowser's configs.

### **Step 9: Create Manifest and Basic Files**

- Copy `manifest.js` from nanobrowser to `chrome-extension/`
- Set up basic folder structures (src/, public/, etc.)
- Add TypeScript configs, Tailwind, etc.

### **Step 10: Install All Dependencies**

```bash
pnpm install
```

### **Step 11: Test Setup**

```bash
pnpm build  # Should build all packages
pnpm dev    # Should start dev mode
```

---

## **🔍 Google Search References**

Here are key search terms and resources for setting up similar projects:

### **Chrome Extension Development**
- **"Chrome extension manifest v3 tutorial"** → [Chrome Docs](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
- **"Chrome extension with React popup"** → [React Chrome Extension Boilerplate](https://github.com/lxieyang/chrome-extension-boilerplate-react)
- **"Chrome extension side panel API"** → [Side Panel Docs](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)

### **pnpm Monorepo Setup**
- **"pnpm workspace monorepo tutorial"** → [pnpm Workspaces Guide](https://pnpm.io/workspaces)
- **"Chrome extension monorepo with pnpm"** → Search for "chrome extension pnpm workspace" (limited results, but nanobrowser is a good example)
- **"Turbo monorepo for extensions"** → [Turbo Docs](https://turbo.build/repo/docs)

### **Vite for Chrome Extensions**
- **"Vite chrome extension build"** → [Vite Plugin for Chrome Extensions](https://github.com/antfu/vite-plugin-inspect)
- **"Vite multiple entry points extension"** → Reference nanobrowser's vite configs

### **AI Integration (Gemini Nano)**
- **"Chrome built-in AI APIs Gemini Nano"** → [Chrome AI Docs](https://developer.chrome.com/docs/ai/)
- **"Web Speech API chrome extension"** → [Web Speech API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

### **Graph Visualization**
- **"D3.js knowledge graph chrome extension"** → [D3.js Examples](https://observablehq.com/@d3)
- **"Cytoscape.js for browser extensions"** → [Cytoscape.js Docs](https://js.cytoscape.org/)

### **General Resources**
- **"Chrome extension boilerplate 2024"** → Multiple GitHub repos like nanobrowser, Automa, etc.
- **"Privacy-first AI browser extension"** → Search for "local AI chrome extension" (emerging field)

---

## **📚 Recommended Reading Order**

1. [Chrome Extension Getting Started](https://developer.chrome.com/docs/extensions/get-started)
2. [pnpm Workspaces](https://pnpm.io/workspaces)
3. [Vite Guide](https://vitejs.dev/guide/)
4. [Chrome AI APIs](https://developer.chrome.com/docs/ai/)
5. Nanobrowser GitHub repo for code examples

---

## **🚨 Common Pitfalls**

- **Manifest V3**: Ensure all APIs are V3 compatible (no background pages, use service workers)
- **Permissions**: Request only necessary permissions (tabs, scripting, etc.)
- **Local AI**: Gemini Nano requires Chrome 127+ and specific flags
- **Build Issues**: Use `cross-env` for environment variables in scripts

---

## **🎯 Next Steps**

After setup:
1. Build the popup UI (voice/text input)
2. Implement side panel with graph
3. Integrate AI command layer
4. Test in Chrome DevTools

If you encounter issues, check the nanobrowser repo for working examples.

**Happy coding!** 🚀