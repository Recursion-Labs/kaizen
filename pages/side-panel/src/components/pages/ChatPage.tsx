import { ChatHeader } from "../ChatHeader";
import { ChatInput } from "../ChatInput";
import { HistoryView } from "../HistoryView";
import { MessageList } from "../MessageList";
import { AIOverlayManager } from "@extension/content-ui";
import { conversationStorage } from "@extension/storage";
import { useState, useRef, useEffect, useMemo } from "react";
import type { Message, Conversation } from "../types";

// Speech Recognition API types
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface ChatPageProps {
  theme: "light" | "dark";
}

const ChatPage: React.FC<ChatPageProps> = ({ theme }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiManager, setAIManager] = useState<AIOverlayManager | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);

  const currentMessages = useMemo(
    () =>
      currentConversationId
        ? conversations.find((c) => c.id === currentConversationId)?.messages || []
        : [],
    [conversations, currentConversationId],
  );

  // Initialize AI Manager
  useEffect(() => {
    const initAI = async () => {
      try {
        const manager = AIOverlayManager.getInstance();
        await manager.initialize();
        setAIManager(manager);
        console.log("[ChatPage] AI Manager ready");
      } catch (error) {
        console.error("[ChatPage] Failed to initialize AI:", error);
      }
    };
    initAI();
  }, []);

  // Load conversations from storage on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const storedConversations = await conversationStorage.get();
        if (storedConversations && storedConversations.length > 0) {
          // Convert ISO strings back to Date objects
          const conversationsWithDates = storedConversations.map((conv) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages: conv.messages.map((msg) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }));
          setConversations(conversationsWithDates);
          console.log("[ChatPage] Loaded conversations from storage:", conversationsWithDates.length);
        }
      } catch (error) {
        console.error("[ChatPage] Failed to load conversations:", error);
      }
    };
    loadConversations();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  // Save conversations to storage whenever they change
  useEffect(() => {
    const saveConversations = async () => {
      try {
        // Convert Date objects to strings for storage
        const conversationsForStorage = conversations.map((conv) => ({
          ...conv,
          createdAt: conv.createdAt.toISOString(),
          updatedAt: conv.updatedAt.toISOString(),
          messages: conv.messages.map((msg) => ({
            ...msg,
            timestamp: msg.timestamp.toISOString(),
          })),
        }));
        await conversationStorage.set(conversationsForStorage);
      } catch (error) {
        console.error("[ChatPage] Failed to save conversations:", error);
      }
    };

    // Only save if we have conversations and component is mounted
    if (conversations.length > 0) {
      saveConversations();
    }
  }, [conversations]);

  // Helper function to add message to conversation (creates new conversation if none exists)
  const addMessageToConversation = (
    message: Message,
    title?: string,
  ): string => {
    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = Date.now().toString();
      const newConversation: Conversation = {
        id: conversationId,
        title: title || (message.content.length > 50 ? message.content.substring(0, 50) + "..." : message.content),
        messages: [message],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversationId(conversationId);
    } else {
      // Add message to existing conversation
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, message],
                updatedAt: new Date(),
              }
            : conv,
        ),
      );
    }
    return conversationId;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !aiManager) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    // Add message to conversation immediately (creates new if none exists)
    const conversationId = addMessageToConversation(userMessage);

    setInputValue("");
    setIsProcessing(true);

    try {
      // Build the prompt with system context
      const systemPrompt = "You are Kaizen, an AI assistant focused on productivity, learning, and digital well-being. You provide helpful, concise responses and can help with various tasks including writing, analysis, and general assistance.";

      const fullPrompt = `${systemPrompt}\n\nUser: ${inputValue}\n\nAssistant:`;

      const response = await aiManager.prompt(fullPrompt);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      // Add AI response to conversation
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
                updatedAt: new Date(),
              }
            : conv,
        ),
      );
    } catch (error) {
      console.error("[ChatPage] Prompt API error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId!
            ? {
                ...conv,
                messages: [...conv.messages, errorMessage],
                updatedAt: new Date(),
              }
            : conv,
        ),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isListening) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setIsRecording(false);
    } else {
      // Start recording
      startVoiceRecording();
    }
  };

  const startVoiceRecording = () => {
    try {
      // Check if Speech Recognition is supported
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        console.error("[ChatPage] Speech Recognition not supported");
        alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
        return;
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        console.log("[ChatPage] Voice recording started");
        setIsListening(true);
        setIsRecording(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        console.log("[ChatPage] Voice transcript:", transcript);

        // Set the transcript as input value
        setInputValue(transcript);

        // Automatically send the message after voice input
        setTimeout(() => {
          handleSend();
        }, 500);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("[ChatPage] Speech recognition error:", event.error);
        setIsListening(false);
        setIsRecording(false);

        if (event.error === "not-allowed") {
          alert("Microphone access denied. Please allow microphone access and try again.");
        } else {
          alert(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        console.log("[ChatPage] Voice recording ended");
        setIsListening(false);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error("[ChatPage] Failed to start voice recording:", error);
      setIsListening(false);
      setIsRecording(false);
      alert("Failed to start voice recording. Please try again.");
    }
  };

  const openSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const createNewConversation = () => {
    setCurrentConversationId(null);
    setShowHistory(false);
  };

  const selectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setShowHistory(false);
  };

  const deleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) =>
      prev.filter((conv) => conv.id !== conversationId),
    );
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }
  };

  const handleImageUpload = () => {
    // Since user said not to worry about images, just show a message
    alert("Image upload is not available in this version.");
  };

  const handleFileChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    // Since user said not to worry about images, do nothing
  };

  return (
    <div className="flex flex-col h-full w-full">
      {showHistory ? (
        <HistoryView
          theme={theme}
          conversations={conversations}
          currentConversationId={currentConversationId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewConversation={createNewConversation}
          onSelectConversation={selectConversation}
          onDeleteConversation={deleteConversation}
          onBackToChat={toggleHistory}
        />
      ) : (
        <>
          <ChatHeader
            theme={theme}
            onNewChat={createNewConversation}
            onToggleHistory={toggleHistory}
            onOpenSettings={openSettings}
          />

          <div className="flex-1 overflow-y-auto p-6">
            <MessageList theme={theme} messages={currentMessages} />
            <div ref={messagesEndRef} />
          </div>

          {/* Thinking Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-start px-6 pb-2">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
                theme === "light"
                  ? "bg-kaizen-surface text-kaizen-light-muted"
                  : "bg-kaizen-dark-surface text-kaizen-dark-muted"
              }`}>
                <div className="flex space-x-1">
                  <span>Kaizen is thinking </span>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}

          <ChatInput
            theme={theme}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSend={handleSend}
            onImageUpload={handleImageUpload}
            onToggleRecording={toggleRecording}
            isRecording={isRecording}
            aiManagerAvailable={!!aiManager}
            fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
            onFileChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
};

export default ChatPage;