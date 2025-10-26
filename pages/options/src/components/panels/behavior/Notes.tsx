import { cn } from "@extension/ui";
import { Plus, Search, Tag, Smile, Frown, Meh } from "lucide-react";
import { useState } from "react";
import type {
  RemarksPanelProps,
  BehaviorRemark,
  RemarkMood,
  RemarkCategory,
  MoodButtonProps,
  RemarkCardProps,
} from "./types";
import type React from "react";

const Notes: React.FC<RemarksPanelProps> = ({ theme }) => {
  const [remarks, setRemarks] = useState<BehaviorRemark[]>([
    {
      id: "1",
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      content: "Noticed I always scroll Reddit when stressed about deadlines",
      tags: ["stress", "procrastination", "reddit"],
      mood: "negative",
      category: "reflection",
    },
    {
      id: "2",
      timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
      content: "Completed 3 focused hours today! Feeling productive.",
      tags: ["productivity", "focus"],
      mood: "positive",
      category: "achievement",
    },
  ]);

  const [newRemark, setNewRemark] = useState("");
  const [selectedMood, setSelectedMood] = useState<RemarkMood | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<RemarkCategory>("note");

  const addRemark = () => {
    if (newRemark.trim()) {
  const remark: BehaviorRemark = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        content: newRemark,
        tags: [], // TODO: Extract tags from content
        mood: selectedMood,
        category: selectedCategory,
      };

      setRemarks([remark, ...remarks]);
      setNewRemark("");
      setSelectedMood(undefined);
    }
  };

  const filteredRemarks = remarks.filter(
    (remark) =>
      remark.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      remark.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h2
          className={cn(
            "text-2xl font-bold",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Personal Remarks
        </h2>
        <p
          className={cn(
            "text-sm",
            theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
          )}
        >
          Journal your thoughts and track your behavioral insights
        </p>
      </div>

      {/* Add New Remark */}
      <div
        className={cn(
          "rounded-lg border p-6",
          theme === "light"
            ? "border-kaizen-border bg-kaizen-surface"
            : "border-kaizen-border bg-kaizen-dark-surface",
        )}
      >
        <h3
          className={cn(
            "mb-4 text-lg font-semibold",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Add New Remark
        </h3>

        {/* Textarea */}
        <textarea
          value={newRemark}
          onChange={(e) => setNewRemark(e.target.value)}
          placeholder="What are you thinking about your browsing habits?"
          className={cn(
            "mb-4 w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2",
            theme === "light"
              ? "border-kaizen-border bg-kaizen-surface text-kaizen-light-text focus:ring-kaizen-accent"
              : "border-kaizen-border bg-kaizen-dark-surface text-kaizen-dark-text focus:ring-kaizen-accent",
          )}
          rows={4}
        />

        {/* Mood Selection */}
        <div className="mb-4 flex items-center space-x-4">
          <span
            className={cn(
              "text-sm font-medium",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
            )}
          >
            Mood:
          </span>
          <div className="flex space-x-2">
            <MoodButton
              mood="positive"
              icon={<Smile className="h-5 w-5" />}
              selected={selectedMood === "positive"}
              onClick={() =>
                setSelectedMood(
                  selectedMood === "positive" ? undefined : "positive",
                )
              }
              theme={theme}
            />
            <MoodButton
              mood="neutral"
              icon={<Meh className="h-5 w-5" />}
              selected={selectedMood === "neutral"}
              onClick={() =>
                setSelectedMood(
                  selectedMood === "neutral" ? undefined : "neutral",
                )
              }
              theme={theme}
            />
            <MoodButton
              mood="negative"
              icon={<Frown className="h-5 w-5" />}
              selected={selectedMood === "negative"}
              onClick={() =>
                setSelectedMood(
                  selectedMood === "negative" ? undefined : "negative",
                )
              }
              theme={theme}
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-4 flex items-center space-x-4">
          <span
            className={cn(
              "text-sm font-medium",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
            )}
          >
            Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as RemarkCategory)
            }
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm",
              theme === "light"
                ? "border-kaizen-border bg-kaizen-surface text-kaizen-light-text"
                : "border-kaizen-border bg-kaizen-dark-surface text-kaizen-dark-text",
            )}
          >
            <option value="note">Note</option>
            <option value="goal">Goal</option>
            <option value="reflection">Reflection</option>
            <option value="achievement">Achievement</option>
            <option value="challenge">Challenge</option>
          </select>
        </div>

        {/* Add Button */}
        <button
          onClick={addRemark}
          disabled={!newRemark.trim()}
          className={cn(
            "flex w-full items-center justify-center space-x-2 rounded-lg px-6 py-3 font-semibold transition-colors",
            newRemark.trim()
              ? theme === "light"
                ? "bg-kaizen-accent text-kaizen-light-bg hover:bg-kaizen-accent/80"
                : "bg-kaizen-accent-dark text-kaizen-dark-text hover:bg-kaizen-accent/80"
              : "cursor-not-allowed bg-kaizen-muted text-kaizen-light-muted",
          )}
        >
          <Plus className="h-5 w-5" />
          <span>Add Remark</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div
        className={cn(
          "rounded-lg border p-4",
          theme === "light"
            ? "border-kaizen-border bg-kaizen-surface"
            : "border-kaizen-border bg-kaizen-dark-surface",
        )}
      >
        <div className="flex items-center space-x-3">
          <Search
            className={cn(
              "h-5 w-5",
              theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
            )}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search remarks..."
            className={cn(
              "flex-1 border-none bg-transparent focus:outline-none",
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
            )}
          />
        </div>
      </div>

      {/* Remarks List */}
      <div className="space-y-4">
        <h3
          className={cn(
            "text-lg font-semibold",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Recent Remarks ({filteredRemarks.length})
        </h3>

        {filteredRemarks.length === 0 ? (
          <p
            className={cn(
              "text-center text-sm",
              theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
            )}
          >
            No remarks found. Start journaling your thoughts above!
          </p>
        ) : (
          <div className="space-y-3">
            {filteredRemarks.map((remark) => (
              <RemarkCard key={remark.id} remark={remark} theme={theme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components

const MoodButton: React.FC<MoodButtonProps> = ({
  mood,
  icon,
  selected,
  onClick,
  theme,
}) => {
  const moodColors = {
    positive: theme === "light" ? "text-kaizen-success" : "text-kaizen-success-dark",
    neutral: theme === "light" ? "text-kaizen-secondary" : "text-kaizen-secondary-dark",
    negative: theme === "light" ? "text-kaizen-error" : "text-kaizen-error-dark",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg p-2 transition-colors",
        selected
          ? theme === "light"
            ? "bg-kaizen-accent/20"
            : "bg-kaizen-accent-dark/20"
          : theme === "light"
          ? "hover:bg-kaizen-surface"
          : "hover:bg-kaizen-dark-surface",
        moodColors[mood],
      )}
    >
      {icon}
    </button>
  );
};

const RemarkCard: React.FC<RemarkCardProps> = ({ remark, theme }) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const moodIcons = {
    positive: <Smile className={cn("h-4 w-4", theme === "light" ? "text-kaizen-success" : "text-kaizen-success-dark")} />,
    neutral: <Meh className={cn("h-4 w-4", theme === "light" ? "text-kaizen-secondary" : "text-kaizen-secondary-dark")} />,
    negative: <Frown className={cn("h-4 w-4", theme === "light" ? "text-kaizen-error" : "text-kaizen-error-dark")} />,
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        theme === "light"
          ? "border-kaizen-border bg-kaizen-surface"
          : "border-kaizen-border bg-kaizen-dark-surface",
      )}
    >
      <div className="mb-2 flex items-start justify-between">
        <p
          className={cn(
            "flex-1 text-sm",
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          {remark.content}
        </p>
        {remark.mood && <div className="ml-2">{moodIcons[remark.mood]}</div>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {remark.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "flex items-center space-x-1 rounded-full px-2 py-1 text-xs",
                theme === "light"
                  ? "bg-kaizen-accent/20 text-kaizen-accent"
                  : "bg-kaizen-accent-dark/20 text-kaizen-accent-dark",
              )}
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
            </span>
          ))}
        </div>

        <span
          className={cn(
            "text-xs",
            theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
          )}
        >
          {formatDate(remark.timestamp)}
        </span>
      </div>
    </div>
  );
};

export { Notes };
