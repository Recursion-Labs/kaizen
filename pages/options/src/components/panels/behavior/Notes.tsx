import { cn } from "@extension/ui";
import { Plus, Search, Tag, Smile, Frown, Meh } from "lucide-react";
import { useState } from "react";
import type React from "react";

interface RemarksPanelProps {
  theme: "light" | "dark";
}

type RemarkMood = "positive" | "neutral" | "negative";
type RemarkCategory =
  | "goal"
  | "reflection"
  | "achievement"
  | "challenge"
  | "note";

interface Remark {
  id: string;
  timestamp: number;
  content: string;
  tags: string[];
  mood?: RemarkMood;
  category?: RemarkCategory;
}

export const Notes: React.FC<RemarksPanelProps> = ({ theme }) => {
  const [remarks, setRemarks] = useState<Remark[]>([
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
      const remark: Remark = {
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
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          Personal Remarks
        </h2>
        <p
          className={cn(
            "text-sm",
            theme === "light" ? "text-gray-600" : "text-gray-400",
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
            ? "border-gray-200 bg-white"
            : "border-gray-700 bg-gray-800",
        )}
      >
        <h3
          className={cn(
            "mb-4 text-lg font-semibold",
            theme === "light" ? "text-gray-900" : "text-white",
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
            "mb-4 w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
            theme === "light"
              ? "border-gray-300 bg-white text-gray-900"
              : "border-gray-600 bg-gray-700 text-white",
          )}
          rows={4}
        />

        {/* Mood Selection */}
        <div className="mb-4 flex items-center space-x-4">
          <span
            className={cn(
              "text-sm font-medium",
              theme === "light" ? "text-gray-700" : "text-gray-300",
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
              theme === "light" ? "text-gray-700" : "text-gray-300",
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
                ? "border-gray-300 bg-white text-gray-900"
                : "border-gray-600 bg-gray-700 text-white",
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
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "cursor-not-allowed bg-gray-400 text-gray-200",
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
            ? "border-gray-200 bg-white"
            : "border-gray-700 bg-gray-800",
        )}
      >
        <div className="flex items-center space-x-3">
          <Search
            className={cn(
              "h-5 w-5",
              theme === "light" ? "text-gray-400" : "text-gray-500",
            )}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search remarks..."
            className={cn(
              "flex-1 border-none bg-transparent focus:outline-none",
              theme === "light" ? "text-gray-900" : "text-white",
            )}
          />
        </div>
      </div>

      {/* Remarks List */}
      <div className="space-y-4">
        <h3
          className={cn(
            "text-lg font-semibold",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          Recent Remarks ({filteredRemarks.length})
        </h3>

        {filteredRemarks.length === 0 ? (
          <p
            className={cn(
              "text-center text-sm",
              theme === "light" ? "text-gray-600" : "text-gray-400",
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

interface MoodButtonProps {
  mood: RemarkMood;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  theme: "light" | "dark";
}

const MoodButton: React.FC<MoodButtonProps> = ({
  mood,
  icon,
  selected,
  onClick,
  theme,
}) => {
  const moodColors = {
    positive: "text-green-600 dark:text-green-400",
    neutral: "text-yellow-600 dark:text-yellow-400",
    negative: "text-red-600 dark:text-red-400",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg p-2 transition-colors",
        selected
          ? "bg-blue-100 dark:bg-blue-900/30"
          : theme === "light"
            ? "hover:bg-gray-100"
            : "hover:bg-gray-700",
        moodColors[mood],
      )}
    >
      {icon}
    </button>
  );
};

interface RemarkCardProps {
  remark: Remark;
  theme: "light" | "dark";
}

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
    positive: <Smile className="h-4 w-4 text-green-600 dark:text-green-400" />,
    neutral: <Meh className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />,
    negative: <Frown className="h-4 w-4 text-red-600 dark:text-red-400" />,
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        theme === "light"
          ? "border-gray-200 bg-white"
          : "border-gray-700 bg-gray-800",
      )}
    >
      <div className="mb-2 flex items-start justify-between">
        <p
          className={cn(
            "flex-1 text-sm",
            theme === "light" ? "text-gray-900" : "text-white",
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
                  ? "bg-blue-100 text-blue-700"
                  : "bg-blue-900/30 text-blue-300",
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
            theme === "light" ? "text-gray-500" : "text-gray-500",
          )}
        >
          {formatDate(remark.timestamp)}
        </span>
      </div>
    </div>
  );
};
