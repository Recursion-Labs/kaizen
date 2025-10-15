import { cn } from "@extension/ui";
import type React from "react";

interface AnalyticsSettingsProps {
  theme: "light" | "dark";
}

export const AnalyticsSettings: React.FC<AnalyticsSettingsProps> = ({
  theme,
}) => (
  <div className="p-8 max-w-4xl mx-auto">
    <h2
      className={cn(
        "text-3xl font-bold mb-4",
        theme === "light" ? "text-gray-900" : "text-white",
      )}
    >
      Analytics
    </h2>
    <p
      className={cn(
        "text-sm",
        theme === "light" ? "text-gray-500" : "text-gray-400",
      )}
    >
      View usage statistics and insights
    </p>
  </div>
);
