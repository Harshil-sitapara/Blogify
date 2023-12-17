import 'dotenv/config'
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

import userRouter from "./routes/user.js";
import blogRouter from "./routes/blog.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import checkForAuthenticationCookie from "./middlewares/auth.js";
import Blog from "./models/blog.js";

const app = express();
const PORT = process.env.PORT || 5000;

// mongodb connection
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Database connected!");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
