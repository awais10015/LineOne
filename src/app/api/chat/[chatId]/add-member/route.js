import { NextResponse } from "next/server";
import { Chat } from "@/models/chatModel";
import { connectDB } from "@/lib/db";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { members } = await req.json(); // array of userIds

    const chat = await Chat.findByIdAndUpdate(
      params.chatId,
      { $addToSet: { participants: { $each: members } } },
      { new: true }
    );

    if (!chat || !chat.isGroup) {
      return NextResponse.json(
        { message: "Group chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(chat);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
