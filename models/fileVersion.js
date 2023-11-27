import mongoose, { modelNames, Schema } from "mongoose";

const fileVersionSchema = new Schema({
  fileName: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  uploadedOn: { type: Date, default: Date.now },
  movedOn: { type: Date, default: Date.now },
  movedBy: { type: Schema.Types.ObjectId, ref: "User" },
  inBin: { type: Boolean, default: false },
  binOn: { type: Date },
  binBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("FileVersion", fileVersionSchema);
