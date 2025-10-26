import { cn } from "@extension/ui";
import { motion } from "framer-motion";
import {
  AlarmClock,
  Bell,
  Bolt,
  Cloud,
  Cpu,
  Database,
  LayoutPanelLeft,
  ListChecks,
  Monitor,
  Network,
  Settings,
  ShieldCheck,
  Sparkles,
  Timer
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import type React from "react";

interface ChromeAPIsPageProps {
  theme: "light" | "dark";
}

type ApiEntry = {
  name: string;
  description: string;
  usage: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  availabilityPath?: readonly string[];
};

type ApiCategory = {
  title: string;
  description: string;
  apis: ApiEntry[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const hasChromePath = (root: unknown, path: readonly string[] = []): boolean => {
  if (!path.length) return Boolean(root);
  let current: unknown = root;
  for (const segment of path) {
    if (!isRecord(current) || !(segment in current)) {
      return false;
    }
    current = current[segment as keyof typeof current];
  }
  return Boolean(current);
};

const ChromeAPIsPage: React.FC<ChromeAPIsPageProps> = ({ theme }) => {
  const chromeAPIs = useMemo<Record<string, ApiCategory>>(
    () => ({
      experience: {
        title: "Surface & Access",
        description: "Make Kaizen available right where users browse.",
        apis: [
          {
            name: "chrome.sidePanel",
            description: "Register and control the Kaizen side panel entry point.",
            usage: "Hosts the responsive assistant UI alongside any webpage.",
            icon: LayoutPanelLeft,
            availabilityPath: ["sidePanel"]
          },
          {
            name: "chrome.contextMenus",
            description: "Add quick actions to the browser context menu.",
            usage: "Trigger rewrites, grammar checks, or focus tools from selected text.",
            icon: ListChecks,
            availabilityPath: ["contextMenus"]
          },
          {
            name: "chrome.action",
            description: "Control the toolbar action and badges.",
            usage: "Toggle focus mode and surface live wellbeing signals from the toolbar.",
            icon: Bolt,
            availabilityPath: ["action"]
          }
        ]
      },
      automation: {
        title: "Automation & Insights",
        description: "Run Kaizen detectors and background routines.",
        apis: [
          {
            name: "chrome.scripting",
            description: "Inject logic into active pages and frames.",
            usage: "Deploy doomscrolling, shopping, and time-on-task detectors in real time.",
            icon: Cpu,
            availabilityPath: ["scripting"]
          },
          {
            name: "chrome.tabs",
            description: "Inspect and react to tab activity.",
            usage: "Track tab switching to keep wellness stats accurate across contexts.",
            icon: Monitor,
            availabilityPath: ["tabs"]
          },
          {
            name: "chrome.alarms",
            description: "Schedule recurring background jobs.",
            usage: "Queue periodic wellbeing nudges and recovery reminders.",
            icon: AlarmClock,
            availabilityPath: ["alarms"]
          }
        ]
      },
      knowledge: {
        title: "Knowledge & State",
        description: "Persist habits and share context between modules.",
        apis: [
          {
            name: "chrome.storage.local",
            description: "Store data on the device.",
            usage: "Remember user goals, detector thresholds, and AI session drafts.",
            icon: Database,
            availabilityPath: ["storage", "local"]
          },
          {
            name: "chrome.storage.sync",
            description: "Sync lightweight data across Chrome profiles.",
            usage: "Carry wellness streaks and personalization between machines.",
            icon: Cloud,
            availabilityPath: ["storage", "sync"]
          },
          {
            name: "chrome.runtime",
            description: "Communicate across extension contexts.",
            usage: "Coordinate messages between the side panel, service worker, and content scripts.",
            icon: Network,
            availabilityPath: ["runtime"]
          }
        ]
      },
      wellbeing: {
        title: "Wellbeing & Trust",
        description: "Deliver nurturing nudges while staying privacy aware.",
        apis: [
          {
            name: "chrome.notifications",
            description: "Show rich notifications.",
            usage: "Celebrate progress and gently interrupt unhealthy browsing loops.",
            icon: Bell,
            availabilityPath: ["notifications"]
          },
          {
            name: "chrome.idle",
            description: "Detect idle state changes.",
            usage: "Pause timers and adjust habit scoring when the user steps away.",
            icon: Timer,
            availabilityPath: ["idle"]
          },
          {
            name: "chrome.permissions",
            description: "Request optional capabilities.",
            usage: "Earn trust gradually before analyzing extra browsing signals.",
            icon: ShieldCheck,
            availabilityPath: ["permissions"]
          }
        ]
      }
    }),
    []
  );

  const categories = useMemo(() => Object.keys(chromeAPIs), [chromeAPIs]);

  const [activeCategory, setActiveCategory] = useState(() => categories[0] ?? "");
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!categories.includes(activeCategory) && categories[0]) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    const checkAPIs = async () => {
      const globalChrome = (globalThis as { chrome?: unknown }).chrome;
      const status: Record<string, boolean> = {};
      categories.forEach((category) => {
        chromeAPIs[category].apis.forEach((api) => {
          if (!globalChrome) {
            status[api.name] = false;
            return;
          }
          status[api.name] = api.availabilityPath
            ? hasChromePath(globalChrome, api.availabilityPath)
            : true;
        });
      });
      setApiStatus(status);
    };
    
    checkAPIs();
  }, [categories, chromeAPIs]);

  const activeConfig = chromeAPIs[activeCategory];
  const totalApis = Object.keys(apiStatus).length || 1;
  const availableCount = Object.values(apiStatus).filter(Boolean).length;
  const coverage = Math.round((availableCount / totalApis) * 100);

  return (
    <motion.div
      className={cn(
        "flex-1 flex flex-col h-full",
        theme === "light"
          ? "bg-gradient-to-br from-slate-50 to-blue-50"
          : "bg-gradient-to-br from-slate-900 to-blue-900"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div
        className={cn(
          "px-4 py-3 border-b backdrop-blur-sm",
          theme === "light"
            ? "border-slate-200 bg-white/80"
            : "border-slate-800 bg-slate-900/80"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <motion.div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
              )}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Settings className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <h1 className={cn(
                "text-base font-semibold",
                theme === "light" ? "text-slate-800" : "text-slate-100"
              )}>
                Chrome APIs
              </h1>
              <p className={cn(
                "text-xs",
                theme === "light" ? "text-slate-600" : "text-slate-400"
              )}>
                Browser capabilities powering Kaizen
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[11px] px-2 py-1 rounded-full",
              theme === "light"
                ? "bg-green-100 text-green-700"
                : "bg-green-900 text-green-200"
            )}>
              Runtime detected
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-w-[140px] text-left",
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
        {activeConfig && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-1">
              <h2
                className={cn(
                  "text-sm font-semibold",
                  theme === "light" ? "text-slate-800" : "text-slate-200"
                )}
              >
                {activeConfig.title}
              </h2>
              <p
                className={cn(
                  "text-xs",
                  theme === "light" ? "text-slate-600" : "text-slate-400"
                )}
              >
                {activeConfig.description}
              </p>
            </div>

            {activeConfig.apis.map((api, index) => {
              const Icon = api.icon;
              const isAvailable = apiStatus[api.name];

              return (
                <motion.div
                  key={api.name}
                  className={cn(
                    "p-3 rounded-xl border transition-all duration-200",
                    theme === "light"
                      ? "bg-white border-slate-200 shadow-sm hover:border-blue-300"
                      : "bg-slate-900/60 border-slate-700 hover:border-blue-500"
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                        isAvailable
                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                          : "bg-gradient-to-r from-slate-600 to-slate-700"
                      )}
                    >
                      <Icon className="w-[18px] h-[18px] text-white" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={cn(
                            "text-sm font-semibold",
                            theme === "light" ? "text-slate-800" : "text-slate-100"
                          )}
                        >
                          {api.name}
                        </h3>
                        <span
                          className={cn(
                            "text-[11px] px-2 py-0.5 rounded-full",
                            isAvailable
                              ? theme === "light"
                                ? "bg-green-100 text-green-700"
                                : "bg-green-900/70 text-green-200"
                              : theme === "light"
                                ? "bg-slate-200 text-slate-600"
                                : "bg-slate-700 text-slate-400"
                          )}
                        >
                          {isAvailable ? "Ready" : "Runtime unavailable"}
                        </span>
                      </div>

                      <p
                        className={cn(
                          "text-xs leading-relaxed",
                          theme === "light" ? "text-slate-600" : "text-slate-400"
                        )}
                      >
                        {api.description}
                      </p>
                      <p
                        className={cn(
                          "text-[11px] leading-relaxed",
                          theme === "light" ? "text-slate-500" : "text-slate-500"
                        )}
                      >
                        <Sparkles className="inline-block w-[14px] h-[14px] mr-1 text-kaizen-accent" />
                        {api.usage}
                      </p>
                    </div>

                    <motion.button
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap",
                        isAvailable
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-slate-300 text-slate-500 cursor-not-allowed"
                      )}
                      whileHover={isAvailable ? { scale: 1.05 } : {}}
                      whileTap={isAvailable ? { scale: 0.95 } : {}}
                      disabled={!isAvailable}
                    >
                      {isAvailable ? "In Use" : "Not detected"}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* API Usage Stats */}
        <motion.div
          className={cn(
            "p-4 rounded-xl border",
            theme === "light"
              ? "bg-white border-slate-200 shadow-md"
              : "bg-slate-900/70 border-slate-700 shadow-sm"
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
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={cn(
                "text-2xl font-bold",
                theme === "light" ? "text-blue-600" : "text-blue-400"
              )}>
                {availableCount}
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
                {coverage}%
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
