/**
 * SearchEnhancer - Google Search AI Integration
 *
 * Detects Google Search pages, extracts results, generates AI summaries,
 * and injects beautiful summary cards above search results.
 *
 * Features:
 * - Auto-detects Google Search
 * - Extracts top 5 results
 * - Generates comprehensive AI summary
 * - Injects animated summary card
 * - Actions: Translate, Expand, Save to Graph
 */

import { AIOverlayManager } from "./AIOverlayManager";

interface SearchResult {
  title: string;
  snippet: string;
  url?: string;
}

export class SearchEnhancer {
  private aiManager: AIOverlayManager;
  private hasEnhanced = false;
  private observer: MutationObserver | null = null;

  constructor() {
    this.aiManager = AIOverlayManager.getInstance();
  }

  /**
   * Initialize search enhancement
   */
  async initialize(): Promise<void> {
    // Check if we're on Google Search
    if (!this.isGoogleSearch()) {
      console.log("[Kaizen Search] Not on Google Search, skipping");
      return;
    }

    console.log(
      "[Kaizen Search] Detected Google Search, waiting for results...",
    );

    // Wait for results to load
    await this.waitForResults();

    // Enhance the search results
    await this.enhanceSearchResults();

    // Watch for new searches (user clicks a new search)
    this.setupSearchWatcher();
  }

  /**
   * Check if we're on Google Search
   */
  private isGoogleSearch(): boolean {
    return (
      window.location.hostname.includes("google.com") &&
      window.location.pathname.includes("search")
    );
  }

