import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  postBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  media: { type: String },
  description: { type: String },
  taggedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  hashtags: {
    type: [String],
    default: [],
  },
  likedBy: {
    type: [String],
    default: [],
  },
  comments: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

export const Post = mongoose.models?.Post || mongoose.model("Post", postSchema);
