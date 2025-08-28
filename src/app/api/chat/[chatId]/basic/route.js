import { NextResponse } from "next/server";
import { Chat } from "@/models/chatModel";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const chat = await Chat.findById(params.chatId).populate(
      "participants",
      "name email profilePic"
    );

    if (!chat)
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });

    return NextResponse.json(chat);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
