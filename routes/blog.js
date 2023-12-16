import express from "express";
import multer from "multer";
import path from "path";

import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const router = express.Router();

// here, we make storage to upload file in uploads folter using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  res.render("addblog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  // in the below, populate method automaticaly added current user's object in createdBy, Bcuz we added ref of user in blog model
  const blog = await Blog.findOne({ _id: req.params.id }).populate("createdBy");
  const comments = await Comment.find({blogId:req.params.id}).populate("commentedBy");
  res.render("blog", {
    user: req.user,
    blog: blog,
    comments
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    commentedBy: req.user._id,
    blogId: req.params.blogId,
  });
  res.redirect(`/blog/${req.params.blogId}`);
});

export default router;
