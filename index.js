import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/drive-backend", (error) => {
  if (error) {
    return console.error(error);
  }
  console.log("connected");
});

import "./models/user.js";
import "./models/file.js";
import "./models/folder.js";
import "./models/fileVersion.js";
import "./models/resetPassword.js";

import usersRoute from "./routes/users.js";
import profileRoute from "./routes/userProfile.js";
import filesRoute from "./routes/file.js";

app.use("/users", usersRoute);
app.use("/api/profile", profileRoute);
app.use("/HomePage", filesRoute);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server started listening on port ${port}`);
});
