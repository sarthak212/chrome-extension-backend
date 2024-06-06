import mongoose, { Schema } from "mongoose";
import { nanoid } from "nanoid";

const logsSchema = new Schema({
  _id: {
    type: String,
    default: () => nanoid(10),
  },
  location: {
    type: "String",
  },
  dates: {
    type: [Date],
  },
  start_date: {
    type: Date,
  },
});

export const Logs = mongoose.model("logs", logsSchema);
