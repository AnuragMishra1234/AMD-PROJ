"use client";

import { useState } from "react";
import Button        from "@/components/ui/Button";
import Card          from "@/components/ui/Card";
import { Textarea }  from "@/components/ui/Input";
import type { Citation } from "@/types";

interface QAEntry {
  question: string;
  answer:   string;
  citations: Citation[];
}

export default function QueryInterface() {
  const [question, setQuestion] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [history,  setHistory]  = useState<QAEntry[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setError("");
    setLoading(true);

    try {
      const res  = await fetch("/api/research/query", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ question }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Query failed");

      setHistory((prev) => [{ question, ...json.data }, ...prev]);
      setQuestion("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Query failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card title="Ask a Question" description="Query your uploaded documents using AI">
        <form onSubmit={handleSubmit} className="mt-2 space-y-3">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What are the main findings of the research paper?"
            rows={3}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" loading={loading} disabled={!question.trim()}>
            Ask Copilot
          </Button>
        </form>
      </Card>

      {history.map((entry, i) => (
        <Card key={i} className="space-y-3 animate-fade-in">
          {/* Question */}
          <div className="flex gap-3">
            <span className="mt-0.5 shrink-0 rounded-full bg-brand-700 px-2 py-0.5 text-xs font-bold text-white">Q</span>
            <p className="text-sm text-slate-300">{entry.question}</p>
          </div>

          {/* Answer */}
          <div className="flex gap-3">
            <span className="mt-0.5 shrink-0 rounded-full bg-green-700 px-2 py-0.5 text-xs font-bold text-white">A</span>
            <p className="whitespace-pre-wrap text-sm text-slate-200">{entry.answer}</p>
          </div>

          {/* Citations */}
          {entry.citations.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-300">
                {entry.citations.length} source{entry.citations.length > 1 ? "s" : ""}
              </summary>
              <ul className="mt-2 space-y-2">
                {entry.citations.map((c, ci) => (
                  <li key={ci} className="rounded-lg border border-surface-border bg-surface p-3 text-xs">
                    <p className="mb-1 font-semibold text-brand-400">[{ci + 1}] {c.documentName}</p>
                    <p className="line-clamp-3 text-slate-400">{c.chunk}</p>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </Card>
      ))}
    </div>
  );
}
