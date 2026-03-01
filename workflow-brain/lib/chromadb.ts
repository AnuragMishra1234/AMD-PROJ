// Vector store using in-memory cache
// No ChromaDB server needed - works locally and on Vercel
import type { Collection } from "chromadb";

interface VectorEntry {
  id: string;
  embedding: number[];
  document: string;
  documentId: string;
  documentName: string;
}

// In-memory cache (will be empty on Vercel, but that's OK for MVP)
let vectorCache: Map<string, VectorEntry> = new Map();

export async function getCollection() {
  // Return a mock collection object - actual storage is in MongoDB via Document model
  return {
    add: async (data: any) => {
      // Store in memory cache for this session
      const { ids, embeddings, documents, metadatas } = data;
      ids.forEach((id: string, i: number) => {
        vectorCache.set(id, {
          id,
          embedding: embeddings[i],
          document: documents[i],
          documentId: metadatas[i].documentId,
          documentName: metadatas[i].documentName,
        });
      });
    },
    query: async (data: any) => {
      const { queryEmbeddings, nResults, where } = data;
      const queryEmbedding = queryEmbeddings[0];

      // Filter by documentId if specified
      let results = Array.from(vectorCache.values());
      if (where?.documentId?.$in) {
        const docIds = where.documentId.$in;
        results = results.filter(r => docIds.includes(r.documentId));
      }

      // Cosine similarity search
      results = results
        .map(entry => ({
          entry,
          score: cosineSimilarity(queryEmbedding, entry.embedding),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, nResults)
        .map(r => r.entry);

      return {
        documents: [results.map(r => r.document)],
        metadatas: [results.map(r => ({ documentId: r.documentId, documentName: r.documentName }))],
        distances: [],
      };
    },
    get: async (data: any) => {
      const { where } = data;
      let results = Array.from(vectorCache.values());
      
      if (where?.documentId) {
        results = results.filter(r => r.documentId === where.documentId);
      }
      
      return { ids: results.map(r => r.id), documents: results.map(r => r.document) };
    },
    delete: async (data: any) => {
      const { ids } = data;
      ids?.forEach((id: string) => vectorCache.delete(id));
    },
  } as any;
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  const dotProduct = a.reduce((sum, x, i) => sum + x * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, x) => sum + x * x, 0));
  const normB = Math.sqrt(b.reduce((sum, x) => sum + x * x, 0));
  return normA && normB ? dotProduct / (normA * normB) : 0;
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
  console.log(`[Vector Store] Added ${chunks.length} chunks for doc ${documentId}`);
}

export async function queryCollection(
  queryEmbedding: number[],
  nResults = 5,
  documentIds?: string[]
): Promise<{ chunks: string[]; metadatas: Record<string, string>[] }> {
  const col = await getCollection();

  const whereClause = documentIds && documentIds.length > 0
    ? { documentId: { $in: documentIds } }
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
  const existing = await col.get({
    where: { documentId },
  });
  if (existing.ids.length > 0) {
    await col.delete({ ids: existing.ids });
  }
  console.log(`[Vector Store] Deleted ${existing.ids.length} chunks for doc ${documentId}`);
}
