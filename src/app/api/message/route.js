import { NextResponse } from "next/server";
import { Message } from "@/models/messageModel";
import { Chat } from "@/models/chatModel";
import { User } from "@/models/userModel";
import { connect } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(req) {
  try {
    await connect();
    const { chatId, senderId, sentTo, text, media, replyOf } = await req.json();

    // Create new message
    let message = await Message.create({
      sentBy: senderId,
      sentTo,
      text,
      media,
      replyOf,
    });

    // Populate sender info for frontend
    message = await message.populate("sentBy", "name profilePic username");

    // Update chat: push message + set lastMessage
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: message._id },
      $set: { lastMessage: message._id },
    });

    // 1️⃣ Add message to newMessages of receivers
    await User.updateMany(
      { _id: { $in: sentTo.filter((id) => id.toString() !== senderId.toString()) } },
      { $push: { newMessages: message._id } }
    );

    // 2️⃣ Trigger Pusher event
    await pusherServer.trigger(`chat-${chatId}`, "new-message", {
      message,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
