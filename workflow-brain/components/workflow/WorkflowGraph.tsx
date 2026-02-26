"use client";

import { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node as FlowNode,
  NodeTypes,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";
import type { WorkflowGraphData, GraphNode } from "@/types";

// ── Custom node renderers ─────────────────────────────────────────────────────

function UserNode({ data }: { data: { label: string } }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-full border-2 border-brand-500 bg-brand-900/60 px-4 py-3 shadow-lg shadow-brand-900/40">
      <svg className="mb-1 h-6 w-6 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span className="text-xs font-semibold text-brand-200">{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="!bg-brand-400" />
    </div>
  );
}

function DocumentNode({ data }: { data: { label: string } }) {
  return (
    <div className="flex flex-col items-start rounded-lg border border-blue-600/50 bg-blue-900/40 px-3 py-2 shadow">
      <Handle type="target" position={Position.Top} className="!bg-blue-400" />
      <div className="flex items-center gap-1.5">
        <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
        </svg>
        <span className="max-w-[120px] truncate text-xs font-medium text-blue-200">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-400" />
    </div>
  );
}

function TaskNode({ data }: { data: { label: string; priority: string; completed: boolean } }) {
  const colors: Record<string, string> = {
    critical: "border-red-500/50 bg-red-900/30 text-red-200",
    high:     "border-yellow-500/50 bg-yellow-900/30 text-yellow-200",
    medium:   "border-green-500/50 bg-green-900/30 text-green-200",
    low:      "border-slate-500/50 bg-slate-800/50 text-slate-300",
  };
  return (
    <div className={`rounded-lg border px-3 py-2 shadow ${colors[data.priority] ?? colors.low}`}>
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-1.5">
        {data.completed && <span className="text-green-400">✓</span>}
        <span className="max-w-[130px] truncate text-xs font-medium">{data.label}</span>
      </div>
      <span className="mt-1 block text-[10px] uppercase opacity-60">{data.priority}</span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function DeadlineNode({ data }: { data: { label: string } }) {
  return (
    <div className="rounded border border-orange-500/50 bg-orange-900/30 px-3 py-1.5 shadow">
      <Handle type="target" position={Position.Top} className="!bg-orange-400" />
      <div className="flex items-center gap-1.5">
        <svg className="h-3 w-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-[10px] font-medium text-orange-200">{data.label}</span>
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  user:     UserNode,
  document: DocumentNode,
  task:     TaskNode,
  deadline: DeadlineNode,
};

// ── Auto-layout helper ────────────────────────────────────────────────────────
function layoutNodes(graphNodes: GraphNode[]): FlowNode[] {
  const byType: Record<string, GraphNode[]> = {
    user:     [],
    document: [],
    task:     [],
    deadline: [],
  };

  graphNodes.forEach((n) => {
    (byType[n.type] ??= []).push(n);
  });

  const positions: FlowNode[] = [];
  const cols: Record<string, number> = { user: 0, document: -500, task: 500, deadline: 900 };
  const ySpacing = 120;

  Object.entries(byType).forEach(([type, nodes]) => {
    const x = cols[type] ?? 0;
    nodes.forEach((n, i) => {
      positions.push({
        id:       n.id,
        type:     n.type,
        position: { x, y: i * ySpacing },
        data:     { label: n.label, ...n.data },
      });
    });
  });

  return positions;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function WorkflowGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/workflow");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      const data = json.data as WorkflowGraphData;
      setNodes(layoutNodes(data.nodes));
      setEdges(
        data.edges.map((e) => ({
          id:           e.id,
          source:       e.source,
          target:       e.target,
          label:        e.label,
          animated:     true,
          style:        { stroke: "#475569" },
          labelStyle:   { fill: "#94a3b8", fontSize: 10 },
          labelBgStyle: { fill: "#1e293b" },
        }))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load graph");
    } finally {
      setLoading(false);
    }
  }, [setNodes, setEdges]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="flex h-full items-center justify-center text-slate-400">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <span className="ml-3 text-sm">Building workflow graph…</span>
    </div>
  );

  if (error) return <p className="p-4 text-sm text-red-400">{error}</p>;

  if (!nodes.length) return (
    <div className="flex h-full items-center justify-center text-slate-500 text-sm">
      No data yet. Upload documents and extract tasks to see your workflow graph.
    </div>
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      className="rounded-xl"
    >
      <Background color="#334155" gap={20} />
      <Controls className="[&>button]:bg-surface-card [&>button]:border-surface-border [&>button]:text-slate-300" />
      <MiniMap
        nodeColor={(n) => {
          const m: Record<string, string> = {
            user:     "#2563eb",
            document: "#1d4ed8",
            task:     "#166534",
            deadline: "#c2410c",
          };
          return m[n.type ?? ""] ?? "#475569";
        }}
        className="!bg-surface-card !border-surface-border"
      />
    </ReactFlow>
  );
}
