import mongoose, { Schema } from "mongoose";
import { nanoid } from "nanoid";

const logsSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(10),
    },
    location: {
      type: "String",
    },
    dates: {
      type: Schema.Types.Mixed,
    },
    start_date: {
      type: Date,
    },
    created_at: {
      type: Date,
    },
    updated_at: {
      type: Date,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Logs = mongoose.model("logs", logsSchema);
