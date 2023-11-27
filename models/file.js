import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  name: { type: String, required: true },
  mime: { type: String, required: true },
  type: { type: String, required: true },
  version: { type: Schema.Types.ObjectId, ref: "FileVersion" },
  fileSize: { type: Number, required: true },
  uploadOn: { type: Date, default: Date.now },
  uploadBy: { type: Schema.Types.ObjectId, ref: "User" },
  inBin: { type: Boolean, default: false },
  binOn: { type: Date },
  binBy: { type: Schema.Types.ObjectId, ref: "User" },
  favorite: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

fileSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnObject) => {
    if (returnObject._id) {
      returnObject.id = returnObject._id.toString();
    }
    delete returnObject._id;
    delete returnObject.__v;
  },
});
export default mongoose.model("File", fileSchema);
