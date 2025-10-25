import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@extension/ui";
import { 
  RefreshCw, 
  Sparkles,
  ChevronDown,
  Mic,
  Plus,
  Clock,
  HelpCircle,
  Menu,
  CheckCircle
} from "lucide-react";
import type React from "react";

interface RewriterPageProps {
  theme: "light" | "dark";
}

const RewriterPage: React.FC<RewriterPageProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<"write" | "reply">("reply");
  const [selectedType, setSelectedType] = useState("Twitter");
  const [originalText, setOriginalText] = useState("");
  const [responseIdea, setResponseIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const contentTypes = ["Twitter", "Comment", "Email", "Message"];
  const toneOptions = ["Formal", "Casual", "Professional", "Friendly"];
  const lengthOptions = ["Short", "Medium", "Long"];
  const languageOptions = ["English", "Spanish", "French", "German"];

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
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
          <div className="flex items-center space-x-4">
            <span className={cn(
              "text-sm",
              theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
            )}>
              Write
            </span>
            <span className={cn(
              "text-sm font-medium underline",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
            )}>
              Reply
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Clock className="w-4 h-4 text-kaizen-muted" />
            </motion.button>
            <motion.button
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HelpCircle className="w-4 h-4 text-kaizen-muted" />
            </motion.button>
            <motion.button
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-4 h-4 text-kaizen-muted" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Content Type Selection */}
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {contentTypes.map((type) => (
            <motion.button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                selectedType === type
                  ? "bg-kaizen-accent text-white"
                  : theme === "light"
                    ? "bg-kaizen-light-bg text-kaizen-light-text border border-kaizen-border"
                    : "bg-kaizen-dark-bg text-kaizen-dark-text border border-kaizen-dark-border"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {type}
            </motion.button>
          ))}
          <motion.button
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              theme === "light" 
                ? "bg-kaizen-light-bg border border-kaizen-border text-kaizen-light-muted" 
                : "bg-kaizen-dark-bg border border-kaizen-dark-border text-kaizen-dark-muted"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
          </motion.button>
          
          <div className="ml-auto">
            <select className={cn(
              "px-3 py-2 rounded-lg text-sm border",
              theme === "light"
                ? "bg-kaizen-light-bg border-kaizen-border text-kaizen-light-text"
                : "bg-kaizen-dark-bg border-kaizen-dark-border text-kaizen-dark-text"
            )}>
              <option>Formal - Short - English</option>
            </select>
          </div>
        </motion.div>

        {/* AI Model Selector */}
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              "bg-gradient-to-r from-kaizen-accent to-kaizen-primary"
            )}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
          <ChevronDown className="w-3 h-3 text-kaizen-muted" />
        </motion.div>

        {/* Input Fields */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Original Text Input */}
          <div className="space-y-2">
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Enter the original text you want to reply to"
              className={cn(
                "w-full p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-kaizen-accent transition-all duration-200",
                theme === "light"
                  ? "bg-kaizen-light-bg border-kaizen-border text-kaizen-light-text placeholder-kaizen-light-muted"
                  : "bg-kaizen-dark-bg border-kaizen-dark-border text-kaizen-dark-text placeholder-kaizen-dark-muted"
              )}
              rows={4}
            />
          </div>

          {/* Response Idea Input */}
          <div className="space-y-2">
            <div className="relative">
              <textarea
                value={responseIdea}
                onChange={(e) => setResponseIdea(e.target.value)}
                placeholder="Describe the general idea of your response"
                className={cn(
                  "w-full p-4 pr-20 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-kaizen-accent transition-all duration-200",
                  theme === "light"
                    ? "bg-kaizen-light-bg border-kaizen-border text-kaizen-light-text placeholder-kaizen-light-muted"
                    : "bg-kaizen-dark-bg border-kaizen-dark-border text-kaizen-dark-text placeholder-kaizen-dark-muted"
                )}
                rows={4}
              />
              
              {/* Mic Icon */}
              <motion.button
                className={cn(
                  "absolute bottom-3 left-3 p-2 rounded-lg transition-all duration-200",
                  theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic className="w-4 h-4 text-kaizen-muted" />
              </motion.button>
              
              {/* Submit Button */}
              <motion.button
                onClick={handleGenerate}
                disabled={!originalText.trim() || !responseIdea.trim() || isGenerating}
                className={cn(
                  "absolute bottom-3 right-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "bg-kaizen-accent text-white hover:bg-kaizen-primary disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? "Generating..." : "Submit"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer Section */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* AI Writing Note */}
          <div className="flex items-center space-x-3">
            <span className={cn(
              "text-sm",
              theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
            )}>
              Write side by side with AI
            </span>
          </div>
          
          {/* AI Essay Writer Button */}
          <motion.button
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              theme === "light"
                ? "bg-kaizen-light-bg border border-kaizen-border text-kaizen-light-text hover:bg-kaizen-surface"
                : "bg-kaizen-dark-bg border border-kaizen-dark-border text-kaizen-dark-text hover:bg-kaizen-dark-surface"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CheckCircle className="w-4 h-4 text-kaizen-accent" />
            <span>AI Essay Writer</span>
          </motion.button>
          
          {/* Upgrade Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-kaizen-accent" />
              <span className={cn(
                "text-sm font-medium",
                theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
              )}>
                18
              </span>
              <motion.button
                className="flex items-center space-x-1 text-sm font-medium text-kaizen-accent hover:text-kaizen-primary transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Upgrade 29% OFF</span>
                <RefreshCw className="w-3 h-3" />
              </motion.button>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle className="w-4 h-4 text-kaizen-muted" />
              </motion.button>
              <motion.button
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle className="w-4 h-4 text-kaizen-muted" />
              </motion.button>
              <motion.button
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle className="w-4 h-4 text-kaizen-muted" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RewriterPage;
