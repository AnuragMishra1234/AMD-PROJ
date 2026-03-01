interface BadgeProps {
  label: string;
  variant?: "blue" | "green" | "yellow" | "red" | "gray";
}

const variantClasses: Record<string, string> = {
  blue:   "bg-blue-900/50 text-blue-300 border-blue-700",
  green:  "bg-green-900/50 text-green-300 border-green-700",
  yellow: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  red:    "bg-red-900/50 text-red-300 border-red-700",
  gray:   "bg-slate-800 text-slate-400 border-slate-600",
};

export default function Badge({ label, variant = "gray" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}
