import { connect } from "@/lib/db";
import { Post } from "@/models/postModel";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireAuth, isFollowing } from "@/lib/requireAuth";

export async function GET(_req, { params }) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    await connect();
    const { id } = await params;
    const profileUser = await User.findById(id).select("privateAccount");
    if (!profileUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isSelf = String(id) === String(authResult.user._id);
    const canView =
      isSelf ||
      !profileUser.privateAccount ||
      isFollowing(authResult.user, id);

    if (!canView) {
      return NextResponse.json({ success: true, posts: [] });
    }

    const posts = await Post.find({ postBy: new mongoose.Types.ObjectId(id) })
      .populate("postBy", "name username profilePic gender")
      .populate("taggedUsers")
      .populate("comments")
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
