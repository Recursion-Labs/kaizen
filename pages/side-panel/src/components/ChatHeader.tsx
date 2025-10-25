import { cn } from "@extension/ui";
import type React from "react";

interface ChatHeaderProps {
  theme: "light" | "dark";
  onNewChat: () => void;
  onToggleHistory: () => void;
  onOpenSettings: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  theme,
  onNewChat,
  onToggleHistory,
  onOpenSettings,
}) => (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-4 border-b",
        theme === "light"
          ? "bg-white border-slate-200 shadow-sm"
          : "bg-gray-800 border-gray-700",
      )}
    >
      <div className="flex items-center space-x-3">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            "bg-gradient-to-r from-blue-500 to-purple-600",
          )}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div>
          <h1
            className={cn(
              "text-lg font-bold",
              theme === "light" ? "text-gray-900" : "text-white",
            )}
          >
            Kaizen Assistant
          </h1>
          <p
            className={cn(
              "text-xs",
              theme === "light" ? "text-gray-500" : "text-gray-400",
            )}
          >
            AI-powered browsing help
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            theme === "light" ? "text-gray-600" : "text-gray-400",
          )}
          title="New Conversation"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        {/* Chat History Button */}
        <button
          onClick={onToggleHistory}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            theme === "light" ? "text-gray-600" : "text-gray-400",
          )}
          title="Chat History"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            theme === "light" ? "text-gray-600" : "text-gray-400",
          )}
          title="Open Settings"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
