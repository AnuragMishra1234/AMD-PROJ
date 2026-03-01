"use client";

import { useState } from "react";
import Button        from "@/components/ui/Button";
import Card          from "@/components/ui/Card";
import { Textarea }  from "@/components/ui/Input";
import type { ITask } from "@/types";

interface Props {
  onExtracted?: (tasks: ITask[]) => void;
}

export default function TaskExtractor({ onExtracted }: Props) {
  const [text,    setText]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleExtract(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setError("");
    setLoading(true);

    try {
      const res  = await fetch("/api/tasks/extract", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ text }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Extraction failed");

      onExtracted?.(json.data as ITask[]);
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Extraction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      title="Smart Task Extractor"
      description="Paste meeting notes, emails, or any messy text. AI will extract structured tasks."
    >
      <form onSubmit={handleExtract} className="mt-2 space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder={`Paste your meeting notes here…\n\nExample:\n"John needs to finish the market research by end of month. Sarah should schedule a client call ASAP — mark it critical. The team must update the Notion docs before the Friday standup."`}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" loading={loading} disabled={!text.trim()} size="lg">
          Extract Tasks
        </Button>
      </form>
    </Card>
  );
}
