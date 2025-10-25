import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, ThemeToggle } from "@extension/ui";
import { exampleThemeStorage } from "@extension/storage";
import PersistentSidebar from "./PersistentSidebar";
import ChatPage from "./pages/ChatPage";
import WriterPage from "./pages/WriterPage";
import TranslatePage from "./pages/TranslatePage";
import ChromeAPIsPage from "./pages/ChromeAPIsPage";
import GrammarPage from "./pages/GrammarPage";
import type React from "react";

type Section = "chat" | "write" | "translate" | "grammar" | "apis";

interface RestructuredSidePanelProps {
  theme: "light" | "dark";
}

const RestructuredSidePanel: React.FC<RestructuredSidePanelProps> = ({ theme }) => {
  const [activeSection, setActiveSection] = useState<Section>("chat");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleThemeToggle = () => {
    exampleThemeStorage.toggle();
  };

  const handleSectionChange = (section: Section) => {
    if (section === activeSection) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSection(section);
      setIsTransitioning(false);
    }, 150);
  };

  const renderPage = () => {
    switch (activeSection) {
      case "chat":
        return <ChatPage theme={theme} />;
      case "write":
        return <WriterPage theme={theme} />;
      case "translate":
        return <TranslatePage theme={theme} />;
        case "apis":
          return <ChromeAPIsPage theme={theme} />;
        case "grammar":
          return <GrammarPage theme={theme} />;
      default:
        return <ChatPage theme={theme} />;
    }
  };

  return (
    <div className={cn(
      "flex h-screen w-full overflow-hidden",
      theme === "light" ? "bg-kaizen-light-bg text-kaizen-light-text" : "bg-kaizen-dark-bg text-kaizen-dark-text"
    )}>
      {/* Main Content Area */}
      <motion.div 
        className="flex-1 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Page Content */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Persistent Sidebar */}
      <PersistentSidebar
        theme={theme}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onThemeToggle={handleThemeToggle}
      />
    </div>
  );
};

export default RestructuredSidePanel;
