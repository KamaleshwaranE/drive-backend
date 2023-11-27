import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import mongooseUniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  verifyTokenForRefresh: { type: String, required: true, default: uuid },
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedOn: Date,
  updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  avatarKey: String,
  avatarUrl: String,
  timezone: { type: Schema.Types.ObjectId, ref: "Timezone" },
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.plugin(mongooseUniqueValidator, {
  message: "Email already registered",
});

export default mongoose.model("User", userSchema);
