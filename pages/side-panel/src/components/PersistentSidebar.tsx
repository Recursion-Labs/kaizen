import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@extension/ui";
import { 
  MessageCircle, 
  PenTool, 
  Languages, 
  FileCheck,
  Settings,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  User,
  Mail,
  Heart,
  Gift,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { ThemeToggle } from "@extension/ui";
import type React from "react";

type Section = "chat" | "write" | "translate" | "grammar" | "apis";

interface PersistentSidebarProps {
  theme: "light" | "dark";
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  onThemeToggle?: () => void;
}

const PersistentSidebar: React.FC<PersistentSidebarProps> = ({ 
  theme, 
  activeSection, 
  onSectionChange,
  onThemeToggle 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const mainNavItems = [
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
      id: "apis" as const,
      icon: Settings,
      label: "APIs",
      description: "Chrome APIs"
    }
  ];

  const bottomNavItems = [
    { icon: Settings, label: "Settings" },
    { icon: User, label: "Profile" },
    { icon: Mail, label: "Support" },
    { icon: Heart, label: "Feedback" },
    { icon: Gift, label: "Upgrade" },
    { icon: HelpCircle, label: "Help" }
  ];

  return (
    <motion.div
      className={cn(
        "w-30 flex flex-col items-center py-4 space-y-2 relative",
        theme === "light" 
          ? "bg-kaizen-light-bg border-l border-kaizen-border" 
          : "bg-kaizen-dark-bg border-l border-kaizen-dark-border"
      )}
      initial={{ width: 120 }}
      animate={{ width: 120 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >

      {/* Main Navigation */}
      <div className="flex flex-col space-y-3 flex-1">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "group flex flex-col items-center space-y-1 p-3 rounded-xl",
                "transition-all duration-200 hover:scale-105",
                isActive
                  ? "bg-kaizen-accent text-white shadow-md"
                  : theme === "light"
                    ? "text-kaizen-light-muted hover:text-kaizen-light-text hover:bg-kaizen-surface"
                    : "text-kaizen-dark-muted hover:text-kaizen-dark-text hover:bg-kaizen-dark-surface"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-5 h-5 transition-colors duration-200" />
              
              <span className="text-xs font-medium whitespace-nowrap transition-colors duration-200">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>


      {/* Bottom Navigation */}
      <div className="flex flex-col space-y-2">
        {bottomNavItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <motion.button
              key={index}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                "transition-all duration-200 hover:scale-110",
                theme === "light" ? "hover:bg-kaizen-surface text-kaizen-light-muted" : "hover:bg-kaizen-dark-surface text-kaizen-dark-muted"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
            </motion.button>
          );
        })}
      </div>

      {/* Theme Toggle */}
      {onThemeToggle && (
        <div className="mb-2">
          <ThemeToggle
            theme={theme}
            onToggle={onThemeToggle}
            className="scale-75"
          />
        </div>
      )}

      {/* User Profile */}
      <motion.button
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
          "transition-all duration-200 hover:scale-110"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <User className="w-4 h-4" />
      </motion.button>

    </motion.div>
  );
};

export default PersistentSidebar;
