import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value:string) => validator.isEmail(value),
      message: "Invalid email format",
    },
  },
  password: { type: String, select: false },
  googleId: { type: String },

  gender: { type: String },
  dateOfBirth: { type: Date },
  username: { type: String, unique: true, sparse: true },
  profilePic: { type: String },
  coverPic: { type: String, default: "/cover.jpg" },

  posts: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    default: [],
  },

  stories: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story",
      },
    ],
    default: [],
  },

  followers: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  following: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  bio: { type: String, default: "No Bio Added" },

  privateAccount: { type: Boolean, default: false },
  savedPosts: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    default: [],
  },
});

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
