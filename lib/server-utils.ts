// Server-only utilities - can only be used in API routes and server components
// These require Node.js APIs like 'fs'

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text;
}

export function extractTextFromTxt(buffer: Buffer): string {
  return buffer.toString("utf-8");
}
