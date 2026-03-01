import { NextRequest } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import { extractTasks } from "@/lib/langchain";
import TaskModel        from "@/models/Task";
import { ok, err }      from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json() as { text: string };
    if (!text?.trim()) return err("Text is required", 400);

    const extracted = await extractTasks(text);
    if (!extracted.length) return err("No tasks could be extracted from the provided text.", 422);

    await connectDB();

    const created = await TaskModel.insertMany(
      extracted.map((t) => ({
        title:      t.title,
        description: t.description,
        deadline:   t.deadline ?? undefined,
        priority:   t.priority,
        completed:  false,
        sourceText: text,
        createdAt:  new Date(),
      }))
    );

    return ok(created);
  } catch (e) {
    console.error("[/api/tasks/extract]", e);
    return err("Task extraction failed: " + (e instanceof Error ? e.message : String(e)));
  }
}
