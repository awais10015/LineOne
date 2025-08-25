import { connect } from "@/lib/db";
import {Comment} from "@/models/commentModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connect();
    const { id } = params;   // <-- no need for await here

    // find all comments that belong to this post
    const comments = await Comment.find({ postId: id })
      .sort({ createdAt: 1 }) 
      .populate("commentBy");

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
