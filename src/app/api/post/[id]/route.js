// app/api/posts/user/[id]/route.js
import { connect } from "@/lib/db";
import { Post } from "@/models/postModel";
import { NextResponse } from "next/server";
import { User } from "@/models/userModel";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connect();
    const { id } = await params;
    const post = await Post.findById(id)
      .populate("taggedUsers")
      .populate("postBy")
      .sort({ createdAt: -1 });

    const user = await User.findById("689d7a1e50f0ec15a52d131e");
    return NextResponse.json({ success: true, user, post });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
