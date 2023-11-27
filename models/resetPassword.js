import mongoose, { Schema } from "mongoose";
import { v4 as uuid } from "uuid";

const resetSchema = new Schema({
  email: String,
  resetToken: { type: String, default: uuid },
  createdOn: { type: Date, default: Date.now },
});

export default mongoose.model("ResetPassword", resetSchema);
