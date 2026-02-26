"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import Card   from "@/components/ui/Card";

interface UploadedDoc {
  documentId: string;
  name: string;
  chunkCount: number;
  uploadedAt: string;
}

interface Props {
  onUpload?: (doc: UploadedDoc) => void;
}

export default function DocumentUpload({ onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState("");
  const [docs,      setDocs]      = useState<UploadedDoc[]>([]);
  const [dragging,  setDragging]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res  = await fetch("/api/research/upload", { method: "POST", body: form });
      const json = await res.json();

      if (!json.success) throw new Error(json.error ?? "Upload failed");

      const doc = json.data as UploadedDoc;
      setDocs((prev) => [doc, ...prev]);
      onUpload?.(doc);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  return (
    <Card title="Upload Documents" description="PDF or TXT files for the RAG pipeline">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          dragging
            ? "border-brand-500 bg-brand-900/20"
            : "border-surface-border hover:border-brand-500/60 hover:bg-surface-border/20"
        }`}
      >
        <svg className="mb-3 h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm text-slate-400">
          <span className="font-semibold text-brand-400">Click to upload</span> or drag &amp; drop
        </p>
        <p className="mt-1 text-xs text-slate-500">PDF, TXT, MD</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }}
        />
      </div>

      {uploading && (
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          Extracting text and generating embeddings…
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {/* Uploaded list */}
      {docs.length > 0 && (
        <ul className="mt-4 space-y-2">
          {docs.map((doc) => (
            <li key={doc.documentId} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-sm">
              <span className="truncate font-medium text-slate-200">{doc.name}</span>
              <span className="ml-4 shrink-0 text-xs text-slate-500">{doc.chunkCount} chunks</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
