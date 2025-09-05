import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { Chat } from "@/models/chatModel";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  try {
    const { chatId } = params;
    const { memberIds } = await req.json(); // can be single or multiple

    if (!memberIds || memberIds.length === 0) {
      return NextResponse.json({ error: "memberIds required" }, { status: 400 });
    }

    await connect();

    // Ensure it's always an array of ObjectIds
    const membersToRemove = Array.isArray(memberIds)
      ? memberIds.map((id) => new mongoose.Types.ObjectId(id))
      : [new mongoose.Types.ObjectId(memberIds)];

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { participants: { $in: membersToRemove } } },
      { new: true }
    )
      .populate("participants", "-password")
      .populate("messages");

    if (!updatedChat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(updatedChat, { status: 200 });
  } catch (err) {
    console.error("❌ remove-member error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
