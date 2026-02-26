"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard",  label: "Dashboard" },
  { href: "/research",   label: "Research Copilot" },
  { href: "/tasks",      label: "Task Extractor" },
  { href: "/workflow",   label: "Workflow Graph" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-surface-border bg-surface-card px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            Workflow<span className="text-brand-500">Brain</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-600 text-white"
                    : "text-slate-400 hover:bg-surface-border hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
