"use client";

import { useState, useEffect } from "react";
import Card   from "@/components/ui/Card";
import Badge  from "@/components/ui/Badge";
import { formatDate } from "@/lib/client-utils";
import type { ITask, IDocument, Priority } from "@/types";

const priorityVariant: Record<Priority, "blue" | "green" | "yellow" | "red"> = {
  low:      "blue",
  medium:   "green",
  high:     "yellow",
  critical: "red",
};

export default function DashboardPage() {
  const [tasks, setTasks]  = useState<ITask[]>([]);
  const [docs,  setDocs]   = useState<IDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/research/upload").then((r) => r.json()),
    ]).then(([tasksRes, docsRes]) => {
      if (tasksRes.success) setTasks(tasksRes.data);
      if (docsRes.success)  setDocs(docsRes.data);
      setLoading(false);
    });
  }, []);

  const pending   = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);
  const critical  = tasks.filter((t) => t.priority === "critical" && !t.completed);

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center text-slate-400 text-sm">
        Loading dashboard…
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Tasks",   value: tasks.length,     color: "text-slate-200" },
          { label: "Pending",       value: pending.length,   color: "text-yellow-400" },
          { label: "Completed",     value: completed.length, color: "text-green-400"  },
          { label: "Documents",     value: docs.length,      color: "text-brand-400"  },
        ].map(({ label, value, color }) => (
          <Card key={label} className="text-center">
            <p className={`text-4xl font-bold ${color}`}>{value}</p>
            <p className="mt-1 text-xs text-slate-500">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Critical tasks */}
        <Card title="Critical Tasks" description="Highest priority items that need attention">
          {critical.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No critical tasks — great job!</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {critical.slice(0, 6).map((t) => (
                <li key={t._id} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
                  <span className="text-sm text-slate-200">{t.title}</span>
                  <span className="text-xs text-slate-500">{formatDate(t.deadline)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recent documents */}
        <Card title="Recent Documents" description="Uploaded to the research pipeline">
          {docs.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No documents uploaded yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {docs.slice(0, 6).map((d) => (
                <li key={d._id} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
                  <span className="truncate text-sm text-slate-200">{d.name}</span>
                  <span className="ml-4 shrink-0 text-xs text-slate-500">{formatDate(d.uploadedAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* All tasks table */}
      <Card title="All Tasks">
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500">No tasks yet.</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border text-left text-xs text-slate-500">
                  <th className="pb-2 pr-4">Title</th>
                  <th className="pb-2 pr-4">Priority</th>
                  <th className="pb-2 pr-4">Deadline</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {tasks.map((t) => (
                  <tr key={t._id} className="text-slate-300">
                    <td className="py-2 pr-4 max-w-xs truncate">{t.title}</td>
                    <td className="py-2 pr-4">
                      <Badge label={t.priority} variant={priorityVariant[t.priority]} />
                    </td>
                    <td className="py-2 pr-4 text-xs text-slate-500">{formatDate(t.deadline)}</td>
                    <td className="py-2">
                      <Badge
                        label={t.completed ? "Done" : "Pending"}
                        variant={t.completed ? "green" : "gray"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
