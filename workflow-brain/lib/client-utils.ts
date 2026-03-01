// ── Client-safe utility functions (no server/node dependencies) ───────────────

// ── Date formatting ───────────────────────────────────────────────────────────
export function formatDate(dateStr: string | Date | undefined): string {
  if (!dateStr) return "No deadline";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function isOverdue(deadline: string | undefined): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

// ── File type detection ───────────────────────────────────────────────────────
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

// ── Generic response helpers ──────────────────────────────────────────────────
export function ok<T>(data: T) {
  return Response.json({ success: true, data }, { status: 200 });
}

export function err(message: string, status = 500) {
  return Response.json({ success: false, error: message }, { status });
}
