import { connect } from "@/lib/db";
import { Post } from "@/models/postModel";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(req) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const body = await req.json();
    if (String(body.postBy) !== String(authResult.user._id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connect();

    const newPost = await Post.create(body);

    await User.findByIdAndUpdate(body.postBy, {
      $push: { posts: newPost._id },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error.message);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
