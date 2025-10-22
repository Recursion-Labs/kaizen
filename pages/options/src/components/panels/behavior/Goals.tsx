import { cn } from "@extension/ui";
import { Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { useState } from "react";
import type React from "react";

interface GoalsPanelProps {
  theme: "light" | "dark";
}

type GoalType = "daily" | "weekly" | "monthly";
type GoalUnit = "minutes" | "hours" | "sessions" | "sites";

interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  target: number;
  current: number;
  unit: GoalUnit;
  createdAt: number;
  deadline?: number;
  completed: boolean;
}

export const Goals: React.FC<GoalsPanelProps> = ({ theme }) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Focus Time",
      description: "Achieve 3 hours of focused work daily",
      type: "daily",
      target: 180,
      current: 127,
      unit: "minutes",
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      completed: false,
    },
    {
      id: "2",
      title: "Reduce Social Media",
      description: "Limit social media to 30 minutes per day",
      type: "daily",
      target: 30,
      current: 18,
      unit: "minutes",
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      completed: false,
    },
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    type: "daily" as GoalType,
    target: 0,
    unit: "minutes" as GoalUnit,
  });

  const addGoal = () => {
    if (newGoal.title && newGoal.target > 0) {
      const goal: Goal = {
        id: Date.now().toString(),
        ...newGoal,
        current: 0,
        createdAt: Date.now(),
        completed: false,
      };

      setGoals([...goals, goal]);
      setNewGoal({
        title: "",
        description: "",
        type: "daily",
        target: 0,
        unit: "minutes",
      });
      setShowAddGoal(false);
    }
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const toggleCompleted = (id: string) => {
    setGoals(
      goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)),
    );
  };

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={cn(
              "text-2xl font-bold",
              theme === "light" ? "text-gray-900" : "text-white",
            )}
          >
            Goals Tracking
          </h2>
          <p
            className={cn(
              "text-sm",
              theme === "light" ? "text-gray-600" : "text-gray-400",
            )}
          >
            Set and track your browsing wellness objectives
          </p>
        </div>
        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddGoal && (
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
            Create New Goal
          </h3>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="goal-title"
                className={cn(
                  "mb-2 block text-sm font-medium",
                  theme === "light" ? "text-gray-700" : "text-gray-300",
                )}
              >
                Goal Title
              </label>
              <input
                id="goal-title"
                type="text"
                value={newGoal.title}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, title: e.target.value })
                }
                placeholder="E.g., Focus Time"
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                  theme === "light"
                    ? "border-gray-300 bg-white text-gray-900"
                    : "border-gray-600 bg-gray-700 text-white",
                )}
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="goal-description"
                className={cn(
                  "mb-2 block text-sm font-medium",
                  theme === "light" ? "text-gray-700" : "text-gray-300",
                )}
              >
                Description
              </label>
              <textarea
                id="goal-description"
                value={newGoal.description}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, description: e.target.value })
                }
                placeholder="Describe your goal..."
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                  theme === "light"
                    ? "border-gray-300 bg-white text-gray-900"
                    : "border-gray-600 bg-gray-700 text-white",
                )}
                rows={3}
              />
            </div>

            {/* Type and Target */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="goal-type"
                  className={cn(
                    "mb-2 block text-sm font-medium",
                    theme === "light" ? "text-gray-700" : "text-gray-300",
                  )}
                >
                  Type
                </label>
                <select
                  id="goal-type"
                  value={newGoal.type}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      type: e.target.value as GoalType,
                    })
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    theme === "light"
                      ? "border-gray-300 bg-white text-gray-900"
                      : "border-gray-600 bg-gray-700 text-white",
                  )}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="goal-target"
                  className={cn(
                    "mb-2 block text-sm font-medium",
                    theme === "light" ? "text-gray-700" : "text-gray-300",
                  )}
                >
                  Target
                </label>
                <input
                  id="goal-target"
                  type="number"
                  value={newGoal.target || ""}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      target: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="180"
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    theme === "light"
                      ? "border-gray-300 bg-white text-gray-900"
                      : "border-gray-600 bg-gray-700 text-white",
                  )}
                />
              </div>
            </div>

            {/* Unit */}
            <div>
              <label
                htmlFor="goal-unit"
                className={cn(
                  "mb-2 block text-sm font-medium",
                  theme === "light" ? "text-gray-700" : "text-gray-300",
                )}
              >
                Unit
              </label>
              <select
                id="goal-unit"
                value={newGoal.unit}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, unit: e.target.value as GoalUnit })
                }
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-sm",
                  theme === "light"
                    ? "border-gray-300 bg-white text-gray-900"
                    : "border-gray-600 bg-gray-700 text-white",
                )}
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="sessions">Sessions</option>
                <option value="sites">Sites</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={addGoal}
                disabled={!newGoal.title || newGoal.target <= 0}
                className={cn(
                  "flex-1 rounded-lg px-4 py-2 font-semibold transition-colors",
                  newGoal.title && newGoal.target > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-gray-400 text-gray-200",
                )}
              >
                Create Goal
              </button>
              <button
                onClick={() => setShowAddGoal(false)}
                className={cn(
                  "rounded-lg border px-4 py-2 font-semibold transition-colors",
                  theme === "light"
                    ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700",
                )}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Goals */}
      <div>
        <h3
          className={cn(
            "mb-4 text-lg font-semibold",
            theme === "light" ? "text-gray-900" : "text-white",
          )}
        >
          Active Goals ({activeGoals.length})
        </h3>

        {activeGoals.length === 0 ? (
          <p
            className={cn(
              "text-center text-sm",
              theme === "light" ? "text-gray-600" : "text-gray-400",
            )}
          >
            No active goals. Create your first goal above!
          </p>
        ) : (
          <div className="space-y-3">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggle={toggleCompleted}
                onDelete={deleteGoal}
                theme={theme}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3
            className={cn(
              "mb-4 text-lg font-semibold",
              theme === "light" ? "text-gray-900" : "text-white",
            )}
          >
            Completed Goals ({completedGoals.length})
          </h3>
          <div className="space-y-3">
            {completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggle={toggleCompleted}
                onDelete={deleteGoal}
                theme={theme}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components

interface GoalCardProps {
  goal: Goal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  theme: "light" | "dark";
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onToggle,
  onDelete,
  theme,
}) => {
  const progress = (goal.current / goal.target) * 100;
  const isComplete = goal.current >= goal.target || goal.completed;

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        isComplete
          ? theme === "light"
            ? "border-green-200 bg-green-50"
            : "border-green-800 bg-green-900/20"
          : theme === "light"
            ? "border-gray-200 bg-white"
            : "border-gray-700 bg-gray-800",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-1 items-start space-x-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(goal.id)}
            className="mt-1 text-blue-600 dark:text-blue-400"
          >
            {isComplete ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4
                className={cn(
                  "font-semibold",
                  isComplete && "line-through",
                  theme === "light" ? "text-gray-900" : "text-white",
                )}
              >
                {goal.title}
              </h4>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  theme === "light"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-blue-900/30 text-blue-300",
                )}
              >
                {goal.type}
              </span>
            </div>

            {goal.description && (
              <p
                className={cn(
                  "mt-1 text-sm",
                  theme === "light" ? "text-gray-600" : "text-gray-400",
                )}
              >
                {goal.description}
              </p>
            )}

            {/* Progress Bar */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span
                  className={cn(
                    theme === "light" ? "text-gray-700" : "text-gray-300",
                  )}
                >
                  {goal.current} / {goal.target} {goal.unit}
                </span>
                <span
                  className={cn(
                    "font-semibold",
                    isComplete
                      ? "text-green-600 dark:text-green-400"
                      : theme === "light"
                        ? "text-blue-600"
                        : "text-blue-400",
                  )}
                >
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={cn(
                    "h-full transition-all",
                    isComplete ? "bg-green-500" : "bg-blue-500",
                  )}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(goal.id)}
          className={cn(
            "ml-2 rounded p-1 transition-colors",
            theme === "light"
              ? "text-red-600 hover:bg-red-50"
              : "text-red-400 hover:bg-red-900/30",
          )}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
