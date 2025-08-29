import { NextResponse } from "next/server";
import { Chat } from "@/models/chatModel";
import { connect } from "@/lib/db";

export async function POST(req) {
  try {
    await connect();
    const { name, participants, groupIcon, admin } = await req.json();

  

    const groupChat = await Chat.create({
      participants,
      isGroup: true,
      groupIcon,
      name,
      admin,
    });

    return NextResponse.json(groupChat, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
