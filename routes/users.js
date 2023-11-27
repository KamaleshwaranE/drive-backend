import { Router } from "express";
import dayjs from "dayjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
const User = mongoose.model("User");
const ResetPassword = mongoose.model("ResetPassword");

const app = Router();

const AUTH_EXPIRY = 60 * 60 * 24;
const REFRESH_EXPIRY = 60 * 60 * 7;

const generateAuthToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: AUTH_EXPIRY,
  });
};

const generateRefreshToken = (id, verfyTokenRefresh) => {
  return jwt.sign(
    { id, verfyToken: verfyTokenRefresh },
    process.env.JWT_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  );
};

const generateTokens = (id, verfyTokenForRefresh) => {
  const authToken = generateAuthToken(id);
  const refreshToken = generateRefreshToken(id, verfyTokenForRefresh);
  return {
    authToken,
    refreshToken,
    expiresAt: dayjs().add(AUTH_EXPIRY, "seconds"),
  };
};

const signupValidation = [
  body("name").isString().notEmpty(),
  body("email")
    .isEmail()
    .custom(async (email) => {
      const result = await User.findOne({ email });
      if (result) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  body("phone").isString().notEmpty(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 digit long"),
];

app.post("/signup", signupValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ type: "validation", errors: errors.array() });
  }
  const { name, email, phone, password } = req.body;
  try {
    const user = new User({
      name,
      email: String(email).toLocaleLowerCase(),
      phone,
      password,
      isAdmin: true,
    });
    await user.save();

    res.json({
      ...generateTokens(user.id, user.verfyTokenForRefresh),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

const signinValidation = [
  body("email").isEmail().withMessage("Email is required"),
  body("password").isString().withMessage("Password is required"),
];

app.post("/signin", signinValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ type: "validation", errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await User.findOne({
    email: String(email).toLocaleLowerCase(),
  });
  if (!user) {
    return res.status(401).send("Invalid Credential");
  }
  const isValidPassword = await user.verifyPassword(password);
  if (!isValidPassword) {
    return res.status(401).send("Invalid Credential");
  }

  res.json({
    ...generateTokens(user.id, user.verfyTokenForRefresh),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

app.post("/resetPassword", async (req, res) => {
  const { email } = req.body;
  let resetPassword = await ResetPassword.findOne({ email });
  if (!resetPassword) {
    resetPassword = new ResetPassword({ email });
    await resetPassword.save();
    const user = await User.findOne({ email }, ["name"]);
    res.sendStatus(202);
  }
});

export default app;
