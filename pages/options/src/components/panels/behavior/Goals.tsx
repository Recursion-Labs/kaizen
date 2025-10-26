import { cn } from "@extension/ui";
import { Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { useState } from "react";
import type {
  GoalsPanelProps,
  BehaviorGoal,
  GoalFrequency,
  GoalUnit,
  GoalCardProps,
  NewGoalDraft,
} from "./types";
import type React from "react";

const Goals: React.FC<GoalsPanelProps> = ({ theme }) => {
  const [goals, setGoals] = useState<BehaviorGoal[]>([
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
  const [newGoal, setNewGoal] = useState<NewGoalDraft>({
    title: "",
    description: "",
    type: "daily",
    target: 0,
    unit: "minutes",
  });

  const addGoal = () => {
    if (newGoal.title && newGoal.target > 0) {
      const goal: BehaviorGoal = {
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
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
            )}
          >
            Goals Tracking
          </h2>
          <p
            className={cn(
              "text-sm",
              theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
            )}
          >
            Set and track your browsing wellness objectives
          </p>
        </div>
        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className={cn(
            "flex items-center space-x-2 rounded-lg px-4 py-2 font-semibold transition-colors",
            theme === "light"
              ? "bg-kaizen-accent text-kaizen-light-bg hover:bg-kaizen-accent/80"
              : "bg-kaizen-accent-dark text-kaizen-dark-text hover:bg-kaizen-accent/80",
          )}
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
            Create New Goal
          </h3>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="goal-title"
                className={cn(
                  "mb-2 block text-sm font-medium",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
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
                  "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2",
                  theme === "light"
                    ? "border-kaizen-border bg-kaizen-surface text-kaizen-light-text focus:ring-kaizen-accent"
                    : "border-kaizen-border bg-kaizen-dark-surface text-kaizen-dark-text focus:ring-kaizen-accent",
                )}
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="goal-description"
                className={cn(
                  "mb-2 block text-sm font-medium",
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
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
                  "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2",
                  theme === "light"
                    ? "border-kaizen-border bg-kaizen-surface text-kaizen-light-text focus:ring-kaizen-accent"
                    : "border-kaizen-border bg-kaizen-dark-surface text-kaizen-dark-text focus:ring-kaizen-accent",
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
                    theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
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
                      type: e.target.value as GoalFrequency,
                    })
                  }
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-sm",
                    theme === "light"
                      ? "border-kaizen-border bg-kaizen-surface text-kaizen-light-text"
                      : "border-kaizen-border bg-kaizen-dark-surface text-kaizen-dark-text",
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
                    theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
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
                      ? "border-kaizen-border bg-kaizen-surface text-kaizen-light-text"
                      : "border-kaizen-border bg-kaizen-dark-surface text-kaizen-dark-text",
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
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
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
                    ? "border-kaizen-border bg-kaizen-surface text-kaizen-light-text"
                    : "border-kaizen-border bg-kaizen-dark-surface text-kaizen-dark-text",
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
                    ? theme === "light"
                      ? "bg-kaizen-accent text-kaizen-light-bg hover:bg-kaizen-accent/80"
                      : "bg-kaizen-accent-dark text-kaizen-dark-text hover:bg-kaizen-accent/80"
                    : "cursor-not-allowed bg-kaizen-muted text-kaizen-light-muted",
                )}
              >
                Create Goal
              </button>
              <button
                onClick={() => setShowAddGoal(false)}
                className={cn(
                  "rounded-lg border px-4 py-2 font-semibold transition-colors",
                  theme === "light"
                    ? "border-kaizen-border text-kaizen-light-text hover:bg-kaizen-surface"
                    : "border-kaizen-border text-kaizen-dark-text hover:bg-kaizen-dark-surface",
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
            theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
          )}
        >
          Active Goals ({activeGoals.length})
        </h3>

        {activeGoals.length === 0 ? (
          <p
            className={cn(
              "text-center text-sm",
              theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
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
              theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
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
            ? "border-kaizen-success bg-kaizen-success/10"
            : "border-kaizen-success-dark bg-kaizen-success-dark/10"
          : theme === "light"
            ? "border-kaizen-border bg-kaizen-surface"
            : "border-kaizen-border bg-kaizen-dark-surface",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-1 items-start space-x-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(goal.id)}
            className={cn(
              "mt-1",
              theme === "light" ? "text-kaizen-accent" : "text-kaizen-accent-dark",
            )}
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
                  theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
                )}
              >
                {goal.title}
              </h4>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  theme === "light"
                    ? "bg-kaizen-accent/20 text-kaizen-accent"
                    : "bg-kaizen-accent-dark/20 text-kaizen-accent-dark",
                )}
              >
                {goal.type}
              </span>
            </div>

            {goal.description && (
              <p
                className={cn(
                  "mt-1 text-sm",
                  theme === "light" ? "text-kaizen-light-muted" : "text-kaizen-dark-muted",
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
                    theme === "light" ? "text-kaizen-light-text" : "text-kaizen-dark-text",
                  )}
                >
                  {goal.current} / {goal.target} {goal.unit}
                </span>
                <span
                  className={cn(
                    "font-semibold",
                    isComplete
                      ? theme === "light"
                        ? "text-kaizen-success"
                        : "text-kaizen-success-dark"
                      : theme === "light"
                      ? "text-kaizen-accent"
                      : "text-kaizen-accent-dark",
                  )}
                >
                  {Math.round(progress)}%
                </span>
              </div>
              <div
                className={cn(
                  "h-2 w-full overflow-hidden rounded-full",
                  theme === "light" ? "bg-kaizen-muted" : "bg-kaizen-dark-muted",
                )}
              >
                <div
                  className={cn(
                    "h-full transition-all",
                    isComplete
                      ? theme === "light"
                        ? "bg-kaizen-success"
                        : "bg-kaizen-success-dark"
                      : theme === "light"
                      ? "bg-kaizen-accent"
                      : "bg-kaizen-accent-dark",
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

export { Goals };
