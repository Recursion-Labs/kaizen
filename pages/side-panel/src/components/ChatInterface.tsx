import { cn } from "@extension/ui";
import { useState, useRef } from "react";
import type React from "react";

interface ChatInterfaceProps {
  theme: "light" | "dark";
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ theme }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm processing your request using local AI...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file.name);
      // Handle image upload logic here
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Handle voice recording logic here
  };

  const openSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
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
          {/* Chat History Button */}
          <button
            onClick={toggleHistory}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              showHistory
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-700",
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
            onClick={openSettings}
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

      {/* History Sidebar */}
      {showHistory && (
        <div
          className={cn(
            "absolute top-16 right-0 bottom-0 w-80 border-l z-10 overflow-hidden flex flex-col",
            theme === "light"
              ? "bg-white border-slate-200"
              : "bg-gray-800 border-gray-700",
          )}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3
                className={cn(
                  "font-semibold",
                  theme === "light" ? "text-gray-900" : "text-white",
                )}
              >
                Chat History
              </h3>
              <button
                onClick={toggleHistory}
                className={cn(
                  "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                  theme === "light" ? "text-gray-600" : "text-gray-400",
                )}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <input
              type="text"
              placeholder="Search history..."
              className={cn(
                "w-full px-3 py-2 rounded-lg border text-sm",
                theme === "light"
                  ? "bg-slate-50 border-slate-200"
                  : "bg-gray-900 border-gray-700",
              )}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <p
              className={cn(
                "text-sm text-center py-8",
                theme === "light" ? "text-gray-500" : "text-gray-400",
              )}
            >
              No chat history yet
            </p>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div
        className={cn(
          "flex-1 overflow-y-auto p-6 space-y-4 relative",
          theme === "light" ? "bg-slate-50" : "bg-gray-900",
          showHistory && "mr-80",
        )}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                "bg-gradient-to-r from-blue-500 to-purple-600",
              )}
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div>
              <h3
                className={cn(
                  "text-xl font-semibold mb-2",
                  theme === "light" ? "text-gray-900" : "text-white",
                )}
              >
                How can I help you?
              </h3>
              <p
                className={cn(
                  "text-sm",
                  theme === "light" ? "text-gray-500" : "text-gray-400",
                )}
              >
                Ask questions, upload images, or use voice input
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-3 rounded-lg",
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : theme === "light"
                      ? "bg-white text-gray-900 border border-slate-200"
                      : "bg-gray-800 text-white border border-gray-700",
                )}
              >
                <p className="text-sm">{message.content}</p>
                <span
                  className={cn(
                    "text-xs mt-1 block",
                    message.role === "user"
                      ? "text-blue-100"
                      : theme === "light"
                        ? "text-gray-400"
                        : "text-gray-500",
                  )}
                >
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div
        className={cn(
          "border-t p-4",
          theme === "light"
            ? "bg-white border-slate-200"
            : "bg-gray-800 border-gray-700",
        )}
      >
        <div className="flex items-center space-x-2">
          {/* Image Upload Button */}
          <button
            onClick={handleImageUpload}
            className={cn(
              "p-2 rounded-lg transition-colors",
              theme === "light"
                ? "hover:bg-slate-100 text-gray-600"
                : "hover:bg-gray-700 text-gray-400",
            )}
            title="Upload image"
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything..."
            className={cn(
              "flex-1 px-4 py-2 rounded-lg border outline-none transition-colors",
              theme === "light"
                ? "bg-slate-50 border-slate-200 text-gray-900 placeholder-gray-400 focus:border-blue-500"
                : "bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500",
            )}
          />

          {/* Voice Button */}
          <button
            onClick={toggleRecording}
            className={cn(
              "p-2 rounded-lg transition-all",
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : theme === "light"
                  ? "hover:bg-slate-100 text-gray-600"
                  : "hover:bg-gray-700 text-gray-400",
            )}
            title={isRecording ? "Stop recording" : "Start recording"}
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
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={cn(
              "p-2 rounded-lg transition-colors",
              inputValue.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : theme === "light"
                  ? "bg-slate-100 text-gray-400"
                  : "bg-gray-700 text-gray-500",
            )}
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
