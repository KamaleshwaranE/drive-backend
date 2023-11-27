import { Router } from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
const User = mongoose.model("User");

const app = Router();

app.get("/", async (req, res) => {
  res.json(req.user);
});

const validation = [];
app.post("/", async (req, res) => {});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const valid = await User.findOne({
    _id: { $ne: id },
    name: name,
    email: email,
    phone: phone,
  });
  if (valid) {
    res.status(409).send("User name already exist");
  } else {
    const result = await User.findById(id, {
      $set: {
        name: name,
        email: email,
        phone: phone,
      },
    });
    res.status(202).json(result);
  }
});

app.post("/verify_email", async (req, res) => {
  const { id } = req.user;
  const { email } = req.body;

  const user = await User.find({ email, _id: { $ne: id } });
  if (user) {
    res.sendStatus(406);
    return;
  }
  res.sendStatus(201);
});

export default app;
