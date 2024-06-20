import mongoose, { Schema } from "mongoose";
import { nanoid } from "nanoid";

const userSchema = new Schema({
  _id: {
    type: String,
    default: () => nanoid(10),
  },
  email: {
    type: String,
  },
  total_count: {
    type: Number,
  },
  contribution_count: {
    type: Number,
  },
  web_used_count: {
    type: Number,
  },
  extension_used_count: {
    type: Number,
  },
  created_at: {
    type: Date,
  },
});

export const User = mongoose.model("users", userSchema);
