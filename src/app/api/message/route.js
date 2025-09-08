import { NextResponse } from "next/server";
import { Message } from "@/models/messageModel";
import { Chat } from "@/models/chatModel";
import { User } from "@/models/userModel";
import { connect } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import Pusher from "pusher-js";


export async function POST(req) {
  try {
    await connect();
    const { chatId, senderId, sentTo, text, media, replyOf } = await req.json();

    // 1️⃣ create new message
    let message = await Message.create({
      
      sentBy: senderId,
      sentTo,
      text,
      media,
      replyOf,
    });

    // 2️⃣ populate sender info for frontend
    message = await message.populate("sentBy", "name profilePic username");

    // 3️⃣ update chat: push message + set lastMessage
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: message._id },
      $set: { lastMessage: message._id },
    });

    // 4️⃣ update unread messages for receivers
    await User.updateMany(
      { _id: { $in: sentTo.filter((id) => id.toString() !== senderId.toString()) } },
      { $push: { newMessages: message._id } }
    );

    // 5️⃣ trigger pusher event
    await pusherServer.trigger(`chat-${chatId}`, "new-message", {
      message,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
