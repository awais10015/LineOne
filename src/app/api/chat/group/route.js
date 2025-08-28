import { NextResponse } from "next/server";
import { Chat } from "@/models/chatModel";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const { name, userIds } = await req.json();

    if (!name || !userIds || userIds.length < 3) {
      return NextResponse.json({ message: "Group must have a name and at least 3 members" }, { status: 400 });
    }

    const groupChat = await Chat.create({
      participants: userIds,
      isGroup: true,
      name,
    });

    return NextResponse.json(groupChat, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
