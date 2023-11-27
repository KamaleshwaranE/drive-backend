import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  name: { type: String, required: true },
});

export default mongoose.model("Folder", folderSchema);

/**
 * parent: null
 * name: 'My Drive'
 * id: 1
 *
 *
 * parent: 1,
 * name: 'Study Clg',
 * id: 2,
 *
 * parent: 2,
 * name: 'Untitled',
 * id: 3
 *
 * parent: 3,
 * name: 'Untitle',
 * id: 4
 */
