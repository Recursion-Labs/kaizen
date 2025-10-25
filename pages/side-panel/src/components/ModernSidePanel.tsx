import { useState, useEffect } from "react";
import { cn } from "@extension/ui";
import { 
  MessageCircle, 
  PenTool, 
  Languages, 
  MoreHorizontal,
  Monitor,
  Search,
  FileText,
  Presentation,
  BookOpen,
  Mic,
  Paperclip,
  Filter,
  Clock,
  Plus,
  Brain,
  Volume2,
  Trash2,
  Copy,
  ChevronDown,
  Sparkles,
  Settings,
  History,
  Heart,
  HelpCircle,
  Gift,
  Mail,
  User
} from "lucide-react";
import type React from "react";

type Section = "chat" | "write" | "translate" | "more";

interface ModernSidePanelProps {
  theme: "light" | "dark";
}

const ModernSidePanel: React.FC<ModernSidePanelProps> = ({ theme }) => {
  const [activeSection, setActiveSection] = useState<Section>("chat");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSectionChange = (section: Section) => {
    if (section === activeSection) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSection(section);
      setIsTransitioning(false);
    }, 150);
  };

  const navItems = [
    {
      id: "chat" as const,
      icon: MessageCircle,
      label: "Chat",
      description: "AI Assistant"
    },
    {
      id: "write" as const,
      icon: PenTool,
      label: "Write",
      description: "Content Creation"
    },
    {
      id: "translate" as const,
      icon: Languages,
      label: "Translate",
      description: "Language Tools"
    },
    {
      id: "more" as const,
      icon: MoreHorizontal,
      label: "More",
      description: "Additional Tools"
    }
  ];

  const quickActions = [
    { icon: Monitor, label: "Full Screen Chat", color: "bg-kaizen-accent" },
    { icon: Search, label: "Deep Research", color: "bg-kaizen-primary" },
    { icon: FileText, label: "My Highlights", color: "bg-kaizen-secondary" },
    { icon: Presentation, label: "AI Slides", color: "bg-kaizen-accent" }
  ];

  const writeCategories = [
    "Email", "Essay", "Paragraph", "Idea", "Summary", "Outline", "Script", "Report"
  ];

  const moreOptions = [
    { icon: History, label: "History", description: "View past conversations" },
    { icon: FileText, label: "Saved Notes", description: "Your saved content" },
    { icon: Settings, label: "Theme", description: "Customize appearance" },
    { icon: Heart, label: "Feedback", description: "Share your thoughts" },
    { icon: HelpCircle, label: "About", description: "Learn more" }
  ];

  return (
    <div className={cn(
      "flex h-screen w-full overflow-hidden",
      theme === "light" ? "bg-kaizen-light-bg" : "bg-kaizen-dark-bg"
    )}>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={cn(
          "px-6 py-4 border-b",
          theme === "light" ? "border-kaizen-border" : "border-kaizen-dark-border"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                "bg-gradient-to-r from-kaizen-accent to-kaizen-primary"
              )}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className={cn(
                  "text-lg font-semibold",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
                )}>
                  Kaizen
                </h1>
                <p className={cn(
                  "text-xs",
                  theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
                )}>
                  AI-Powered Assistant
                </p>
              </div>
            </div>
            
            {/* Model Selector */}
            <div className="flex items-center space-x-2">
              <div className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-lg",
                "bg-gradient-to-r from-kaizen-accent to-kaizen-primary",
                "text-white text-sm font-medium cursor-pointer",
                "hover:shadow-lg transition-all duration-200 hover:scale-105"
              )}>
                <Brain className="w-4 h-4" />
                <span>GPT-4</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className={cn(
            "transition-all duration-300 ease-in-out",
            isTransitioning ? "opacity-0 transform translate-y-2" : "opacity-100 transform translate-y-0"
          )}>
            {activeSection === "chat" && (
              <ChatSection theme={theme} quickActions={quickActions} />
            )}
            {activeSection === "write" && (
              <WriteSection theme={theme} categories={writeCategories} />
            )}
            {activeSection === "translate" && (
              <TranslateSection theme={theme} />
            )}
            {activeSection === "more" && (
              <MoreSection theme={theme} options={moreOptions} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          "px-6 py-3 border-t",
          theme === "light" ? "border-kaizen-border" : "border-kaizen-dark-border"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={cn(
                "text-xs font-medium",
                theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
              )}>
                AI Ready
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Gift className="w-4 h-4 text-kaizen-accent" />
              <span className="text-xs text-kaizen-accent font-medium">Upgrade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Navigation Bar */}
      <div className={cn(
        "w-16 flex flex-col items-center py-4 space-y-2",
        theme === "light" ? "bg-kaizen-surface border-l border-kaizen-border" : "bg-kaizen-dark-surface border-l border-kaizen-dark-border"
      )}>
        {/* Top Controls */}
        <div className="flex flex-col space-y-2 mb-4">
          <button className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            "transition-all duration-200 hover:scale-110",
            theme === "light" ? "hover:bg-kaizen-light-bg" : "hover:bg-kaizen-dark-bg"
          )}>
            <ChevronDown className="w-4 h-4 text-kaizen-muted" />
          </button>
          <button className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            "transition-all duration-200 hover:scale-110",
            theme === "light" ? "hover:bg-kaizen-light-bg" : "hover:bg-kaizen-dark-bg"
          )}>
            <Settings className="w-4 h-4 text-kaizen-muted" />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex flex-col space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={cn(
                  "group relative flex flex-col items-center space-y-1 p-2 rounded-xl",
                  "transition-all duration-200 hover:scale-110",
                  isActive
                    ? "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white shadow-lg"
                    : theme === "light"
                      ? "text-kaizen-light-muted hover:text-kaizen-light-text hover:bg-kaizen-surface"
                      : "text-kaizen-dark-muted hover:text-kaizen-dark-text hover:bg-kaizen-dark-surface"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isActive ? "text-white" : "group-hover:scale-110"
                )} />
                <span className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive ? "text-white" : ""
                )}>
                  {item.label}
                </span>
                
                {/* Glow effect for active item */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-kaizen-accent to-kaizen-primary opacity-20 blur-sm -z-10"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Icons */}
        <div className="flex flex-col space-y-2 mt-auto">
          <button className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            "transition-all duration-200 hover:scale-110",
            theme === "light" ? "hover:bg-kaizen-light-bg" : "hover:bg-kaizen-dark-bg"
          )}>
            <Mail className="w-4 h-4 text-kaizen-muted" />
          </button>
          <button className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            "transition-all duration-200 hover:scale-110",
            theme === "light" ? "hover:bg-kaizen-light-bg" : "hover:bg-kaizen-dark-bg"
          )}>
            <User className="w-4 h-4 text-kaizen-muted" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Chat Section Component
