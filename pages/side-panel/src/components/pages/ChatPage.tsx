import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@extension/ui";
import { 
  MessageCircle, 
  Send,
  Mic,
  Paperclip,
  Brain,
  Search,
  ChevronDown
} from "lucide-react";
import type React from "react";

interface ChatPageProps {
  theme: "light" | "dark";
}

const ChatPage: React.FC<ChatPageProps> = ({ theme }) => {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant" as const,
      content: "Hi! How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "assistant" as const,
        content: "I understand your request. Let me help you with that!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
              <MessageCircle className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className={cn(
                "text-xl font-bold",
                theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text"
              )}>
                Chat
              </h1>
              <p className={cn(
                "text-sm",
                theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted"
              )}>
                AI-powered conversation
              </p>
            </div>
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
            <Brain className="w-4 h-4" />
            <span>GPT-4</span>
            <ChevronDown className="w-3 h-3" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Greeting */}
          <motion.div 
            className="text-center space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
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
          </motion.div>

          {/* Messages */}
          <div className="space-y-4 mt-8">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={cn(
                  "flex",
                  message.type === "user" ? "justify-end" : "justify-start"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className={cn(
                  "max-w-[80%] p-4 rounded-2xl shadow-sm",
                  message.type === "user"
                    ? "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white"
                    : theme === "light"
                      ? "bg-kaizen-surface text-kaizen-light-text border border-kaizen-border"
                      : "bg-kaizen-dark-surface text-kaizen-dark-text border border-kaizen-dark-border"
                )}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className={cn(
          "p-6 border-t",
          theme === "light" ? "border-kaizen-border" : "border-kaizen-dark-border"
        )}>
          <div className="space-y-3">
            {/* Input Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <motion.button
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200 hover:scale-110",
                    theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Paperclip className="w-4 h-4" />
                </motion.button>
                <motion.button
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200 hover:scale-110",
                    theme === "light" ? "hover:bg-kaizen-surface" : "hover:bg-kaizen-dark-surface"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mic className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Main Input */}
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
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
                <motion.button
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1",
                    "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
                    "hover:shadow-md transition-all duration-200 hover:scale-105"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Brain className="w-3 h-3" />
                  <span>Think</span>
                </motion.button>
                <motion.button
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1",
                    "bg-gradient-to-r from-kaizen-primary to-kaizen-secondary text-white",
                    "hover:shadow-md transition-all duration-200 hover:scale-105"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-3 h-3" />
                  <span>Research</span>
                </motion.button>
              </div>

              <motion.button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={cn(
                  "absolute bottom-3 right-3 p-2 rounded-lg",
                  "bg-gradient-to-r from-kaizen-accent to-kaizen-primary text-white",
                  "hover:shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPage;