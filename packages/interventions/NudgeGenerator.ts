// AI-powered nudge generation to promote healthier browsing habits (using gemini-nano).

export interface NudgeContext {
  userId?: string;
  behaviorType: "doomscrolling" | "shopping" | "overtime" | "general";
  intensity: "low" | "moderate" | "high";
  domain?: string;
  duration?: number; // time spent in ms
}

export interface Nudge {
  title: string;
  message: string;
  category: "warning" | "reminder" | "encouragement";
  timestamp: number;
}

/**
 * NudgeGenerator - AI-backed message engine
 * Generates short, emotionally intelligent nudges based on user behavior.
 */
export class NudgeGenerator {
  private useGemini: boolean;

  constructor() {
    // Check if Gemini Nano or any local AI runtime is available.
    this.useGemini =
      typeof (window as { ai?: { languageModel?: unknown } }).ai !==
        "undefined" &&
      !!(window as { ai?: { languageModel?: unknown } }).ai?.languageModel;
  }

  /**
   * Generate an AI or fallback nudge for a given context.
   */
  async generateNudge(context: NudgeContext): Promise<Nudge> {
    if (this.useGemini) {
      try {
        const model = await (
          window as unknown as {
            ai: {
              languageModel: {
                create: (config: {
                  systemPrompt: string;
                }) => Promise<{ prompt: (text: string) => Promise<string> }>;
              };
            };
          }
        ).ai.languageModel.create({
          systemPrompt: `
            You are an empathetic digital wellness assistant. 
            Create one short, mindful nudge to help the user pause or reflect.
            Keep tone kind, calm, and emotionally intelligent.
          `,
        });

        const prompt = this.composePrompt(context);
        const response = await model.prompt(prompt);
        // Ensure that wrapNudge receives only a string
        return this.wrapNudge(response ?? "");
      } catch (error) {
        console.warn(
          "[NudgeGenerator] Gemini model failed, using fallback:",
          error,
        );
        return this.getFallbackNudge(context);
      }
    }

    // Fallback if AI not available
    return this.getFallbackNudge(context);
  }

  /**
   * Compose context-specific AI prompt
   */
  private composePrompt(context: NudgeContext): string {
    const base = `The user is showing ${context.behaviorType} behavior with ${context.intensity} intensity.`;
    const domainPart = context.domain ? `Domain: ${context.domain}.` : "";
    const durationPart = context.duration
      ? `They have spent ${(context.duration / 60000).toFixed(1)} minutes here.`
      : "";

    return `${base} ${domainPart} ${durationPart} Generate one short empathetic message (max 15 words).`;
  }

  /**
   * Fallback nudge generation (non-AI)
   */
  private getFallbackNudge(context: NudgeContext): Nudge {
    const { behaviorType, intensity, domain } = context;

    const messages: Record<
      typeof behaviorType,
      Record<typeof intensity, string>
    > = {
      doomscrolling: {
        low: "Take a short breath — you've been scrolling a while.",
        moderate: "Maybe pause for a minute? The world can wait.",
        high: "Let’s take a mindful break. Your peace matters more than the feed.",
      },
      shopping: {
        low: "Double-check: do you really need this item?",
        moderate:
          "Pause before you purchase — thoughtful choices save peace and money.",
        high: "Step back for a bit. Impulse fades, clarity returns.",
      },
      overtime: {
        low: "You’ve been focused a while — hydrate or stretch for a moment?",
        moderate:
          "Long hours can dull clarity. Rest a bit, then resume stronger.",
        high: "You've crossed your healthy limit — take a short break now.",
      },
      general: {
        low: "A deep breath resets the mind.",
        moderate: "Little pauses lead to better focus.",
        high: "Your well-being deserves a moment of calm now.",
      },
    };

    const message =
      messages[behaviorType]?.[intensity] || messages["general"]["moderate"];

    return {
      title:
        behaviorType === "shopping"
          ? "Mindful Shopping"
          : behaviorType === "doomscrolling"
            ? "Mindful Scrolling"
            : "Take a Breather",
      message: domain ? `${message} (${domain})` : message,
      category:
        intensity === "high"
          ? "warning"
          : intensity === "moderate"
            ? "reminder"
            : "encouragement",
      timestamp: Date.now(),
    };
  }

  /**
   * Wrap string response into Nudge object
   */
  private wrapNudge(message: string): Nudge {
    return {
      title: "Mindful Moment",
      message: message.trim(),
      category: "reminder",
      timestamp: Date.now(),
    };
  }
}
