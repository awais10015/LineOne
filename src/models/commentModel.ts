import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    text: { type: String, required: true },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // name of your user model
      },
    ],
    parentId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

export const Comment =
  mongoose.models?.Comment || mongoose.model("Comment", commentSchema);
