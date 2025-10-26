import { AIOverlayManager } from "@extension/content-ui";
import { cn } from "@extension/ui";
import { motion } from "framer-motion";
import { 
  Languages, 
  ArrowLeftRight,
  Mic,
  Trash2,
  Volume2,
  Copy,
  Download,
  Sparkles,
  ChevronDown,
  Globe,
  Zap
} from "lucide-react";
import { useState } from "react";
import type React from "react";

interface TranslatePageProps {
  theme: "light" | "dark";
}

const TranslatePage: React.FC<TranslatePageProps> = ({ theme }) => {
  const [sourceText, setSourceText] = useState("Sider gives you fast, reliable access to leading AI models from OpenAI, DeepSeek, Anthropic, Google, and more—all through official APIs in on");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("English (Detected)");
  const [targetLanguage, setTargetLanguage] = useState("Marathi");
  const [isTranslating, setIsTranslating] = useState(false);
  const [aiManager, setAIManager] = useState<AIOverlayManager | null>(null);

  const languages = [
    "English", "Spanish", "French", "German", "Chinese", "Japanese", 
    "Korean", "Hindi", "Marathi", "Arabic", "Portuguese", "Russian"
  ];

  // Initialize AI Manager
  useEffect(() => {
    const initAI = async () => {
      try {
        const manager = AIOverlayManager.getInstance();
        await manager.initialize();
        setAIManager(manager);
        console.log("[TranslatePage] AI Manager ready");
      } catch (error) {
        console.error("[TranslatePage] Failed to initialize AI:", error);
      }
    };
    initAI();
  }, []);

  const handleTranslate = async () => {
    if (!sourceText.trim() || !aiManager) return;

    setIsTranslating(true);
    try {
      // Map display language names to ISO codes for the API
      const languageMap: { [key: string]: string } = {
        "English": "en",
        "Spanish": "es",
        "French": "fr",
        "German": "de",
        "Chinese": "zh",
        "Japanese": "ja",
        "Korean": "ko",
        "Hindi": "hi",
        "Marathi": "mr",
        "Arabic": "ar",
        "Portuguese": "pt",
        "Russian": "ru"
      };

      const sourceLang = sourceLanguage.replace(" (Detected)", "");
      const sourceCode = languageMap[sourceLang] || "en";
      const targetCode = languageMap[targetLanguage] || "es";

      const translated = await aiManager.translate(sourceText, sourceCode, targetCode);
      setTranslatedText(translated);
    } catch (error) {
      console.error("[TranslatePage] Translation failed:", error);
      setTranslatedText("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <motion.div
      className={cn(
        "flex-1 flex flex-col h-full",
        theme === "light" ? "bg-kaizen-light-bg" : "bg-kaizen-dark-bg"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className={cn(
        "px-6 py-4 border-b",
        theme === "light" ? "border-kaizen-border" : "border-kaizen-dark-border"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-gradient-to-r from-kaizen-accent to-kaizen-primary"
              )}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Languages className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className={cn(
                "text-xl font-bold",
                theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
              )}>
                Translate
              </h1>
              <p className={cn(
                "text-sm",
                theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
              )}>
                AI-powered language translation
              </p>
            </div>
          </div>
          
          {/* Model Selector */}
          <motion.div
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-lg",
              "bg-gradient-to-r from-kaizen-accent to-kaizen-primary",
              "text-white text-sm font-medium cursor-pointer"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Globe className="w-4 h-4" />
            <span>Default preferences</span>
            <ChevronDown className="w-3 h-3" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Language Selectors */}
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex-1">
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className={cn(
                "w-full p-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-kaizen-accent",
                theme === "light"
                  ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text"
                  : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text"
              )}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang === "English" ? "English (Detected)" : lang}
                </option>
              ))}
            </select>
          </div>
          
          <motion.button
            onClick={handleSwapLanguages}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
            )}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeftRight className="w-4 h-4 text-kaizen-muted" />
          </motion.button>
          
          <div className="flex-1">
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className={cn(
                "w-full p-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-kaizen-accent",
                theme === "light"
                  ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text"
                  : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text"
              )}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Text Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Text */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h3 className={cn(
                "text-sm font-medium",
                theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
              )}>
                Source Text
              </h3>
              <div className="flex items-center space-x-2">
                <motion.button
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-200",
                    theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mic className="w-4 h-4 text-kaizen-muted" />
                </motion.button>
                <motion.button
                  onClick={() => setSourceText("")}
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-200",
                    theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4 text-kaizen-muted" />
                </motion.button>
              </div>
            </div>
            
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              className={cn(
                "w-full p-4 rounded-xl border-2 resize-none focus:outline-none focus:ring-2 focus:ring-kaizen-accent transition-all duration-200",
                theme === "light"
                  ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text placeholder-kaizen-light-muted"
                  : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text placeholder-kaizen-dark-muted"
              )}
              rows={8}
            />
          </motion.div>

          {/* Translated Text */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <h3 className={cn(
                "text-sm font-medium",
                theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
              )}>
                Translation
              </h3>
              <div className="flex items-center space-x-2">
                <motion.button
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-200",
                    theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Volume2 className="w-4 h-4 text-kaizen-muted" />
                </motion.button>
                <motion.button
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-200",
                    theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Copy className="w-4 h-4 text-kaizen-muted" />
                </motion.button>
                <motion.button
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-200",
                    theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Download className="w-4 h-4 text-kaizen-muted" />
                </motion.button>
              </div>
            </div>
            
            <div className={cn(
              "w-full p-4 rounded-xl border-2 min-h-[200px]",
              theme === "light"
                ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text"
                : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text"
            )}>
              {isTranslating ? (
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    className="flex items-center space-x-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Zap className="w-4 h-4 text-kaizen-accent" />
                    <span className={cn(
                      "text-sm",
                      theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
                    )}>
                      Translating...
                    </span>
                  </motion.div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">
                  {translatedText || "Translation will appear here..."}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Translate Button */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isTranslating}
            className={cn(
              "px-8 py-3 rounded-xl font-medium flex items-center space-x-2",
              "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
              "hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isTranslating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Languages className="w-4 h-4" />
                <span>Translate</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className={cn(
              "p-3 rounded-lg border-2 border-dashed text-center transition-all duration-200",
              "hover:scale-105",
              theme === "light"
                ? "border-kaizen-border bg-kaizen-surface hover:border-kaizen-accent"
                : "border-kaizen-dark-border bg-kaizen-dark-surface hover:border-kaizen-accent"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Globe className="w-5 h-5 mx-auto mb-2 text-kaizen-accent" />
            <span className={cn(
              "text-xs font-medium",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
            )}>
              Auto Detect
            </span>
          </motion.button>
          
          <motion.button
            className={cn(
              "p-3 rounded-lg border-2 border-dashed text-center transition-all duration-200",
              "hover:scale-105",
              theme === "light"
                ? "border-kaizen-border bg-kaizen-surface hover:border-kaizen-accent"
                : "border-kaizen-dark-border bg-kaizen-dark-surface hover:border-kaizen-accent"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy className="w-5 h-5 mx-auto mb-2 text-kaizen-accent" />
            <span className={cn(
              "text-xs font-medium",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
            )}>
              Copy Result
            </span>
          </motion.button>
          
          <motion.button
            className={cn(
              "p-3 rounded-lg border-2 border-dashed text-center transition-all duration-200",
              "hover:scale-105",
              theme === "light"
                ? "border-kaizen-border bg-kaizen-surface hover:border-kaizen-accent"
                : "border-kaizen-dark-border bg-kaizen-dark-surface hover:border-kaizen-accent"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Volume2 className="w-5 h-5 mx-auto mb-2 text-kaizen-accent" />
            <span className={cn(
              "text-xs font-medium",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
            )}>
              Listen
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TranslatePage;
