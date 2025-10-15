import { cn } from "@extension/ui";
import type React from "react";

interface ModelsSettingsProps {
  theme: "light" | "dark";
}

export const ModelsSettings: React.FC<ModelsSettingsProps> = ({ theme }) => (
  <div className="p-8 max-w-4xl mx-auto">
    <h2
      className={cn(
        "text-3xl font-bold mb-4",
        theme === "light" ? "text-gray-900" : "text-white",
      )}
    >
      AI Models
    </h2>
    <p
      className={cn(
        "text-sm",
        theme === "light" ? "text-gray-500" : "text-gray-400",
      )}
    >
      Configure local AI models (Gemini Nano)
    </p>
  </div>
);
