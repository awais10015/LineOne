import { connect } from "@/lib/db";
import { Comment } from "@/models/commentModel";
import { Post } from "@/models/postModel";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(req) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    await connect();
    const { commentBy, postId, text, parentId } = await req.json();

    if (String(commentBy) !== String(authResult.user._id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const comment = await Comment.create({
      commentBy,
      postId,
      text,
      parentId,
    });

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: comment._id },
      });
    }

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error.message);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
