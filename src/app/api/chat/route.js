import { NextResponse } from "next/server";
import { Chat } from "@/models/chatModel";
import { connect } from "@/lib/db";

export async function POST(req) {
  try {
    await connect();
    const { userIds } = await req.json(); // [currentUserId, otherUserId]
    console.log("userIds",userIds)
    if (!userIds || userIds.length !== 2) {
      return NextResponse.json({ message: "Provide exactly two user IDs" }, { status: 400 });
    }

    let chat = await Chat.findOne({
      participants: { $all: userIds, $size: 2 },
    });

    if (!chat) {
      chat = await Chat.create({ participants: userIds, isGroup: false });
    }

    return NextResponse.json(chat, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
