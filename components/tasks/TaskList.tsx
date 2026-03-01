"use client";

import { useState, useEffect, useCallback } from "react";
import Card    from "@/components/ui/Card";
import Button  from "@/components/ui/Button";
import Badge   from "@/components/ui/Badge";
import { formatDate, isOverdue } from "@/lib/utils";
import type { ITask, Priority }  from "@/types";

const priorityVariant: Record<Priority, "blue" | "green" | "yellow" | "red"> = {
  low:      "blue",
  medium:   "green",
  high:     "yellow",
  critical: "red",
};

interface Props {
  refresh?: number; // bump to trigger a reload
}

export default function TaskList({ refresh }: Props) {
  const [tasks,   setTasks]   = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/tasks");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setTasks(json.data as ITask[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks, refresh]);

  async function toggleComplete(task: ITask) {
    const res  = await fetch("/api/tasks", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id: task._id, completed: !task.completed }),
    });
    const json = await res.json();
    if (json.success) {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? json.data : t)));
    }
  }

  async function deleteTask(id: string) {
    await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t._id !== id));
  }

  if (loading) return <p className="text-sm text-slate-400">Loading tasks…</p>;
  if (error)   return <p className="text-sm text-red-400">{error}</p>;
  if (!tasks.length) return (
    <Card>
      <p className="text-center text-sm text-slate-500">No tasks yet. Extract some from meeting notes!</p>
    </Card>
  );

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const overdue = !task.completed && isOverdue(task.deadline);
        return (
          <Card key={task._id} className={`transition-opacity ${task.completed ? "opacity-50" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleComplete(task)}
                  className={`mt-0.5 h-5 w-5 shrink-0 rounded border-2 transition-colors ${
                    task.completed
                      ? "border-green-500 bg-green-500"
                      : "border-surface-border hover:border-brand-500"
                  }`}
                >
                  {task.completed && (
                    <svg viewBox="0 0 12 12" fill="none" className="h-full w-full p-0.5">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                <div>
                  <p className={`font-medium ${task.completed ? "line-through text-slate-500" : "text-slate-100"}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="mt-0.5 text-sm text-slate-400">{task.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge label={task.priority} variant={priorityVariant[task.priority]} />
                    {task.deadline && (
                      <span className={`text-xs ${overdue ? "text-red-400" : "text-slate-500"}`}>
                        {overdue ? "Overdue: " : ""}{formatDate(task.deadline)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask(task._id!)}
                className="shrink-0 text-slate-600 hover:text-red-400"
              >
                ✕
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
