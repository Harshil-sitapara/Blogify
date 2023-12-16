import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  blogId: {
    type: mongoose.Schema.ObjectId,
    ref: "blog",
  },
  commentedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
});

const Comment = model("comment", commentSchema);

export default Comment;