const ChatSection: React.FC<{
  theme: "light" | "dark";
  quickActions: Array<{ icon: any; label: string; color: string }>;
}> = ({ theme, quickActions }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Greeting */}
      <div className="text-center space-y-2">
        <h2 className={cn(
          "text-2xl font-bold",
          theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
        )}>
          Hi,
        </h2>
        <p className={cn(
          "text-lg",
          theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
        )}>
          How can I assist you today?
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className={cn(
                "p-4 rounded-xl border-2 border-dashed transition-all duration-200",
                "hover:scale-105 hover:shadow-lg group",
                theme === "light" 
                  ? "border-kaizen-border hover:border-kaizen-accent bg-kaizen-surface" 
                  : "border-kaizen-dark-border hover:border-kaizen-accent bg-kaizen-dark-surface"
              )}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  action.color,
                  "group-hover:scale-110 transition-transform duration-200"
                )}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className={cn(
                  "text-sm font-medium text-center",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
                )}>
                  {action.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Beginner's Guide */}
      <button className={cn(
        "w-full p-4 rounded-xl flex items-center justify-between",
        "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
        "hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
      )}>
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">Beginner's Guide</span>
        </div>
        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
      </button>

      {/* Input Area */}
      <div className="space-y-3">
        {/* Input Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className={cn(
              "p-2 rounded-lg transition-all duration-200 hover:scale-110",
              theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
            )}>
              <Paperclip className="w-4 h-4 text-kaizen-muted" />
            </button>
            <button className={cn(
              "p-2 rounded-lg transition-all duration-200 hover:scale-110",
              theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
            )}>
              <BookOpen className="w-4 h-4 text-kaizen-muted" />
            </button>
            <button className={cn(
              "p-2 rounded-lg transition-all duration-200 hover:scale-110",
              theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
            )}>
              <Filter className="w-4 h-4 text-kaizen-muted" />
            </button>
            <button className={cn(
              "p-2 rounded-lg transition-all duration-200 hover:scale-110",
              theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
            )}>
              <Clock className="w-4 h-4 text-kaizen-muted" />
            </button>
            <button className={cn(
              "p-2 rounded-lg transition-all duration-200 hover:scale-110",
              "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white"
            )}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Input */}
        <div className="relative">
          <textarea
            placeholder="Ask anything, @ models, / prompts"
            className={cn(
              "w-full p-4 pr-12 rounded-xl border-2 resize-none",
              "focus:outline-none focus:ring-2 focus:ring-kaizen-accent transition-all duration-200",
              theme === "light" 
                ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text placeholder-kaizen-light-muted" 
                : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text placeholder-kaizen-dark-muted"
            )}
            rows={3}
          />
          
          {/* Input Actions */}
          <div className="absolute bottom-3 left-3 flex space-x-2">
            <button className={cn(
              "px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1",
              "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
              "hover:shadow-md transition-all duration-200 hover:scale-105"
            )}>
              <Brain className="w-3 h-3" />
              <span>Think</span>
            </button>
            <button className={cn(
              "px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1",
              "bg-gradient-to-r from-kaizen-primary to-kaizen-secondary text-white",
              "hover:shadow-md transition-all duration-200 hover:scale-105"
            )}>
              <Search className="w-3 h-3" />
              <span>Research</span>
            </button>
          </div>

          <button className={cn(
            "absolute bottom-3 right-3 p-2 rounded-lg",
            "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
            "hover:shadow-lg transition-all duration-200 hover:scale-110"
          )}>
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Write Section Component
const WriteSection: React.FC<{
  theme: "light" | "dark";
  categories: string[];
}> = ({ theme, categories }) => {
  const [activeTab, setActiveTab] = useState<"write" | "reply">("write");
  const [selectedCategory, setSelectedCategory] = useState("Email");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className={cn(
          "text-2xl font-bold",
          theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
        )}>
          Write
        </h2>
        <p className={cn(
          "text-sm",
          theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
        )}>
          Create content with AI assistance
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 rounded-xl bg-kaizen-surface">
        <button
          onClick={() => setActiveTab("write")}
          className={cn(
            "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === "write"
              ? "bg-kaizen-accent text-white shadow-sm"
              : theme === "light" 
                ? "text-kaizen-light-muted hover:text-kaizen-light-text" 
                : "text-kaizen-dark-muted hover:text-kaizen-dark-text"
          )}
        >
          Write
        </button>
        <button
          onClick={() => setActiveTab("reply")}
          className={cn(
            "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === "reply"
              ? "bg-kaizen-accent text-white shadow-sm"
              : theme === "light" 
                ? "text-kaizen-light-muted hover:text-kaizen-light-text" 
                : "text-kaizen-dark-muted hover:text-kaizen-dark-text"
          )}
        >
          Reply
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              "hover:scale-105",
              selectedCategory === category
                ? "bg-kaizen-accent text-white shadow-sm"
                : theme === "light"
                  ? "bg-kaizen-surface text-kaizen-light-text border border-kaizen-border hover:border-kaizen-accent"
                  : "bg-kaizen-dark-surface text-kaizen-dark-text border border-kaizen-dark-border hover:border-kaizen-accent"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex space-x-3">
        <select className={cn(
          "flex-1 p-3 rounded-lg border text-sm",
          "focus:outline-none focus:ring-2 focus:ring-kaizen-accent",
          theme === "light"
            ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text"
            : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text"
        )}>
          <option>Professional Tone</option>
          <option>Casual Tone</option>
          <option>Formal Tone</option>
        </select>
        <select className={cn(
          "flex-1 p-3 rounded-lg border text-sm",
          "focus:outline-none focus:ring-2 focus:ring-kaizen-accent",
          theme === "light"
            ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text"
            : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text"
        )}>
          <option>Medium Length</option>
          <option>Short</option>
          <option>Long</option>
        </select>
        <select className={cn(
          "flex-1 p-3 rounded-lg border text-sm",
          "focus:outline-none focus:ring-2 focus:ring-kaizen-accent",
          theme === "light"
            ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text"
            : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text"
        )}>
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <textarea
          placeholder="Start writing your content here..."
          className={cn(
            "w-full p-4 rounded-xl border-2 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-kaizen-accent transition-all duration-200",
            theme === "light"
              ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text placeholder-kaizen-light-muted"
              : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text placeholder-kaizen-dark-muted"
          )}
          rows={8}
        />
        
        <button className={cn(
          "w-full py-3 rounded-xl font-medium",
          "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
          "hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
        )}>
          Generate Content
        </button>
      </div>

      {/* Note */}
      <div className={cn(
        "p-4 rounded-xl border-2 border-dashed",
        theme === "light" ? "border-kaizen-border bg-kaizen-surface" : "border-kaizen-dark-border bg-kaizen-dark-surface"
      )}>
        <p className={cn(
          "text-sm text-center",
          theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
        )}>
          Write side by side with AI
        </p>
        <button className={cn(
          "mt-2 mx-auto block px-4 py-2 rounded-lg text-sm font-medium",
          "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
          "hover:shadow-md transition-all duration-200 hover:scale-105"
        )}>
          Learn More
        </button>
      </div>
    </div>
  );
};

