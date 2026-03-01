import DocumentUpload  from "@/components/research/DocumentUpload";
import QueryInterface  from "@/components/research/QueryInterface";

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-1 text-3xl font-bold text-white">Research Copilot</h1>
      <p className="mb-8 text-sm text-slate-400">
        Upload documents, then ask questions. Answers are grounded in your content with citations.
      </p>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div>
          <DocumentUpload />
        </div>
        <div>
          <QueryInterface />
        </div>
      </div>
    </div>
  );
}
