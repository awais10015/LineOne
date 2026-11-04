import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import "@/models/postModel";
import "@/models/commentModel";
import "@/models/messageModel";

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ user: null });
  }

  try {
    await connect();

    const user = await User.findOne({ email })
      .select("+password")
      .populate({
        path: "followers",
        select: "name username profilePic",
      })
      .populate({
        path: "following",
        select: "name username profilePic",
      })
      .populate("newMessages")
      .populate({
        path: "posts",
        populate: [
          { path: "taggedUsers", select: "name username profilePic" },
          { path: "comments" },
        ],
      })
      .populate({
        path: "savedPosts",
        populate: [
          { path: "postBy", select: "name username profilePic gender" },
          { path: "taggedUsers", select: "name username profilePic" },
          { path: "comments" },
        ],
      });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    const userObject = user.toObject({ virtuals: true });
    userObject.followOnboardingCompleted = !!userObject.followOnboardingCompleted;

    return NextResponse.json({ user: userObject });
  } catch (error) {
    console.error("GET /api/currentUser:", error);
    return NextResponse.json(
      { user: null, error: "Failed to load user" },
      { status: 503 }
    );
  }
}
