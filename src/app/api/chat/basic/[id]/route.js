import { NextResponse } from "next/server";
import { Chat } from "@/models/chatModel";
import { Message } from "@/models/messageModel";
import { connect } from "@/lib/db";


export async function GET(req, { params }) {
  const { id } = await params;

  try {
    await connect();

    const chats = await Chat.find({ participants: id })
      .populate("participants")
      .populate("lastMessage")

    if (!chats || chats.length === 0) {
      return NextResponse.json(
        { message: "No chats found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(chats, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
