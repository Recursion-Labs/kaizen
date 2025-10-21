import { cn } from "@extension/ui";
import { useState } from "react";
import type React from "react";

interface ImagePreviewProps {
  theme: "light" | "dark";
  imageData: string;
  fileName: string;
  onSend: (comment: string) => void;
  onCancel: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  theme,
  imageData,
  fileName,
  onSend,
  onCancel,
}) => {
  const [comment, setComment] = useState("");

  const handleSend = () => {
    onSend(comment.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={cn(
          "max-w-md w-full rounded-lg shadow-xl overflow-hidden",
          theme === "light" ? "bg-white" : "bg-gray-800",
        )}
      >
        {/* Image */}
        <div className="relative">
          <img
            src={imageData}
            alt={fileName}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onCancel}
            className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
            title="Cancel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comment Input */}
        <div className="p-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a comment (optional)..."
            className={cn(
              "w-full px-3 py-2 rounded-lg border outline-none resize-none transition-colors",
              theme === "light"
                ? "bg-slate-50 border-slate-200 text-gray-900 placeholder-gray-400 focus:border-blue-500"
                : "bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500",
            )}
            rows={3}
            autoFocus
          />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={onCancel}
              className={cn(
                "px-4 py-2 rounded-lg transition-colors",
                theme === "light"
                  ? "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600",
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};