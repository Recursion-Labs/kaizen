import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@extension/ui";
import { 
  PenTool, 
  FileText, 
  Sparkles,
  ChevronDown,
  Mic,
  Paperclip,
  Send,
  Wand2,
  BookOpen,
  Lightbulb,
  Target,
  Zap,
  Mail,
  List,
  Play,
  RefreshCw
} from "lucide-react";
import RewriterPage from "./RewriterPage";
import type React from "react";

interface WriterPageProps {
  theme: "light" | "dark";
}

const WriterPage: React.FC<WriterPageProps> = ({ theme }) => {
  const [activeMode, setActiveMode] = useState<"write" | "rewriter">("write");
  const [activeTab, setActiveTab] = useState<"write" | "reply">("write");
  const [selectedCategory, setSelectedCategory] = useState("Email");
  const [inputValue, setInputValue] = useState("");

  const categories = [
    { id: "Email", icon: Mail, color: "from-blue-500 to-cyan-500" },
    { id: "Essay", icon: BookOpen, color: "from-green-500 to-emerald-500" },
    { id: "Paragraph", icon: FileText, color: "from-purple-500 to-pink-500" },
    { id: "Idea", icon: Lightbulb, color: "from-yellow-500 to-orange-500" },
    { id: "Summary", icon: Target, color: "from-indigo-500 to-blue-500" },
    { id: "Outline", icon: List, color: "from-teal-500 to-green-500" },
    { id: "Script", icon: Play, color: "from-red-500 to-pink-500" },
    { id: "Report", icon: FileText, color: "from-gray-500 to-slate-500" }
  ];

  const tones = ["Professional", "Casual", "Formal", "Creative", "Friendly"];
  const lengths = ["Short", "Medium", "Long", "Very Long"];
  const languages = ["English", "Spanish", "French", "German", "Chinese"];

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
              <PenTool className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className={cn(
                "text-xl font-bold",
                theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
              )}>
                Writer
              </h1>
              <p className={cn(
                "text-sm",
                theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
              )}>
                AI-powered content creation
              </p>
            </div>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex space-x-1 p-1 rounded-xl bg-kaizen-surface">
            <motion.button
              onClick={() => setActiveMode("write")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeMode === "write"
                  ? "bg-kaizen-accent text-white shadow-sm"
                  : theme === "light" 
                    ? "text-kaizen-light-muted hover:text-kaizen-light-text" 
                    : "text-kaizen-dark-muted hover:text-kaizen-dark-text"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Writer
            </motion.button>
            <motion.button
              onClick={() => setActiveMode("rewriter")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeMode === "rewriter"
                  ? "bg-kaizen-accent text-white shadow-sm"
                  : theme === "light" 
                    ? "text-kaizen-light-muted hover:text-kaizen-light-text" 
                    : "text-kaizen-dark-muted hover:text-kaizen-dark-text"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Rewriter
            </motion.button>
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
            <Sparkles className="w-4 h-4" />
            <span>GPT-4</span>
            <ChevronDown className="w-3 h-3" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeMode === "rewriter" ? (
          <RewriterPage theme={theme} />
        ) : (
          <div className="p-6 space-y-6">
        {/* Tabs */}
        <motion.div 
          className="flex space-x-1 p-1 rounded-xl bg-kaizen-surface"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            onClick={() => setActiveTab("write")}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === "write"
                ? "bg-kaizen-accent text-white shadow-sm"
                : theme === "light" 
                  ? "text-kaizen-light-muted hover:text-kaizen-light-text" 
                  : "text-kaizen-dark-muted hover:text-kaizen-dark-text"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Write
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("reply")}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === "reply"
                ? "bg-kaizen-accent text-white shadow-sm"
                : theme === "light" 
                  ? "text-kaizen-light-muted hover:text-kaizen-light-text" 
                  : "text-kaizen-dark-muted hover:text-kaizen-dark-text"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reply
          </motion.button>
        </motion.div>

        {/* Category Pills */}
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  "hover:scale-105 flex items-center space-x-2",
                  isSelected
                    ? "bg-kaizen-accent text-white shadow-sm"
                    : theme === "light"
                      ? "bg-kaizen-surface text-kaizen-light-text border border-kaizen-border hover:border-kaizen-accent"
                      : "bg-kaizen-dark-surface text-kaizen-dark-text border border-kaizen-dark-border hover:border-kaizen-accent"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center",
                  `bg-gradient-to-r ${category.color}`
                )}>
                  <Icon className="w-2.5 h-2.5 text-white" />
                </div>
                <span>{category.id}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <select className={cn(
            "p-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-kaizen-accent",
            theme === "light"
              ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text"
              : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text"
          )}>
            {tones.map(tone => (
              <option key={tone} value={tone}>{tone} Tone</option>
            ))}
          </select>
          <select className={cn(
            "p-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-kaizen-accent",
            theme === "light"
              ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text"
              : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text"
          )}>
            {lengths.map(length => (
              <option key={length} value={length}>{length} Length</option>
            ))}
          </select>
          <select className={cn(
            "p-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-kaizen-accent",
            theme === "light"
              ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text"
              : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text"
          )}>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </motion.div>

        {/* Input Area */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Start writing your content here..."
              className={cn(
                "w-full p-4 rounded-xl border-2 resize-none focus:outline-none focus:ring-2 focus:ring-kaizen-accent transition-all duration-200",
                theme === "light"
                  ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text placeholder-kaizen-light-muted"
                  : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text placeholder-kaizen-dark-muted"
              )}
              rows={8}
            />
            
            {/* Input Actions */}
            <div className="absolute bottom-3 left-3 flex space-x-2">
              <motion.button
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  theme === "light" ? "hover:bg-kaizen-light-bg" : "hover:bg-kaizen-dark-bg"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mic className="w-4 h-4 text-kaizen-muted" />
              </motion.button>
              <motion.button
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  theme === "light" ? "hover:bg-kaizen-light-bg" : "hover:bg-kaizen-dark-bg"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Paperclip className="w-4 h-4 text-kaizen-muted" />
              </motion.button>
            </div>
          </div>
          
          <motion.button 
            className={cn(
              "w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2",
              "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
              "hover:shadow-lg transition-all duration-200"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate Content</span>
          </motion.button>
        </motion.div>

        {/* AI Note */}
        <motion.div 
          className={cn(
            "p-4 rounded-xl border-2 border-dashed text-center",
            theme === "light" ? "border-kaizen-border bg-kaizen-surface" : "border-kaizen-dark-border bg-kaizen-dark-surface"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className={cn(
            "text-sm mb-3",
            theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
          )}>
            Write side by side with AI
          </p>
          <motion.button 
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium",
              "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
              "hover:shadow-md transition-all duration-200"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WriterPage;
