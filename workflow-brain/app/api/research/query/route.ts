import { NextRequest } from "next/server";
import { ragQuery }     from "@/lib/langchain";
import { ok, err }      from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, documentIds } = body as {
      question: string;
      documentIds?: string[];
    };

    if (!question?.trim()) return err("Question is required", 400);

    const result = await ragQuery(question, documentIds);
    return ok(result);
  } catch (e) {
    console.error("[/api/research/query]", e);
    return err("Query failed: " + (e instanceof Error ? e.message : String(e)));
  }
}
