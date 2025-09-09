import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { Message } from "@/models/messageModel";
import mongoose from "mongoose";

export async function PATCH(req, { params }) {
  const { userId, chatId } = params;
  await connect();

  try {
    // Step 1: Load user
    const user = await User.findById(userId).select("newMessages");
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    if (!user.newMessages || user.newMessages.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No new messages",
          newMessages: [],
        }),
        { status: 200 }
      );
    }

    // Step 2: Find messages in this chat
    const messagesToRemove = await Message.find({
      _id: { $in: user.newMessages },
      chatId: chatId, // since each message has chatId field
    }).select("_id");

    const idsToRemove = messagesToRemove.map((m) => m._id);

    // Step 3: Pull them from user.newMessages
    if (idsToRemove.length > 0) {
      await User.findByIdAndUpdate(userId, {
        $pull: { newMessages: { $in: idsToRemove } },
      });
    }

    // Step 4: Return updated user
    const updatedUser = await User.findById(userId).select("newMessages");
    return new Response(
      JSON.stringify({ success: true, newMessages: updatedUser.newMessages }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error removing chat messages:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
