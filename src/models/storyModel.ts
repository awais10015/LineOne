import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mediaUrl: { type: String, required: true }, 
  type: { type: String, enum: ["image", "video", "text"], default: "image" },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 }, 
});

export default mongoose.models.Story || mongoose.model("Story", storySchema);
