import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
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
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // name of your user model
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // name of your comment model
      },
    ],
  },
  { timestamps: true }
);

export const Post = mongoose.models?.Post || mongoose.model("Post", postSchema);
