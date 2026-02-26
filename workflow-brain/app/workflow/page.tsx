"use client";

import dynamic from "next/dynamic";
import Button  from "@/components/ui/Button";
import { useState } from "react";

// React Flow must be client-only (no SSR)
const WorkflowGraph = dynamic(
  () => import("@/components/workflow/WorkflowGraph"),
  { ssr: false, loading: () => (
    <div className="flex h-full items-center justify-center text-slate-400 text-sm">
      Loading graph renderer…
    </div>
  )}
);

export default function WorkflowPage() {
  const [key, setKey] = useState(0);

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col px-6 py-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Workflow Graph</h1>
          <p className="mt-1 text-sm text-slate-400">
            Interactive visualisation of your documents, tasks, and deadlines.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setKey((k) => k + 1)}>
          Refresh Graph
        </Button>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-surface-border bg-surface">
        <WorkflowGraph key={key} />
      </div>
    </div>
  );
}
