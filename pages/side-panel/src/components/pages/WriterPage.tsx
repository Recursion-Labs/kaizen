import RewriterPage from "./RewriterPage";
import { AIOverlayManager } from "@extension/content-ui";
import { cn } from "@extension/ui";
import { motion } from "framer-motion";
import {
  PenTool, 
  FileText, 
  Sparkles,
  ChevronDown,
  Mic,
  Paperclip,
  Wand2,
  BookOpen,
  Lightbulb,
  Target,
  Mail,
  List,
  Play,
  
} from "lucide-react";
import { useState } from "react";

interface WriterPageProps {
  theme: "light" | "dark";
}

const WriterPage: React.FC<WriterPageProps> = ({ theme }) => {
  const [activeMode, setActiveMode] = useState<"write" | "rewriter">("write");
  const [selectedCategory, setSelectedCategory] = useState("Email");
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
              <div className="flex items-baseline space-x-6">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => setActiveMode("write")}
                      className={cn(
                        "text-2xl font-bold leading-none focus:outline-none",
                        activeMode === "write"
                          ? theme === "light"
                            ? "text-kaizen-light-text border-b-2 border-kaizen-accent pb-1"
                            : "text-kaizen-dark-text border-b-2 border-kaizen-accent pb-1"
                          : theme === "light"
                            ? "text-kaizen-light-muted"
                            : "text-kaizen-dark-muted"
                      )}
                    >
                      Writer
                    </button>
                    <button
                      onClick={() => setActiveMode("rewriter")}
                      className={cn(
                        "text-2xl font-bold leading-none focus:outline-none",
                        activeMode === "rewriter"
                          ? theme === "light"
                            ? "text-kaizen-light-text border-b-2 border-kaizen-accent pb-1"
                            : "text-kaizen-dark-text border-b-2 border-kaizen-accent pb-1"
                          : theme === "light"
                            ? "text-kaizen-light-muted"
                            : "text-kaizen-dark-muted"
                      )}
                    >
                      Rewriter
                    </button>
                  </div>

                  <div className="mt-1">
                    <p className={cn(
                      "text-sm",
                      theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-muted"
                    )}>
                      AI-powered content creation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Selector (right) */}
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
            <span>Writer APi</span>
            <span>Writer API</span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeMode === "rewriter" ? (
          <RewriterPage theme={theme} />
        ) : (
          <div className="p-6 space-y-6">
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
            <label 
              htmlFor="input-textarea"
              className={cn(
                "block text-sm font-medium mb-2",
                theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
              )}
            >
              Input
            </label>
            <textarea
              id="input-textarea"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Start writing your content here..."
              className={cn(
                "w-full p-4 rounded-xl border-2 resize-none focus:outline-none focus:ring-2 focus:ring-kaizen-accent transition-all duration-200",
                theme === "light"
                  ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text placeholder-kaizen-light-muted"
                  : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text placeholder-kaizen-dark-muted"
              )}
              rows={6}
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
            onClick={async () => {
              if (!inputValue.trim()) return;
              setIsGenerating(true);
              try {
                const manager = AIOverlayManager.getInstance();
                await manager.initialize();

                // Build a simple task prompt for the writer API
                const tone = "as-is"; // could be wired to UI later
                const length = "as-is";
                const task = `${selectedCategory} (${tone}, ${length}): ${inputValue}`;

                let generated = "";
                try {
                  if (manager.isAvailable("writer")) {
                    generated = await manager.write(task);
                  } else {
                    // Fallback to prompt API
                    generated = await manager.prompt(task);
                  }
                } catch (err) {
                  console.error("Writer API error:", err);
                  generated = "";
                }

                if (generated) {
                  // Fill the output with generated content
                  setOutputValue(generated);
                }
              } finally {
                setIsGenerating(false);
              }
            }}
            className={cn(
              "w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2",
              "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
              "hover:shadow-lg transition-all duration-200",
              isGenerating && "opacity-60 cursor-wait"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isGenerating}
          >
            <Wand2 className="w-4 h-4" />
            <span>{isGenerating ? "Generating..." : "Generate Content"}</span>
          </motion.button>
        </motion.div>

        {/* Output Area */}
        {outputValue && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative">
              <label 
                htmlFor="output-textarea"
                className={cn(
                  "block text-sm font-medium mb-2",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
                )}
              >
                Generated Output
              </label>
              <textarea
                id="output-textarea"
                value={outputValue}
                onChange={(e) => setOutputValue(e.target.value)}
                placeholder="Generated content will appear here..."
                className={cn(
                  "w-full p-4 rounded-xl border-2 resize-none focus:outline-none focus:ring-2 focus:ring-kaizen-accent transition-all duration-200",
                  theme === "light"
                    ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text placeholder-kaizen-light-muted"
                    : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text placeholder-kaizen-dark-muted"
                )}
                rows={8}
              />
              
              {/* Output Actions */}
              <div className="absolute bottom-3 left-3 flex space-x-2">
                <motion.button
                  onClick={() => {
                    navigator.clipboard.writeText(outputValue);
                  }}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    theme === "light" ? "hover:bg-kaizen-light-bg" : "hover:bg-kaizen-dark-bg"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Copy to clipboard"
                >
                  <svg className="w-4 h-4 text-kaizen-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={() => setOutputValue("")}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    theme === "light" ? "hover:bg-kaizen-light-bg" : "hover:bg-kaizen-dark-bg"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Clear output"
                >
                  <svg className="w-4 h-4 text-kaizen-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WriterPage;
