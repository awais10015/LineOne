import { connect } from "@/lib/db";
import { Post } from "@/models/postModel"; // adjust import path
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();
    const posts = await Post.find()
      .populate("postBy")
      .populate("taggedUsers")
      .sort({ createdAt: -1 }); // newest first

    return NextResponse.json({ posts });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
