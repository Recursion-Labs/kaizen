export class PageContentExtractor {
  static extractPageContent(): {
    title: string;
    content: string;
    url: string;
    wordCount: number;
  } {
    const title = this.extractTitle();
    const content = this.extractMainContent();
    const url = window.location.href;
    const wordCount = content
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    return { title, content, url, wordCount };
  }

  private static extractTitle(): string {
    const titleSelectors = [
      "h1",
      "title",
      '[data-testid="headline"]',
      ".headline",
    ];
    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent?.trim()) return element.textContent.trim();
    }
    return document.title || "Untitled Page";
  }

  private static extractMainContent(): string {
    const article = document.querySelector("article");
    if (article) {
      const clone = article.cloneNode(true) as Element;
      this.removeUnwantedElements(clone);
      return clone.textContent?.trim() || "";
    }

    const mainSelectors = [
      "main",
      '[role="main"]',
      ".content",
      ".article-content",
    ];
    for (const selector of mainSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const clone = element.cloneNode(true) as Element;
        this.removeUnwantedElements(clone);
        const text = clone.textContent?.trim() || "";
        if (text.length > 200) return text;
      }
    }

    return this.extractBodyContent();
  }

  private static extractBodyContent(): string {
    const body = document.body;
    if (!body) return "";

    const clone = body.cloneNode(true) as Element;
    const selectorsToRemove = [
      "nav",
      "header",
      "footer",
      ".nav",
      ".sidebar",
      ".ads",
      "script",
      "style",
    ];
    selectorsToRemove.forEach((selector) => {
      clone.querySelectorAll(selector).forEach((el) => el.remove());
    });

    return clone.textContent?.trim() || "";
  }

  private static removeUnwantedElements(element: Element): void {
    const selectors = [
      "script",
      "style",
      ".ad",
      ".advertisement",
      ".sidebar",
      "nav",
      "header",
      "footer",
    ];
    selectors.forEach((selector) => {
      element.querySelectorAll(selector).forEach((el) => el.remove());
    });
  }
}
