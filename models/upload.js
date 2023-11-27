import mongoose, { Schema } from "mongoose";

const uploadSchema = new Schema({
  file: { type: Schema.Types.ObjectId, ref: "File" },
  folder: { type: Schema.Types.ObjectId, ref: "Folder" },
  uploadOn: { type: Date, default: Date.now },
});

export default mongoose.model("Upload", uploadSchema);
