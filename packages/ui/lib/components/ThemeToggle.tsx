import { cn } from "../utils";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  className,
}) => {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      className={cn(
        "group relative inline-flex h-10 w-20 items-center rounded-full transition-colors duration-300",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        isDark
          ? "bg-slate-700 focus:ring-slate-500"
          : "bg-blue-500 focus:ring-blue-400",
        className,
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      type="button"
    >
      {/* Sliding Circle */}
      <span
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300",
          "shadow-lg",
          isDark ? "translate-x-11 bg-slate-900" : "translate-x-1 bg-white",
        )}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-blue-300" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </span>

      {/* Background Icons */}
      <span className="absolute left-2 top-2.5">
        <Sun
          className={cn(
            "h-5 w-5 transition-opacity duration-300",
            isDark ? "text-slate-500 opacity-50" : "text-white opacity-0",
          )}
        />
      </span>
      <span className="absolute right-2 top-2.5">
        <Moon
          className={cn(
            "h-5 w-5 transition-opacity duration-300",
            isDark ? "text-blue-200 opacity-0" : "text-blue-200 opacity-50",
          )}
        />
      </span>
    </button>
  );
};
