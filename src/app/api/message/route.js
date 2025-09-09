import { NextResponse } from "next/server";
import mongoose from "mongoose"
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
console.log(chatId)
    let message = await Message.create({
      sentBy: senderId,
      sentTo,
      text,
      media,
      replyOf,
      chatId: new mongoose.Types.ObjectId(chatId),
    });

    message = await message.populate("sentBy", "name profilePic username");

    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: message._id },
      $set: { lastMessage: message._id },
    });

    const filteredRecipients = sentTo
      .map((user) => user._id.toString()) 
      .filter((id) => id !== senderId.toString());

    await User.updateMany(
      { _id: { $in: filteredRecipients } },
      { $push: { newMessages: message._id } }
    );

    await pusherServer.trigger(`chat-${chatId}`, "new-message", {
      message,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
