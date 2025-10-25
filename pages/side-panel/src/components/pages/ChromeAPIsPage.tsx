import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@extension/ui";
import { 
  Globe, 
  Download, 
  Upload, 
  Camera, 
  Mic, 
  Monitor, 
  FileText, 
  Settings,
  Zap,
  Shield,
  Database,
  Network,
  Smartphone,
  Laptop,
  Tablet
} from "lucide-react";
import type React from "react";

interface ChromeAPIsPageProps {
  theme: "light" | "dark";
}

const ChromeAPIsPage: React.FC<ChromeAPIsPageProps> = ({ theme }) => {
  const [activeCategory, setActiveCategory] = useState("storage");
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});

  const chromeAPIs = {
    storage: {
      title: "Storage APIs",
      description: "Manage extension data and user preferences",
      apis: [
        { name: "chrome.storage.local", description: "Local storage for extension data", icon: Database },
        { name: "chrome.storage.sync", description: "Sync data across devices", icon: Network },
        { name: "chrome.storage.session", description: "Temporary session storage", icon: Zap }
      ]
    },
    tabs: {
      title: "Tabs APIs", 
      description: "Interact with browser tabs and windows",
      apis: [
        { name: "chrome.tabs", description: "Create, update, and manage tabs", icon: Monitor },
        { name: "chrome.windows", description: "Manage browser windows", icon: Laptop },
        { name: "chrome.tabGroups", description: "Organize tabs into groups", icon: FileText }
      ]
    },
    content: {
      title: "Content Scripts",
      description: "Modify web pages and interact with DOM",
      apis: [
        { name: "chrome.scripting", description: "Inject scripts into pages", icon: Globe },
        { name: "chrome.contentScripts", description: "Register content scripts", icon: FileText },
        { name: "chrome.runtime", description: "Runtime messaging and events", icon: Zap }
      ]
    },
    permissions: {
      title: "Permissions & Security",
      description: "Manage permissions and security policies",
      apis: [
        { name: "chrome.permissions", description: "Request and manage permissions", icon: Shield },
        { name: "chrome.identity", description: "OAuth and user authentication", icon: Smartphone },
        { name: "chrome.cookies", description: "Manage browser cookies", icon: Database }
      ]
    },
    media: {
      title: "Media APIs",
      description: "Access camera, microphone, and media devices",
      apis: [
        { name: "chrome.tabCapture", description: "Capture tab audio/video", icon: Camera },
        { name: "chrome.desktopCapture", description: "Capture screen content", icon: Monitor },
        { name: "chrome.system.audio", description: "System audio management", icon: Mic }
      ]
    },
    files: {
      title: "File System APIs",
      description: "Read and write files on the system",
      apis: [
        { name: "chrome.fileSystem", description: "Access user-selected files", icon: FileText },
        { name: "chrome.downloads", description: "Manage downloads", icon: Download },
        { name: "chrome.fileManagerPrivate", description: "File manager integration", icon: Upload }
      ]
    }
  };

  const categories = Object.keys(chromeAPIs);

  useEffect(() => {
    // Simulate API availability check
    const checkAPIs = async () => {
      const status: Record<string, boolean> = {};
      categories.forEach(category => {
        chromeAPIs[category as keyof typeof chromeAPIs].apis.forEach(api => {
          status[api.name] = Math.random() > 0.3; // Simulate some APIs being available
        });
      });
      setApiStatus(status);
    };
    
    checkAPIs();
  }, []);

  return (
    <motion.div
      className={cn(
        "flex-1 flex flex-col h-full",
        theme === "light" ? "bg-gradient-to-br from-slate-50 to-blue-50" : "bg-gradient-to-br from-slate-900 to-blue-900"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className={cn(
        "px-6 py-4 border-b backdrop-blur-sm",
        theme === "light" 
          ? "border-slate-200 bg-white/80" 
          : "border-slate-700 bg-slate-800/80"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
              )}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Settings className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className={cn(
                "text-xl font-bold",
                theme === "light" ? "text-slate-800" : "text-slate-100"
              )}>
                Chrome APIs
              </h1>
              <p className={cn(
                "text-sm",
                theme === "light" ? "text-slate-600" : "text-slate-400"
              )}>
                Built-in browser capabilities
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              theme === "light" 
                ? "bg-green-100 text-green-800" 
                : "bg-green-900 text-green-200"
            )}>
              Available
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Category Tabs */}
        <motion.div 
          className="flex space-x-1 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeCategory === category
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : theme === "light"
                    ? "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-600"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {chromeAPIs[category as keyof typeof chromeAPIs].title}
            </motion.button>
          ))}
        </motion.div>

        {/* API List */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {chromeAPIs[activeCategory as keyof typeof chromeAPIs].apis.map((api, index) => {
            const Icon = api.icon;
            const isAvailable = apiStatus[api.name];
            
            return (
              <motion.div
                key={api.name}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-200 hover:scale-105",
                  theme === "light"
                    ? "bg-white border-slate-200 shadow-md hover:border-blue-300"
                    : "bg-slate-800 border-slate-700 shadow-md hover:border-blue-500"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isAvailable 
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : "bg-gradient-to-r from-red-500 to-pink-500"
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={cn(
                        "text-sm font-semibold",
                        theme === "light" ? "text-slate-800" : "text-slate-100"
                      )}>
                        {api.name}
                      </h3>
                      
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        isAvailable
                          ? theme === "light"
                            ? "bg-green-100 text-green-800"
                            : "bg-green-900 text-green-200"
                          : theme === "light"
                            ? "bg-red-100 text-red-800"
                            : "bg-red-900 text-red-200"
                      )}>
                        {isAvailable ? "Available" : "Restricted"}
                      </span>
                    </div>
                    
                    <p className={cn(
                      "text-xs mt-1",
                      theme === "light" ? "text-slate-600" : "text-slate-400"
                    )}>
                      {api.description}
                    </p>
                  </div>
                  
                  <motion.button
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-medium",
                      isAvailable
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-slate-300 text-slate-500 cursor-not-allowed"
                    )}
                    whileHover={isAvailable ? { scale: 1.05 } : {}}
                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                    disabled={!isAvailable}
                  >
                    {isAvailable ? "Use API" : "Unavailable"}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* API Usage Stats */}
        <motion.div 
          className={cn(
            "mt-8 p-4 rounded-xl border",
            theme === "light"
              ? "bg-white border-slate-200 shadow-md"
              : "bg-slate-800 border-slate-700 shadow-md"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className={cn(
            "text-lg font-semibold mb-3",
            theme === "light" ? "text-slate-800" : "text-slate-100"
          )}>
            API Usage Statistics
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={cn(
                "text-2xl font-bold",
                theme === "light" ? "text-blue-600" : "text-blue-400"
              )}>
                {Object.values(apiStatus).filter(Boolean).length}
              </div>
              <div className={cn(
                "text-xs",
                theme === "light" ? "text-slate-600" : "text-slate-400"
              )}>
                Available APIs
              </div>
            </div>
            
            <div className="text-center">
              <div className={cn(
                "text-2xl font-bold",
                theme === "light" ? "text-purple-600" : "text-purple-400"
              )}>
                {categories.length}
              </div>
              <div className={cn(
                "text-xs",
                theme === "light" ? "text-slate-600" : "text-slate-400"
              )}>
                Categories
              </div>
            </div>
            
            <div className="text-center">
              <div className={cn(
                "text-2xl font-bold",
                theme === "light" ? "text-green-600" : "text-green-400"
              )}>
                {Math.round((Object.values(apiStatus).filter(Boolean).length / Object.keys(apiStatus).length) * 100)}%
              </div>
              <div className={cn(
                "text-xs",
                theme === "light" ? "text-slate-600" : "text-slate-400"
              )}>
                Coverage
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChromeAPIsPage;
