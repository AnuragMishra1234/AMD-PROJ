import mongoose, { Schema, Document, Model } from "mongoose";
import type { IDocument } from "@/types";

export interface DocumentDoc extends Omit<IDocument, "_id">, Document {}

const DocumentSchema = new Schema<DocumentDoc>(
  {
    name:       { type: String, required: true },
    content:    { type: String, required: true },
    chunks:     { type: [String], default: [] },
    uploadedAt: { type: Date, default: Date.now },
    userId:     { type: String },
  },
  { timestamps: false }
);

const DocumentModel: Model<DocumentDoc> =
  mongoose.models.Document ||
  mongoose.model<DocumentDoc>("Document", DocumentSchema);

export default DocumentModel;
