import { connect } from "@/lib/db";
import { Post } from "@/models/postModel";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connect();
    const posts = await Post.find()
      .populate("postBy")
      .populate("taggedUsers")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
