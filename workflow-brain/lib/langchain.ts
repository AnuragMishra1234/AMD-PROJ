import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { mockEmbed, groqChat }            from "./groq";
import { addDocumentChunks, queryCollection } from "./chromadb";
import type { Citation, QueryResponse }   from "@/types";

// ── Text splitting ────────────────────────────────────────────────────────────
export async function splitText(text: string): Promise<string[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize:    400,      // Smaller chunks = more detailed retrieval & better explanations
    chunkOverlap: 80,       // Overlap for context continuity
  });
  return splitter.splitText(text);
}

// ── Ingest document into vector store ────────────────────────────────────────
export async function ingestDocument(
  documentId: string,
  documentName: string,
  content: string
): Promise<string[]> {
  const chunks = await splitText(content);
  const embeddings = chunks.map((c) => mockEmbed(c));
  await addDocumentChunks(documentId, documentName, chunks, embeddings);
  return chunks;
}

// ── RAG query ────────────────────────────────────────────────────────────────
export async function ragQuery(
  question: string,
  documentIds?: string[]
): Promise<QueryResponse> {
  const qEmbedding = mockEmbed(question);
  const { chunks, metadatas } = await queryCollection(qEmbedding, 5, documentIds);

  if (chunks.length === 0) {
    return {
      answer: "No relevant information found in the uploaded documents.",
      citations: [],
    };
  }

  const context = chunks
    .map((c, i) => `[${i + 1}] ${c}`)
    .join("\n\n");

  const systemPrompt = `You are a research assistant. Answer the user's question using ONLY the provided context.
For each claim, cite the relevant chunk number like [1], [2], etc.
If the context does not contain enough information, say so clearly.

Context:
${context}`;

  const answer = await groqChat(systemPrompt, question);

  const citations: Citation[] = chunks.map((chunk, i) => ({
    chunk,
    documentName: (metadatas[i]?.documentName as string) ?? "Unknown",
    documentId:   (metadatas[i]?.documentId as string)   ?? "",
  }));

  return { answer, citations };
}

// ── Task extraction ───────────────────────────────────────────────────────────
export interface ExtractedTask {
  title:       string;
  description: string;
  deadline:    string | null;
  priority:    "low" | "medium" | "high" | "critical";
}

export async function extractTasks(rawText: string): Promise<ExtractedTask[]> {
  const systemPrompt = `You are a task extraction assistant. Given messy meeting notes or text, extract all actionable tasks.

Return ONLY a valid JSON array. Each task must have:
- "title"       : string  (short, action-oriented)
- "description" : string  (brief context, 1-2 sentences)
- "deadline"    : string | null  (ISO date e.g. "2024-12-31" or null)
- "priority"    : "low" | "medium" | "high" | "critical"

Example output:
[
  {
    "title": "Send project proposal",
    "description": "Prepare and send the Q4 project proposal to the client.",
    "deadline": "2024-11-15",
    "priority": "high"
  }
]

Return ONLY the JSON array, no markdown, no explanation.`;

  const raw = await groqChat(systemPrompt, rawText, 0.1);

  // Strip potential markdown code fences
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return [];
    return parsed as ExtractedTask[];
  } catch {
    console.error("[LangChain] Failed to parse task JSON:", cleaned);
    return [];
  }
}
