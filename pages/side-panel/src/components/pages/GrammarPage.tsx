import { AIOverlayManager } from "@extension/content-ui";
import { cn } from "@extension/ui";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileCheck, 
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  ChevronDown,
  Wand2,
  Copy,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import type React from "react";

interface GrammarPageProps {
  theme: "light" | "dark";
}

interface GrammarIssue {
  id: string;
  type: "error" | "warning" | "suggestion";
  message: string;
  suggestion: string;
  start: number;
  end: number;
}

const GrammarPage: React.FC<GrammarPageProps> = ({ theme }) => {
  const [inputText, setInputText] = useState("This is a sample text with some grammer errors and spelling mistakes. It needs to be proofread and corrected for better clarity and accuracy.");
  const [correctedText, setCorrectedText] = useState("");
  const [issues, setIssues] = useState<GrammarIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showIssues, setShowIssues] = useState(true);
  const [aiManager, setAIManager] = useState<AIOverlayManager | null>(null);

  // Initialize AI Manager
  useEffect(() => {
    const initAI = async () => {
      try {
        const manager = AIOverlayManager.getInstance();
        await manager.initialize();
        setAIManager(manager);
        console.log("[GrammarPage] AI Manager ready");
      } catch (error) {
        console.error("[GrammarPage] Failed to initialize AI:", error);
      }
    };
    initAI();
  }, []);

  const handleCheckGrammar = async () => {
    if (!inputText.trim() || !aiManager) return;

    setIsChecking(true);
    setIssues([]);
    setCorrectedText("");

    try {
      const prompt = `Please analyze the following text for grammar, spelling, punctuation, and style issues. Provide a detailed analysis in the following JSON format:

{
  "issues": [
    {
      "type": "error|warning|suggestion",
      "message": "Brief description of the issue",
      "suggestion": "Suggested correction or improvement",
      "start": position_in_text,
      "end": position_in_text
    }
  ],
  "correctedText": "The fully corrected version of the text"
}

Text to analyze:
"${inputText}"

Please be thorough but concise. Focus on actual errors and meaningful improvements.`;

      const response = await aiManager.prompt(prompt);
      
      // Parse the JSON response
      const parsedResponse = JSON.parse(response);
      
      if (parsedResponse.issues && Array.isArray(parsedResponse.issues)) {
        setIssues(parsedResponse.issues);
      }
      
      if (parsedResponse.correctedText) {
        setCorrectedText(parsedResponse.correctedText);
      }
    } catch (error) {
      console.error("[GrammarPage] Grammar check error:", error);
      // Fallback to basic error handling
      setIssues([{
        id: "error-1",
        type: "error",
        message: "Failed to analyze text",
        suggestion: "Please try again",
        start: 0,
        end: 0
      }]);
    } finally {
      setIsChecking(false);
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <Info className="w-4 h-4 text-yellow-500" />;
      case "suggestion":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20";
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20";
      case "suggestion":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20";
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20";
    }
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
              <FileCheck className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className={cn(
                "text-xl font-bold",
                theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
              )}>
                Grammar
              </h1>
              <p className={cn(
                "text-sm",
                theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
              )}>
                AI-powered proofreading and grammar check
              </p>
            </div>
          </div>
          
          {/* Settings */}
          <motion.div
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-lg",
              "bg-gradient-to-r from-kaizen-accent to-kaizen-primary",
              "text-white text-sm font-medium cursor-pointer"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Proofreader</span>
            <ChevronDown className="w-3 h-3" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Input Area */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <h3 className={cn(
              "text-sm font-medium",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
            )}>
              Text to Check
            </h3>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setShowIssues(!showIssues)}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-200",
                  theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showIssues ? <EyeOff className="w-4 h-4 text-kaizen-muted" /> : <Eye className="w-4 h-4 text-kaizen-muted" />}
              </motion.button>
              <motion.button
                onClick={() => setInputText("")}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-200",
                  theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RefreshCw className="w-4 h-4 text-kaizen-muted" />
              </motion.button>
            </div>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to check for grammar, spelling, and style issues..."
            className={cn(
              "w-full p-4 rounded-xl border-2 resize-none focus:outline-none focus:ring-2 focus:ring-kaizen-accent transition-all duration-200",
              theme === "light"
                ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text placeholder-kaizen-light-muted"
                : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text placeholder-kaizen-dark-muted"
            )}
            rows={6}
          />
        </motion.div>

        {/* Check Button */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={handleCheckGrammar}
            disabled={!inputText.trim() || isChecking}
            className={cn(
              "px-8 py-3 rounded-xl font-medium flex items-center space-x-2",
              "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
              "hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isChecking ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Check Grammar</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Issues List */}
        <AnimatePresence>
          {issues.length > 0 && showIssues && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <h3 className={cn(
                  "text-sm font-medium",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
                )}>
                  Issues Found ({issues.length})
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  )}>
                    {issues.filter(i => i.type === "error").length} Errors
                  </span>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                  )}>
                    {issues.filter(i => i.type === "warning").length} Warnings
                  </span>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  )}>
                    {issues.filter(i => i.type === "suggestion").length} Suggestions
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                {issues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    className={cn(
                      "p-3 rounded-lg border",
                      getIssueColor(issue.type)
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex items-start space-x-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <p className={cn(
                          "text-sm font-medium mb-1",
                          theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
                        )}>
                          {issue.message}
                        </p>
                        <p className={cn(
                          "text-sm",
                          theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
                        )}>
                          Suggestion: <span className="font-medium">{issue.suggestion}</span>
                        </p>
                      </div>
                      <motion.button
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-medium",
                          "bg-kaizen-accent text-white hover:bg-kaizen-primary transition-colors"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Apply
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corrected Text */}
        <AnimatePresence>
          {correctedText && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <h3 className={cn(
                  "text-sm font-medium",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
                )}>
                  Corrected Text
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
                "w-full p-4 rounded-xl border-2",
                theme === "light"
                  ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text"
                  : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text"
              )}>
                <p className="text-sm leading-relaxed">
                  {correctedText}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            <CheckCircle className="w-5 h-5 mx-auto mb-2 text-kaizen-accent" />
            <span className={cn(
              "text-xs font-medium",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
            )}>
              Auto Fix
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
            <Download className="w-5 h-5 mx-auto mb-2 text-kaizen-accent" />
            <span className={cn(
              "text-xs font-medium",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
            )}>
              Export
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GrammarPage;
