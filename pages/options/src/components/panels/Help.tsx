import { cn } from "@extension/ui";
import type React from "react";

interface HelpProps {
  theme: "light" | "dark";
}

export const Help: React.FC<HelpProps> = ({ theme }) => (
  <div className="p-8 max-w-4xl mx-auto">
    <h2
      className={cn(
        "text-3xl font-bold mb-4",
        theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
      )}
    >
      Help & Support
    </h2>
    <p
      className={cn(
        "text-sm",
        theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
      )}
    >
      Documentation and support resources
    </p>
  </div>
);
