import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { requireAuth } from "@/lib/requireAuth";

async function updateSavedPosts(userId, postId, action) {
  await connect();
  const update =
    action === "add"
      ? { $addToSet: { savedPosts: postId } }
      : { $pull: { savedPosts: postId } };

  const user = await User.findByIdAndUpdate(userId, update, { new: true })
    .select("savedPosts")
    .populate({
      path: "savedPosts",
      populate: [
        { path: "postBy", select: "name username profilePic gender" },
        { path: "taggedUsers", select: "name username profilePic" },
        { path: "comments" },
      ],
    });

  return user;
}

export async function POST(_req, { params }) {
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;

  const { id: postId } = await params;
  if (!postId) {
    return NextResponse.json({ error: "Post id required" }, { status: 400 });
  }

  try {
    const user = await updateSavedPosts(authResult.user._id, postId, "add");
    return NextResponse.json({ savedPosts: user?.savedPosts ?? [] });
  } catch (error) {
    console.error("Save post:", error);
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;

  const { id: postId } = await params;
  if (!postId) {
    return NextResponse.json({ error: "Post id required" }, { status: 400 });
  }

  try {
    const user = await updateSavedPosts(authResult.user._id, postId, "remove");
    return NextResponse.json({ savedPosts: user?.savedPosts ?? [] });
  } catch (error) {
    console.error("Unsave post:", error);
    return NextResponse.json({ error: "Failed to unsave post" }, { status: 500 });
  }
}
