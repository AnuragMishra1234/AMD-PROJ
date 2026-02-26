import { ChromaClient, type Collection } from "chromadb";

const CHROMA_URL      = process.env.CHROMA_URL || "http://localhost:8000";
const COLLECTION_NAME = "workflow_brain_docs";

let client:     ChromaClient | null = null;
let collection: Collection   | null = null;

async function getClient(): Promise<ChromaClient> {
  if (!client) {
    client = new ChromaClient({ path: CHROMA_URL });
  }
  return client;
}

export async function getCollection(): Promise<Collection> {
  if (collection) return collection;

  const c = await getClient();
  collection = await c.getOrCreateCollection({
    name:     COLLECTION_NAME,
    metadata: { "hnsw:space": "cosine" },
  });

  console.log("[ChromaDB] Collection ready:", COLLECTION_NAME);
  return collection;
}

export async function addDocumentChunks(
  documentId:   string,
  documentName: string,
  chunks:       string[],
  embeddings:   number[][]
): Promise<void> {
  const col = await getCollection();

  const ids       = chunks.map((_, i) => `${documentId}_chunk_${i}`);
  const metadatas = chunks.map(() => ({ documentId, documentName }));

  await col.add({ ids, embeddings, documents: chunks, metadatas });
  console.log(`[ChromaDB] Added ${chunks.length} chunks for doc ${documentId}`);
}

export async function queryCollection(
  queryEmbedding: number[],
  nResults = 5,
  documentIds?: string[]
): Promise<{ chunks: string[]; metadatas: Record<string, string>[] }> {
  const col = await getCollection();

  // Build an optional where-filter for the requested document IDs.
  // chromadb v1.9.x where-clause requires operator objects per field.
  type WhereClause = Parameters<Collection["query"]>[0]["where"];
  const whereClause: WhereClause =
    documentIds && documentIds.length > 0
      ? ({ documentId: { $in: documentIds } } as WhereClause)
      : undefined;

  const results = await col.query({
    queryEmbeddings: [queryEmbedding],
    nResults,
    ...(whereClause ? { where: whereClause } : {}),
  });

  const chunks    = (results.documents?.[0] ?? []).filter(Boolean) as string[];
  const metadatas = (results.metadatas?.[0]  ?? []).filter(Boolean) as Record<string, string>[];

  return { chunks, metadatas };
}

export async function deleteDocumentChunks(documentId: string): Promise<void> {
  const col = await getCollection();
  // chromadb v1.x col.delete with where-only is unreliable; fetch IDs first then delete.
  type GetWhere = Parameters<Collection["get"]>[0]["where"];
  const existing = await col.get({
    where: ({ documentId } as GetWhere),
  });
  if (existing.ids.length > 0) {
    await col.delete({ ids: existing.ids });
  }
  console.log(`[ChromaDB] Deleted ${existing.ids.length} chunks for doc ${documentId}`);
}
