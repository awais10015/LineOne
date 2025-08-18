import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  commentBy: { type: String },
  text: { type: String },
  likedBy: {
    type: [String],
    default: []
  },
  comments: {
    type: [String],
    default: []
  }
});

export const Comment = mongoose.models?.Comment || mongoose.model("Comment", commentSchema);
