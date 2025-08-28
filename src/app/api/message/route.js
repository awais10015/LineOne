import { NextResponse } from "next/server";
import { Message } from "@/models/messageModel";
import { Chat } from "@/models/chatModel";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const { chatId, senderId, text, media, replyOf } = await req.json();

    const message = await Message.create({
      sentBy: senderId,
      text,
      media,
      replyOf,
      chatId,
    });

    await Chat.findByIdAndUpdate(chatId, { $push: { messages: message._id } });

    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