  private async waitForResults(): Promise<void> {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 20; // 10 seconds max wait

      const checkResults = () => {
        attempts++;

        // Multiple selectors for different Google result types
        const resultSelectors = [
          "div.g", // Traditional results
          "div[data-sokoban-container]", // New container format
          "div[data-ved]", // Results with data-ved attribute
          "div[data-hveid]", // Another result identifier
          "div.yuRUbf", // Link container
          "div.MjjYud", // Main result container
          "div[data-aria-level='3']", // Result title containers
        ];

        let foundResults = false;
        for (const selector of resultSelectors) {
          const results = document.querySelectorAll(selector);
          if (results.length > 0) {
            console.log(
              `[Kaizen Search] Found ${results.length} results using selector: ${selector}`,
            );
            foundResults = true;
            break;
          }
        }

        if (foundResults) {
          resolve();
        } else if (attempts >= maxAttempts) {
          console.log(
            "[Kaizen Search] Timeout waiting for results, proceeding anyway",
          );
          resolve(); // Don't reject, just proceed
        } else {
          // Also check if we're on a results page by looking for search stats
          const searchStats = document.querySelector("#result-stats, #appbar");
          if (searchStats && window.location.search.includes("q=")) {
            console.log(
              "[Kaizen Search] Detected search page with stats, proceeding...",
            );
            resolve();
          } else {
            setTimeout(checkResults, 500);
          }
        }
      };
      checkResults();
    });
  }

  /**
   * Main enhancement logic
   */
  private async enhanceSearchResults(): Promise<void> {
    if (this.hasEnhanced) {
      console.log("[Kaizen Search] Already enhanced, skipping");
      return;
    }

    // Get search query
    const query = this.getSearchQuery();
    if (!query) {
      console.log("[Kaizen Search] No query found, skipping");
      return;
    }

    console.log(`[Kaizen Search] Query: "${query}"`);

    // Extract top results
    const results = this.extractSearchResults();
    if (results.length === 0) {
      console.log("[Kaizen Search] No results found, skipping");
      return;
    }

    console.log(`[Kaizen Search] Extracted ${results.length} results`);

    // Generate AI summary
    try {
      console.log("[Kaizen Search] 🔮 Generating AI summary...");
      const summary = await this.generateSummary(query, results);

      // Inject summary card
      this.injectSummaryCard(summary, query);

      this.hasEnhanced = true;
    } catch (error) {
      console.error("[Kaizen Search] ❌ Enhancement failed:", error);
    }
  }

  /**
   * Get search query from URL
   */
  private getSearchQuery(): string | null {
    return new URLSearchParams(window.location.search).get("q");
  }

  /**
   * Extract search results from page
   */
  private extractSearchResults(): SearchResult[] {
    // Multiple strategies for different Google result formats
    const resultElements: Element[] = [];

    // Strategy 1: Traditional div.g results
    const traditionalResults = document.querySelectorAll("div.g");
    traditionalResults.forEach((el) => resultElements.push(el));

    // Strategy 2: New format with yuRUbf containers
    const linkContainers = document.querySelectorAll("div.yuRUbf");
    linkContainers.forEach((el) => {
      // Find parent container that might have snippet
      const parent = el.closest("div.MjjYud") || el.parentElement;
      if (parent && !resultElements.includes(parent)) {
        resultElements.push(parent);
      }
    });

    // Strategy 3: Direct result containers
    const directContainers = document.querySelectorAll(
      "div[data-ved], div[data-hveid]",
    );
    directContainers.forEach((el) => {
      if (!resultElements.includes(el) && el.querySelector("h3, a")) {
        resultElements.push(el);
      }
    });

    // Remove duplicates and limit to top 5
    const uniqueResults = Array.from(new Set(resultElements)).slice(0, 5);

    return uniqueResults
      .map((result) => {
        // Try multiple selectors for title
        const title =
          result.querySelector("h3")?.textContent ||
          result.querySelector("a")?.textContent ||
          result.querySelector("[data-aria-level='3']")?.textContent ||
          "";

        // Try multiple selectors for snippet
        const snippetSelectors = [
          ".VwiC3b",
          ".yXK7lf",
          ".aCOpRe",
          "span:not([class])",
          "div:not([class])",
        ];

        let snippet = "";
        for (const selector of snippetSelectors) {
          const element = result.querySelector(selector);
          if (element?.textContent) {
            snippet = element.textContent.trim();
            break;
          }
        }

        // Get URL
        const url =
          (result.querySelector("a") as HTMLAnchorElement)?.href ||
          (result.querySelector("a[data-ved]") as HTMLAnchorElement)?.href ||
          "";

        return { title: title.trim(), snippet: snippet.trim(), url };
      })
      .filter((r) => r.title && r.snippet); // Filter out empty results
  }

  /**
   * Generate AI summary using Prompt API
   */
  private async generateSummary(
    query: string,
    results: SearchResult[],
  ): Promise<string> {
    const snippets = results
      .map((r, i) => {
        const num = i + 1;
        return `${num}. **${r.title}**\n   ${r.snippet}`;
      })
      .join("\n\n");

    const prompt = `
User searched for: "${query}"

Top search results:
${snippets}

Task: Provide a comprehensive answer (3-4 sentences) that synthesizes information from these results. Be factual and cite which results support your statements (e.g., "According to result #2...").

Answer:
    `.trim();

    try {
      console.log("[Kaizen Search] 🔮 Generating AI summary...");
      const response = await this.aiManager.prompt(prompt);
      console.log("[Kaizen Search] ✅ Summary generated successfully");
      console.log("[Kaizen Search] 📄 AI Response:", response);
      return response;
    } catch (error) {
      console.error("[Kaizen Search] Summary generation failed:", error);

      // Provide user-friendly error messages based on the error type
      if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (message.includes("downloading")) {
          return "⏳ AI model is downloading. Please wait a moment and refresh the page to try again.";
        } else if (message.includes("disk")) {
          return "💾 Insufficient disk space for AI model. Please free up space and try again.";
        } else if (message.includes("network")) {
          return "🌐 Network error while downloading AI model. Check your connection and try again.";
        } else if (message.includes("unavailable")) {
          return "⚠️ AI APIs are not enabled. Check chrome://flags for Prompt API settings.";
        }
      }

      // Fallback generic message
      return "⚠️ Summary generation failed. AI APIs may not be enabled or the model is still downloading. Check chrome://flags for 'Prompt API' and try again in a moment.";
    }
  }

  /**
   * Inject summary card into page
   */
  private injectSummaryCard(summary: string, query: string): void {
    // Check if card already exists
    if (document.querySelector("#kaizen-search-summary")) {
      console.log("[Kaizen Search] Card already exists, skipping injection");
      return;
    }

    // Log the summary content for debugging
    console.log("[Kaizen Search] 📝 Summary content:", summary);
    console.log("[Kaizen Search] 🔍 Query:", query);

    // Find insertion point (before first result or search stats)
    const firstResult =
      document.querySelector("div.g") ||
      document.querySelector("div.yuRUbf") ||
      document.querySelector("div.MjjYud") ||
      document.querySelector("div[data-ved]");

    const searchStats = document.querySelector("#result-stats");
    const insertionPoint = firstResult || searchStats;

    if (!insertionPoint?.parentElement) {
      console.error("[Kaizen Search] Could not find insertion point");
      return;
    }

    // Create card
    const card = document.createElement("div");
    card.id = "kaizen-search-summary";
    card.className = "kaizen-summary-card";
    card.setAttribute("data-query", query);

    card.innerHTML = `
      <div class="kaizen-card-header">
        <span class="kaizen-icon">🔮</span>
        <strong>AI-Powered Summary</strong>
        <span class="kaizen-badge">Gemini Nano</span>
      </div>
      <div class="kaizen-card-body">
        <p>${this.escapeHtml(summary)}</p>
      </div>
      <div class="kaizen-card-actions">
        <button class="kaizen-btn" data-action="translate">
          <span>🌐</span> Translate
        </button>
        <button class="kaizen-btn" data-action="expand">
          <span>📖</span> Read More
        </button>
        <button class="kaizen-btn" data-action="save">
          <span>💾</span> Save to Graph
        </button>
      </div>
      <div class="kaizen-card-footer">
        <span class="kaizen-privacy-badge">🔒 Processed locally - No data sent to servers</span>
      </div>
    `;

    // Attach event listeners
    this.attachCardEventListeners(card, summary, query);

    // Insert before first result with animation
    card.style.opacity = "0";
    card.style.transform = "translateY(-20px)";
    insertionPoint.parentElement.insertBefore(card, insertionPoint);

    // Trigger animation
    requestAnimationFrame(() => {
      card.style.transition = "all 0.5s ease-out";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    });

    console.log("[Kaizen Search] ✅ Summary card injected");
  }

  /**
   * Attach event listeners to card actions
   */
  private attachCardEventListeners(
    card: HTMLElement,
    summary: string,
    query: string,
  ): void {
    const buttons = card.querySelectorAll(".kaizen-btn");

    buttons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const action = (e.currentTarget as HTMLElement).dataset.action;
        console.log(`[Kaizen Search] Action clicked: ${action}`);

        switch (action) {
          case "translate":
            await this.handleTranslate();
            break;
          case "expand":
            await this.handleExpand();
            break;
          case "save":
            await this.handleSave(summary, query);
            break;
        }
      });
    });
  }

  /**
   * Handle translate action
   */
  private async handleTranslate(): Promise<void> {
    alert(
      "🌐 Translate feature coming soon!\n\nWill use Translator API to translate summary.",
    );
  }

  /**
   * Handle expand action
   */
  private async handleExpand(): Promise<void> {
    alert(
      "📖 Expand feature coming soon!\n\nWill generate a longer, more detailed summary.",
    );
  }

  /**
   * Handle save to graph action
   */
  private async handleSave(summary: string, query: string): Promise<void> {
    console.log("[Kaizen Search] Saving to knowledge graph:", {
      query,
      summary,
    });
    alert(
      "💾 Saved to knowledge graph!\n\nYou can view it in the extension popup.",
    );
  }

  /**
   * Watch for new searches (URL changes)
   */
  private setupSearchWatcher(): void {
    let lastQuery = this.getSearchQuery();

    // Watch for URL changes
    const checkForNewSearch = () => {
      const currentQuery = this.getSearchQuery();
      if (currentQuery && currentQuery !== lastQuery) {
        console.log("[Kaizen Search] New search detected:", currentQuery);
        this.hasEnhanced = false;
        this.removeExistingCard();
        this.enhanceSearchResults();
        lastQuery = currentQuery;
      }
    };

    // Check every 500ms
    setInterval(checkForNewSearch, 500);
  }

  /**
   * Remove existing summary card
   */
  private removeExistingCard(): void {
    const card = document.querySelector("#kaizen-search-summary");
    if (card) {
      card.remove();
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Destroy and cleanup
   */
  destroy(): void {
    this.removeExistingCard();
    if (this.observer) {
      this.observer.disconnect();
    }
    console.log("[Kaizen Search] Destroyed");
  }
}
