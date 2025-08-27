import { connect } from "@/lib/db";
import { Post } from "@/models/postModel"; // adjust import path
import { NextResponse } from "next/server";
import {User} from "@/models/userModel"

export async function GET() {
  try {
    await connect();
    const posts = await Post.find()
      .populate("postBy")
      .populate("taggedUsers")
      .sort({ createdAt: -1 }); // newest first

    const user = await User.findById("689d7a1e50f0ec15a52d131e")
    
    return NextResponse.json({success: true , user , posts });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


