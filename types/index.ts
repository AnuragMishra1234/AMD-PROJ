// ── Document ─────────────────────────────────────────────────────────────────
export interface IDocument {
  _id?: string;
  name: string;
  content: string;
  chunks: string[];
  uploadedAt: Date;
  userId?: string;
}

// ── Task ─────────────────────────────────────────────────────────────────────
export type Priority = "low" | "medium" | "high" | "critical";

export interface ITask {
  _id?: string;
  title: string;
  description?: string;
  deadline?: string;   // ISO date string
  priority: Priority;
  completed: boolean;
  sourceText?: string; // original pasted text
  createdAt: Date;
  userId?: string;
}

// ── RAG ──────────────────────────────────────────────────────────────────────
export interface QueryRequest {
  question: string;
  documentIds?: string[];
}

export interface Citation {
  chunk: string;
  documentName: string;
  documentId: string;
}

export interface QueryResponse {
  answer: string;
  citations: Citation[];
}

// ── Workflow Graph ────────────────────────────────────────────────────────────
export interface GraphNode {
  id: string;
  type: "document" | "task" | "user" | "deadline";
  label: string;
  data: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface WorkflowGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ── API Responses ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
