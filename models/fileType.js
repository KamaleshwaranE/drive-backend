import mongoose, { Schema } from "mongoose";

const fileTypeSchema = new Schema({
  name: { type: String, required: true },
  allowMultipleFiles: { type: Boolean, default: true },
});

export default mongoose.model("FileType", fileTypeSchema);
