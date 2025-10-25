import { cn } from "@extension/ui";
import type React from "react";

interface ChatInputProps {
  theme: "light" | "dark";
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onImageUpload: () => void;
  onToggleRecording: () => void;
  isRecording: boolean;
  aiManagerAvailable: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  theme,
  inputValue,
  onInputChange,
  onSend,
  onImageUpload,
  onToggleRecording,
  isRecording,
  aiManagerAvailable,
  fileInputRef,
  onFileChange,
}) => (
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
          onClick={onImageUpload}
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
          onChange={onFileChange}
        />

        {/* Text Input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSend()}
          placeholder="Ask Kaizen anything..."
          className={cn(
            "flex-1 px-4 py-2 rounded-lg border outline-none transition-colors",
            theme === "light"
              ? "bg-slate-50 border-slate-200 text-gray-900 placeholder-gray-400 focus:border-blue-500"
              : "bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500",
          )}
        />

        {/* Voice Button */}
        <button
          onClick={onToggleRecording}
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
          onClick={onSend}
          disabled={!inputValue.trim() || !aiManagerAvailable}
          className={cn(
            "p-2 rounded-lg transition-colors",
            inputValue.trim() && aiManagerAvailable
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : theme === "light"
                ? "bg-slate-100 text-gray-400"
                : "bg-gray-700 text-gray-500",
          )}
        >
          <svg
            className="w-5 h-5 transform rotate-45"
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
  );