// Translate Section Component
const TranslateSection: React.FC<{
  theme: "light" | "dark";
}> = ({ theme }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className={cn(
          "text-2xl font-bold",
          theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
        )}>
          Translate
        </h2>
        <p className={cn(
          "text-sm",
          theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
        )}>
          Translate text between languages
        </p>
      </div>

      {/* Language Selectors */}
      <div className="flex items-center space-x-3">
        <select className={cn(
          "flex-1 p-3 rounded-lg border text-sm",
          "focus:outline-none focus:ring-2 focus:ring-kaizen-accent",
          theme === "light"
            ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text"
            : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text"
        )}>
          <option>English (Detected)</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
        </select>
        
        <button className={cn(
          "p-2 rounded-lg transition-all duration-200 hover:scale-110",
          theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
        )}>
          <Languages className="w-4 h-4 text-kaizen-muted" />
        </button>
        
        <select className={cn(
          "flex-1 p-3 rounded-lg border text-sm",
          "focus:outline-none focus:ring-2 focus:ring-kaizen-accent",
          theme === "light"
            ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text"
            : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text"
        )}>
          <option>Marathi</option>
          <option>Hindi</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>

      {/* Text Area */}
      <div className="space-y-3">
        <textarea
          placeholder="Enter text to translate..."
          className={cn(
            "w-full p-4 rounded-xl border-2 resize-none",
            "focus:outline-none focus:ring-2 focus:ring-kaizen-accent transition-all duration-200",
            theme === "light"
              ? "bg-kaizen-surface border-kaizen-border text-kaizen-light-text placeholder-kaizen-light-muted"
              : "bg-kaizen-dark-surface border-kaizen-dark-border text-kaizen-dark-text placeholder-kaizen-dark-muted"
          )}
          rows={6}
        />
        
        {/* Input Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className={cn(
              "p-2 rounded-lg transition-all duration-200 hover:scale-110",
              theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
            )}>
              <Mic className="w-4 h-4 text-kaizen-muted" />
            </button>
            <button className={cn(
              "p-2 rounded-lg transition-all duration-200 hover:scale-110",
              theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
            )}>
              <Trash2 className="w-4 h-4 text-kaizen-muted" />
            </button>
            <button className={cn(
              "p-2 rounded-lg transition-all duration-200 hover:scale-110",
              theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
            )}>
              <Volume2 className="w-4 h-4 text-kaizen-muted" />
            </button>
          </div>
          
          <button className={cn(
            "px-6 py-2 rounded-lg font-medium",
            "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
            "hover:shadow-lg transition-all duration-200 hover:scale-105"
          )}>
            Translate
          </button>
        </div>
      </div>
    </div>
  );
};

// More Section Component
const MoreSection: React.FC<{
  theme: "light" | "dark";
  options: Array<{ icon: any; label: string; description: string }>;
}> = ({ theme, options }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className={cn(
          "text-2xl font-bold",
          theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
        )}>
          More
        </h2>
        <p className={cn(
          "text-sm",
          theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
        )}>
          Additional tools and settings
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-2">
        {options.map((option, index) => {
          const Icon = option.icon;
          return (
            <button
              key={index}
              className={cn(
                "w-full p-4 rounded-xl flex items-center space-x-4",
                "transition-all duration-200 hover:scale-[1.02] hover:shadow-md",
                theme === "light"
                  ? "bg-kaizen-surface hover:bg-kaizen-light-bg border border-kaizen-border"
                  : "bg-kaizen-dark-surface hover:bg-kaizen-dark-bg border border-kaizen-dark-border"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                "bg-gradient-to-r from-kaizen-accent to-kaizen-primary"
              )}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className={cn(
                  "font-medium",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
                )}>
                  {option.label}
                </h3>
                <p className={cn(
                  "text-sm",
                  theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
                )}>
                  {option.description}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-kaizen-muted rotate-[-90deg]" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModernSidePanel;
