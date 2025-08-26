import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    eventBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event : { type: String, required: true },
    seen: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Notification =
  mongoose.models?.Notification || mongoose.model("Notification", notificationSchema);
