import mongoose, { Schema } from "mongoose";
import { nanoid } from "nanoid";

const screenshotSchema = new Schema({
  _id: {
    type: String,
    default: () => nanoid(10),
  },
  user_id: {
    type: String,
  },
  url: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const Screenshot = mongoose.model("screenshots", screenshotSchema);
