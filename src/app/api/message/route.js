import { NextResponse } from "next/server";
import { Message } from "@/models/messageModel";
import { Chat } from "@/models/chatModel";
import { User } from "@/models/userModel";
import { connect } from "@/lib/db";

export async function POST(req) {
  try {
    await connect();
    const { chatId, senderId, sentTo, text, media, replyOf } = await req.json();

    // create new message
    const message = await Message.create({
      sentBy: senderId,
      sentTo, 
      text,
      media,
      replyOf,
    });

    // update chat: push message + set lastMessage
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: message._id },
      $set: { lastMessage: message._id },
    });

    // update all receivers except sender
    await User.updateMany(
      { _id: { $in: sentTo.filter((id) => id !== senderId) } },
      { $push: { newMessages: message._id } }
    );

    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
