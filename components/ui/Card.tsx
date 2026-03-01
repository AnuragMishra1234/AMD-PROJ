import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export default function Card({ children, className = "", title, description }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-surface-border bg-surface-card p-6 shadow-sm animate-fade-in ${className}`}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
