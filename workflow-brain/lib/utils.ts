// ── Text extraction from buffer ───────────────────────────────────────────────
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text;
}

export function extractTextFromTxt(buffer: Buffer): string {
  return buffer.toString("utf-8");
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
