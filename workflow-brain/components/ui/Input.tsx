import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

const baseClass =
  "w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-slate-200 placeholder-slate-500 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-300">{label}</label>}
      <input className={`${baseClass} ${error ? "border-red-500" : ""} ${className}`} {...props} />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-300">{label}</label>}
      <textarea
        className={`${baseClass} resize-none ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
