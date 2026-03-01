import { NextRequest } from "next/server";
import { connectDB }             from "@/lib/mongodb";
import { ingestDocument }        from "@/lib/langchain";
import { extractTextFromPDF, extractTextFromTxt } from "@/lib/server-utils";
import { getFileExtension, ok, err } from "@/lib/utils";
import DocumentModel             from "@/models/Document";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData  = await req.formData();
    const file      = formData.get("file") as File | null;

    if (!file) return err("No file provided", 400);

    const ext    = getFileExtension(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());

    let content = "";
    if (ext === "pdf") {
      content = await extractTextFromPDF(buffer);
    } else if (ext === "txt" || ext === "md") {
      content = extractTextFromTxt(buffer);
    } else {
      return err("Unsupported file type. Only PDF and TXT/MD are allowed.", 400);
    }

    if (!content.trim()) return err("Could not extract text from the file.", 400);

    await connectDB();

    const doc = await DocumentModel.create({
      name:       file.name,
      content,
      chunks:     [],
      uploadedAt: new Date(),
    });

    const chunks = await ingestDocument(doc._id.toString(), file.name, content);

    doc.chunks = chunks;
    await doc.save();

    return ok({
      documentId:  doc._id.toString(),
      name:        doc.name,
      chunkCount:  chunks.length,
      uploadedAt:  doc.uploadedAt,
    });
  } catch (e) {
    console.error("[/api/research/upload]", e);
    return err("Upload failed: " + (e instanceof Error ? e.message : String(e)));
  }
}

export async function GET() {
  try {
    await connectDB();
    const docs = await DocumentModel.find({}, { content: 0, chunks: 0 }).sort({ uploadedAt: -1 });
    return ok(docs);
  } catch (e) {
    console.error("[/api/research/upload GET]", e);
    return err("Failed to fetch documents");
  }
}
