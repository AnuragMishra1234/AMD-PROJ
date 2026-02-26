"use client";

import { useState } from "react";
import TaskExtractor from "@/components/tasks/TaskExtractor";
import TaskList      from "@/components/tasks/TaskList";
import type { ITask } from "@/types";

export default function TasksPage() {
  const [refresh, setRefresh] = useState(0);

  function handleExtracted(_tasks: ITask[]) {
    setRefresh((n) => n + 1);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-1 text-3xl font-bold text-white">Smart Task Extractor</h1>
      <p className="mb-8 text-sm text-slate-400">
        Paste messy notes or emails. AI extracts tasks with deadlines and priorities automatically.
      </p>

      <div className="grid gap-8 lg:grid-cols-[480px_1fr]">
        <TaskExtractor onExtracted={handleExtracted} />
        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Your Tasks</h2>
          <TaskList refresh={refresh} />
        </div>
      </div>
    </div>
  );
}
