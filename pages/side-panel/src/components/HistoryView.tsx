import { cn } from "@extension/ui";
import type React from "react";

interface Conversation {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    image?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

interface HistoryViewProps {
  theme: "light" | "dark";
  conversations: Conversation[];
  currentConversationId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
  onBackToChat: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  theme,
  conversations,
  currentConversationId,
  searchQuery,
  onSearchChange,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onBackToChat,
}) => {
  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    // Search in conversation title
    if (conversation.title.toLowerCase().includes(query)) return true;

    // Search in message content
    return conversation.messages.some((message) =>
      message.content.toLowerCase().includes(query),
    );
  });

  return (
    <div className="flex flex-col h-full w-full">
      {/* History Header */}
      <header
        className={cn(
          "flex items-center justify-between px-6 py-4 border-b",
          theme === "light"
            ? "bg-white border-slate-200 shadow-sm"
            : "bg-gray-800 border-gray-700",
        )}
      >
        <div className="flex items-center space-x-3">
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
          <h2
            className={cn(
              "text-lg font-bold",
              theme === "light" ? "text-gray-900" : "text-white",
            )}
          >
            Chat History
          </h2>
        </div>
        <button
          onClick={onBackToChat}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            theme === "light" ? "text-gray-600" : "text-gray-400",
          )}
          title="Back to chat"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </header>

      {/* History Search and New Chat */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "w-full px-4 py-2 rounded-lg border text-sm",
            theme === "light"
              ? "bg-slate-50 border-slate-200 text-gray-900 placeholder-gray-400"
              : "bg-gray-900 border-gray-700 text-white placeholder-gray-500",
          )}
        />
        <button
          onClick={onNewConversation}
          className={cn(
            "w-full px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
            theme === "light"
              ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
              : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
          )}
        >
          New Conversation
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredConversations.length === 0 ? (
          <p
            className={cn(
              "text-sm text-center py-12",
              theme === "light" ? "text-gray-500" : "text-gray-400",
            )}
          >
            {searchQuery.trim()
              ? "No conversations match your search."
              : "No conversations yet. Start a new chat!"}
          </p>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectConversation(conversation.id);
                }
              }}
              role="button"
              tabIndex={0}
              className={cn(
                "p-3 rounded-lg cursor-pointer transition-all hover:shadow-md group relative focus:outline-none focus:ring-2 focus:ring-blue-500",
                currentConversationId === conversation.id
                  ? theme === "light"
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-blue-900/30 border border-blue-700"
                  : theme === "light"
                    ? "bg-slate-100 hover:bg-slate-200"
                    : "bg-gray-700 hover:bg-gray-600",
              )}
              aria-label={`Select conversation: ${conversation.title}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "text-sm font-medium mb-1 truncate",
                      theme === "light" ? "text-gray-900" : "text-white",
                    )}
                  >
                    {conversation.title}
                  </div>
                  <p
                    className={cn(
                      "text-xs line-clamp-2",
                      theme === "light" ? "text-gray-600" : "text-gray-300",
                    )}
                  >
                    {conversation.messages.length} messages
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-2",
                      theme === "light" ? "text-gray-500" : "text-gray-400",
                    )}
                  >
                    {conversation.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => onDeleteConversation(conversation.id, e)}
                  className={cn(
                    "opacity-0 group-hover:opacity-100 p-1 rounded transition-all",
                    theme === "light"
                      ? "hover:bg-gray-200 text-gray-500"
                      : "hover:bg-gray-600 text-gray-400",
                  )}
                  title="Delete conversation"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};