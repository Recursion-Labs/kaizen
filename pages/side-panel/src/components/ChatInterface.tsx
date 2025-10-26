import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { HistoryView } from "./HistoryView";
import { ImagePreview } from "./ImagePreview";
import { MessageList } from "./MessageList";
import { AIOverlayManager } from "../../../content-ui/src/services/AIOverlayManager";
import { PageContentExtractor } from "../../../content-ui/src/services/PageContentExtractor";
import { conversationStorage } from "@extension/storage";
import { cn } from "@extension/ui";
import { useState, useRef, useEffect, useMemo } from "react";
import type { Message, Conversation } from "./types";
import type React from "react";

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

interface ChatInterfaceProps {
  theme: "light" | "dark";
}

// Compress image data to reduce storage size
const compressImageData = (
  base64Data: string,
): string => {
  // For now, just return the original data
  // In a real implementation, you could use canvas to compress
  // But for simplicity, we'll just truncate very large images
  if (base64Data.length > 500000) {
    // If larger than ~500KB, truncate to save space
    return base64Data.substring(0, 200000) + "...[truncated]";
  }
  return base64Data;
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ theme }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
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
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [pendingImage, setPendingImage] = useState<{
    data: string;
    fileName: string;
  } | null>(null);

  const currentMessages = useMemo(
    () =>
      currentConversationId
        ? conversations.find((c) => c.id === currentConversationId)?.messages ||
          []
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
        console.log("[SidePanel] AI Manager ready");
      } catch (error) {
        console.error("[SidePanel] Failed to initialize AI:", error);
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
          console.log(
            "[SidePanel] Loaded conversations from storage:",
            conversationsWithDates.length,
          );
        }
      } catch (error) {
        console.error("[SidePanel] Failed to load conversations:", error);
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
            // Compress image data to reduce storage size
            image: msg.image ? compressImageData(msg.image) : undefined,
          })),
        }));
        await conversationStorage.set(conversationsForStorage);
      } catch (error) {
        console.error("[SidePanel] Failed to save conversations:", error);

        // If quota exceeded, try to clean up old conversations
        if (error instanceof Error && error.message.includes("quota")) {
          console.log(
            "[SidePanel] Storage quota exceeded, cleaning up old conversations...",
          );
          try {
            // Keep only the most recent 5 conversations
            const recentConversations = conversations.slice(0, 5);
            setConversations(recentConversations);

            // Try saving again with reduced data
            const conversationsForStorage = recentConversations.map((conv) => ({
              ...conv,
              createdAt: conv.createdAt.toISOString(),
              updatedAt: conv.updatedAt.toISOString(),
              messages: conv.messages.map((msg) => ({
                ...msg,
                timestamp: msg.timestamp.toISOString(),
                // Further compress images for storage
                image: msg.image
                  ? compressImageData(msg.image)
                  : undefined,
              })),
            }));
            await conversationStorage.set(conversationsForStorage);
            console.log("[SidePanel] Successfully saved after cleanup");
          } catch (cleanupError) {
            console.error(
              "[SidePanel] Failed to save even after cleanup:",
              cleanupError,
            );
            // As a last resort, save without images
            try {
              const conversationsWithoutImages = conversations
                .slice(0, 3)
                .map((conv) => ({
                  ...conv,
                  createdAt: conv.createdAt.toISOString(),
                  updatedAt: conv.updatedAt.toISOString(),
                  messages: conv.messages.map((msg) => ({
                    ...msg,
                    timestamp: msg.timestamp.toISOString(),
                    image: undefined, // Remove images to save space
                  })),
                }));
              await conversationStorage.set(conversationsWithoutImages);
              console.log("[SidePanel] Saved conversations without images");
            } catch (finalError) {
              console.error(
                "[SidePanel] Complete storage failure:",
                finalError,
              );
            }
          }
        }
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
        title:
          title ||
          (message.content.length > 50
            ? message.content.substring(0, 50) + "..."
            : message.content),
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
      // Check if user is asking about page content
      const pageContentKeywords = [
        "this page",
        "this article",
        "current page",
        "webpage",
        "website",
        "explain this",
        "summarize this",
        "what is this",
        "analyze this",
        "read this",
        "tell me about",
      ];

      const isPageContentQuery = pageContentKeywords.some((keyword) =>
        inputValue.toLowerCase().includes(keyword),
      );

      let pageContent: {
        title: string;
        content: string;
        url: string;
        wordCount: number;
      } | null = null;
      if (isPageContentQuery) {
        try {
          // Extract page content from the active tab
          const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
          });
          if (tab.id) {
            const result = await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: PageContentExtractor.extractPageContent,
            });
            if (result && result[0] && result[0].result) {
              pageContent = result[0].result;
            }
          }
        } catch (error) {
          console.warn("[SidePanel] Could not extract page content:", error);
        }
      }

      // Check if there are any images in the current conversation
      const currentConversation = conversations.find(
        (c) => c.id === conversationId,
      );
      const lastImageMessage = currentConversation?.messages
        .filter((msg) => msg.image)
        .pop();

      let response: string;

      // Check if user wants summarization
      const summarizeKeywords = [
        "summarize",
        "summary",
        "tl;dr",
        "tldr",
        "condense",
        "shorten",
      ];
      const wantsSummary = summarizeKeywords.some((keyword) =>
        inputValue.toLowerCase().includes(keyword),
      );

      // Check if user wants translation
      const translateKeywords = [
        "translate",
        "translation",
        "translate to",
        "in spanish",
        "in french",
        "in german",
        "in chinese",
        "in japanese",
      ];
      const wantsTranslation = translateKeywords.some((keyword) =>
        inputValue.toLowerCase().includes(keyword),
      );

      // Check if user wants proofreading/grammar check
      const proofreadKeywords = [
        "proofread",
        "grammar",
        "check grammar",
        "correct",
        "fix grammar",
        "spell check",
      ];
      const wantsProofread = proofreadKeywords.some((keyword) =>
        inputValue.toLowerCase().includes(keyword),
      );

      if (lastImageMessage?.image) {
        // Use image understanding capability
        console.log("[SidePanel] Using image understanding for response");
        response = await aiManager.promptWithImage(
          inputValue,
          lastImageMessage.image,
          pageContent
            ? `Page context: ${pageContent.title} - ${pageContent.content.substring(
                0,
                500,
              )}...`
            : undefined,
        );
      } else if (wantsSummary && pageContent) {
        // Use Summarizer API for page content
        console.log("[SidePanel] Using Summarizer API for page content");
        try {
          response = await aiManager.summarize(
            pageContent.content,
            `Please provide a concise summary of this webpage titled "${pageContent.title}"`
          );
        } catch (error) {
          console.warn("[SidePanel] Summarizer API failed, using Prompt API:", error);
          response = await aiManager.prompt(
            `Please summarize this webpage content:\n\nTitle: ${pageContent.title}\n\nContent: ${pageContent.content}`
          );
        }
      } else if (wantsTranslation) {
        // Use Translator API
        console.log("[SidePanel] Using Translator API");
        try {
          // Detect language if not specified
          const sourceLang = "en";
          let targetLang = "es"; // default to Spanish

          // Simple language detection from keywords
          if (inputValue.toLowerCase().includes("to spanish") || inputValue.toLowerCase().includes("in spanish")) {
            targetLang = "es";
          } else if (inputValue.toLowerCase().includes("to french") || inputValue.toLowerCase().includes("in french")) {
            targetLang = "fr";
          } else if (inputValue.toLowerCase().includes("to german") || inputValue.toLowerCase().includes("in german")) {
            targetLang = "de";
          } else if (inputValue.toLowerCase().includes("to chinese") || inputValue.toLowerCase().includes("in chinese")) {
            targetLang = "zh";
          } else if (inputValue.toLowerCase().includes("to japanese") || inputValue.toLowerCase().includes("in japanese")) {
            targetLang = "ja";
          }

          // Extract text to translate (remove translation command)
          const textToTranslate = inputValue.replace(/translate\s+(to\s+)?\w+/i, "").trim();

          response = await aiManager.translate(textToTranslate, sourceLang, targetLang);
          response = `**Translation (${sourceLang} → ${targetLang}):**\n\n${response}`;
        } catch (error) {
          console.warn("[SidePanel] Translator API failed, using Prompt API:", error);
          response = await aiManager.prompt(`Please translate the following text: ${inputValue}`);
        }
      } else if (wantsProofread) {
        // Use Proofreader API
        console.log("[SidePanel] Using Proofreader API");
        try {
          const proofreadResult = await aiManager.proofread(inputValue);
          if (proofreadResult.corrections && proofreadResult.corrections.length > 0) {
            response = `**Proofread Result:**\n\n${proofreadResult.corrected}\n\n**Suggestions:**\n${proofreadResult.corrections.map(c => `• ${c.original} → ${c.suggestion}${c.explanation ? ` (${c.explanation})` : ''}`).join('\n')}`;
          } else {
            response = `**Proofread Result:**\n\nYour text appears to be grammatically correct!\n\n${proofreadResult.corrected}`;
          }
        } catch (error) {
          console.warn("[SidePanel] Proofreader API failed, using Prompt API:", error);
          response = await aiManager.prompt(`Please proofread and correct the following text: ${inputValue}`);
        }
      } else {
        // Build the prompt with page content if available (regular text prompt)
        const systemPrompt =
          "You are Kaizen, an AI assistant focused on productivity, learning, and digital well-being. You have access to various AI tools including summarization, translation, proofreading, and content analysis. Provide helpful, concise responses. You can help with writing, analysis, translation, summarization, and more.";

        let fullPrompt = `${systemPrompt}\n\nUser: ${inputValue}\n\nAssistant:`;

        if (pageContent && pageContent.content) {
          fullPrompt = `${systemPrompt}\n\nPage Content Available:\nTitle: ${pageContent.title}\nURL: ${pageContent.url}\nWord Count: ${pageContent.wordCount}\n\nContent (excerpt):\n${pageContent.content.substring(0, 1000)}...\n\nUser Question: ${inputValue}\n\nAssistant: Please analyze the page content above and answer the user's question. If the question is about the page content, use it to provide a relevant answer.`;

          // If it's a page content query, use summarizer for better response
          if (isPageContentQuery) {
            try {
              console.log("[SidePanel] Using Summarizer API for page analysis");
              const summary = await aiManager.summarize(pageContent.content, inputValue);
              response = summary;
            } catch (error) {
              console.warn("[SidePanel] Summarizer failed for page analysis, using Prompt API:", error);
              response = await aiManager.prompt(fullPrompt);
            }
          } else {
            response = await aiManager.prompt(fullPrompt);
          }
        } else {
          response = await aiManager.prompt(fullPrompt);
        }
      }

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
      console.error("[SidePanel] Prompt API error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error processing your request. Please try again.",
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

  const handleImageSend = async (comment: string) => {
    if (!pendingImage || !aiManager) return;

    const content = comment.trim()
      ? `${comment}\n\n[Image: ${pendingImage.fileName}]`
      : `[Image: ${pendingImage.fileName}]`;

    const imageMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      image: pendingImage.data,
    };

    // Add message to conversation immediately (creates new if none exists)
    const conversationId = addMessageToConversation(
      imageMessage,
      comment.trim() || `Image: ${pendingImage.fileName}`,
    );

    // Clear the preview state
    setShowImagePreview(false);
    setPendingImage(null);

    // Auto-generate AI response for the image immediately
    setIsProcessing(true);
    try {
      console.log("[SidePanel] Auto-analyzing uploaded image");
      const promptText = comment.trim()
        ? `Please analyze this image and respond to: "${comment}"`
        : "Please analyze and describe this image";

      const response = await aiManager.promptWithImage(
        promptText,
        imageMessage.image!,
      );

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
      console.error("[SidePanel] Failed to analyze uploaded image:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I couldn't analyze the image right now. You can still ask me questions about it!",
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
  const handleImageCancel = () => {
    setShowImagePreview(false);
    setPendingImage(null);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target?.result as string;
        setPendingImage({
          data: base64Image,
          fileName: file.name,
        });
        setShowImagePreview(true);
      };
      reader.readAsDataURL(file);
    }
    // Clear the input
    e.target.value = "";
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
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        console.error("[SidePanel] Speech Recognition not supported");
        alert(
          "Speech recognition is not supported in this browser. Please use Chrome or Edge.",
        );
        return;
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US"; // You can make this configurable

      recognition.onstart = () => {
        console.log("[SidePanel] Voice recording started");
        setIsListening(true);
        setIsRecording(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        console.log("[SidePanel] Voice transcript:", transcript);

        // Set the transcript as input value
        setInputValue(transcript);

        // Automatically send the message after voice input
        setTimeout(() => {
          handleSend();
        }, 500);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("[SidePanel] Speech recognition error:", event.error);
        setIsListening(false);
        setIsRecording(false);

        if (event.error === "not-allowed") {
          alert(
            "Microphone access denied. Please allow microphone access and try again.",
          );
        } else {
          alert(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        console.log("[SidePanel] Voice recording ended");
        setIsListening(false);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error("[SidePanel] Failed to start voice recording:", error);
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

          <div
            className={cn(
              "flex-1 overflow-y-auto p-6",
              theme === "light" ? "bg-kaizen-light-bg" : "bg-kaizen-dark-bg",
            )}
          >
            <MessageList theme={theme} messages={currentMessages} />
            <div ref={messagesEndRef} />
          </div>

          {/* Thinking Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-start px-6 pb-2">
              <div
                className={cn(
                  "flex items-center space-x-2 px-3 py-1 rounded-full text-xs",
                  theme === "light"
                    ? "bg-kaizen-surface text-kaizen-muted"
                    : "bg-kaizen-dark-surface text-kaizen-dark-muted",
                )}
              >
                <div className="flex space-x-1">
                  <span>Kaizen is thinking </span>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-1 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
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

          {/* Image Preview Modal */}
          {showImagePreview && pendingImage && (
            <ImagePreview
              theme={theme}
              imageData={pendingImage.data}
              fileName={pendingImage.fileName}
              onSend={handleImageSend}
              onCancel={handleImageCancel}
            />
          )}
        </>
      )}
    </div>
  );
};
