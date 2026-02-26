import { NextRequest } from "next/server";
import { connectDB }   from "@/lib/mongodb";
import TaskModel       from "@/models/Task";
import { ok, err }     from "@/lib/utils";

export const runtime = "nodejs";

// GET /api/tasks  — list all tasks
export async function GET() {
  try {
    await connectDB();
    const tasks = await TaskModel.find({}).sort({ createdAt: -1 });
    return ok(tasks);
  } catch (e) {
    console.error("[/api/tasks GET]", e);
    return err("Failed to fetch tasks");
  }
}

// POST /api/tasks  — create a single task manually
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();
    const task = await TaskModel.create({ ...body, createdAt: new Date() });
    return ok(task);
  } catch (e) {
    console.error("[/api/tasks POST]", e);
    return err("Failed to create task");
  }
}

// PATCH /api/tasks  — update a task (expects { id, ...fields })
export async function PATCH(req: NextRequest) {
  try {
    const { id, ...fields } = await req.json();
    if (!id) return err("id is required", 400);
    await connectDB();
    const task = await TaskModel.findByIdAndUpdate(id, fields, { new: true });
    if (!task) return err("Task not found", 404);
    return ok(task);
  } catch (e) {
    console.error("[/api/tasks PATCH]", e);
    return err("Failed to update task");
  }
}

// DELETE /api/tasks?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return err("id is required", 400);
    await connectDB();
    await TaskModel.findByIdAndDelete(id);
    return ok({ deleted: id });
  } catch (e) {
    console.error("[/api/tasks DELETE]", e);
    return err("Failed to delete task");
  }
}
