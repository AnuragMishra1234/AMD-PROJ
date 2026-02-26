import { connectDB }    from "@/lib/mongodb";
import DocumentModel   from "@/models/Document";
import TaskModel       from "@/models/Task";
import { ok, err }     from "@/lib/utils";
import type { GraphNode, GraphEdge } from "@/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const [docs, tasks] = await Promise.all([
      DocumentModel.find({}, { content: 0, chunks: 0 }),
      TaskModel.find({}),
    ]);

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Central user node
    nodes.push({
      id:    "user-1",
      type:  "user",
      label: "You",
      data:  { role: "student" },
    });

    // Document nodes + edges from user
    docs.forEach((doc) => {
      const id = doc._id.toString();
      nodes.push({
        id,
        type:  "document",
        label: doc.name,
        data:  { uploadedAt: doc.uploadedAt },
      });
      edges.push({ id: `user-1__${id}`, source: "user-1", target: id, label: "uploaded" });
    });

    // Task nodes + edges from user; deadline nodes when present
    tasks.forEach((task) => {
      const id = task._id.toString();
      nodes.push({
        id,
        type:  "task",
        label: task.title,
        data:  { priority: task.priority, completed: task.completed },
      });
      edges.push({ id: `user-1__${id}`, source: "user-1", target: id, label: "assigned" });

      if (task.deadline) {
        const dlId = `dl-${id}`;
        nodes.push({
          id:    dlId,
          type:  "deadline",
          label: task.deadline,
          data:  { deadline: task.deadline },
        });
        edges.push({ id: `${id}__${dlId}`, source: id, target: dlId, label: "due" });
      }
    });

    return ok({ nodes, edges });
  } catch (e) {
    console.error("[/api/workflow GET]", e);
    return err("Failed to build workflow graph");
  }
}
