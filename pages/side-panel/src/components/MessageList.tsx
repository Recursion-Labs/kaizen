import { cn } from "@extension/ui";
import ReactMarkdown from "react-markdown";
import type React from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  image?: string;
}

interface MessageListProps {
  theme: "light" | "dark";
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({
  theme,
  messages,
}) => {
  if (messages.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message: Message) => (
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
            {message.image && (
              <div className="mb-3">
                <img
                  src={message.image}
                  alt="Uploaded content"
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}
            {message.role === "assistant" ? (
              <div
                className={cn(
                  "prose prose-sm max-w-none",
                  theme === "dark" ? "prose-invert" : "",
                )}
              >
                <ReactMarkdown
                  components={{
                    a: (props: any) => {
                      const { href, children, ...rest } = props;
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn("text-blue-500 underline")}
                          {...rest}
                        >
                          {children}
                        </a>
                      );
                    },
                    code: (props: any) => {
                      const { inline, className, children, ...rest } = props;
                      if (inline) {
                        return (
                          <code
                            className={cn(
                              "px-1 rounded text-sm font-mono",
                              theme === "dark"
                                ? "bg-gray-700 text-white"
                                : "bg-gray-100 text-gray-900",
                            )}
                            {...rest}
                          >
                            {children}
                          </code>
                        );
                      }
                      return (
                        <pre
                          className={cn(
                            "rounded-md p-3 overflow-x-auto",
                            theme === "dark"
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-900",
                          )}
                        >
                          <code className={className} {...rest}>
                            {String(children).replace(/\n$/, "")}
                          </code>
                        </pre>
                      );
                    },
                    img: (props: any) => {
                      const { src, alt, ...rest } = props;
                      return (
                        <img
                          src={src}
                          alt={alt as string}
                          className="max-w-full h-auto rounded-lg"
                          style={{ maxHeight: "300px" }}
                          {...rest}
                        />
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm">{message.content}</p>
            )}
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
      ))}
    </div>
  );
};
