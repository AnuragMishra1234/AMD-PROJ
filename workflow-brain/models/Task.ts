import mongoose, { Schema, Document, Model } from "mongoose";
import type { ITask, Priority } from "@/types";

export interface TaskDoc extends Omit<ITask, "_id">, Document {}

const TaskSchema = new Schema<TaskDoc>(
  {
    title:       { type: String, required: true },
    description: { type: String, default: "" },
    deadline:    { type: String },
    priority:    {
      type:    String,
      enum:    ["low", "medium", "high", "critical"] satisfies Priority[],
      default: "medium",
    },
    completed:   { type: Boolean, default: false },
    sourceText:  { type: String },
    createdAt:   { type: Date, default: Date.now },
    userId:      { type: String },
  },
  { timestamps: false }
);

const TaskModel: Model<TaskDoc> =
  mongoose.models.Task ||
  mongoose.model<TaskDoc>("Task", TaskSchema);

export default TaskModel;
