import { NextResponse } from "next/server";
import { Chat } from "@/models/chatModel";
import { Message } from "@/models/messageModel";
import { connect } from "@/lib/db";

export async function GET(req, { params }) {
  const id = await params?.chatId;
  try {
    await connect();

    const chat = await Chat.findById(id)
      .populate("participants")
      .populate("admin")
      .populate({
        path: "messages",
        populate: {
          path: "sentBy",
          model: "User",
        },
      });

    if (!chat)
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });

    return NextResponse.json(chat);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
