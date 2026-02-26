import Link from "next/link";

const features = [
  {
    href:  "/research",
    icon:  "🔬",
    title: "Research Copilot",
    desc:  "Upload PDFs, ask questions, get citation-backed answers via RAG.",
  },
  {
    href:  "/tasks",
    icon:  "⚡",
    title: "Task Extractor",
    desc:  "Paste meeting notes and let AI pull out structured, prioritised tasks.",
  },
  {
    href:  "/workflow",
    icon:  "🕸️",
    title: "Workflow Graph",
    desc:  "Visualise connections between you, documents, tasks, and deadlines.",
  },
  {
    href:  "/dashboard",
    icon:  "📊",
    title: "Dashboard",
    desc:  "See all your tasks and documents at a glance.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          Workflow<span className="text-brand-500">Brain</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
          An AI-powered productivity hub for students and early professionals. Research smarter, stay organised, visualise your work.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow transition-colors hover:bg-brand-700"
        >
          Open Dashboard
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {/* Feature grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group rounded-xl border border-surface-border bg-surface-card p-6 transition-colors hover:border-brand-500/60 hover:bg-surface-border/30"
          >
            <span className="text-3xl">{f.icon}</span>
            <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-brand-400">
              {f.title}
            </h2>
            <p className="mt-1 text-sm text-slate-400">{f.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
