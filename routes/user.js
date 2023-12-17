import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.get("/signin", (req, res) => {
  return res.render("Signin");
});

router.get("/signup", (req, res) => {
  return res.render("Signup", {
    user: req.user,
  });
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  res.render("Signin");
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (err) {
    return res.render("Signin", {
      error: err,
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

export default router;
