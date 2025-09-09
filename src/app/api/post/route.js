import { connect } from "@/lib/db";
import { Post } from "@/models/postModel";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    await connect();

    const newPost = await Post.create(body);

    await User.findByIdAndUpdate(body.postBy, {
      $push: { posts: newPost._id }
    })

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error.message);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
