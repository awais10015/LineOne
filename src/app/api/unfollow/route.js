import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(req) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const body = await req.json();
    const viewerId = String(authResult.user._id);

    if (String(body.unfollowedBy) !== viewerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connect();

    const followedUser = await User.findByIdAndUpdate(
      body.unfollow,
      { $pull: { followers: body.unfollowedBy } },
      { new: true }
    );

    const followingUser = await User.findByIdAndUpdate(
      body.unfollowedBy,
      { $pull: { following: body.unfollow } },
      { new: true }
    );

    return NextResponse.json({ followedUser, followingUser }, { status: 201 });
  } catch (error) {
    console.error("Error Unfollowing:", error.message);
    return NextResponse.json({ error: "Failed to Unfollow" }, { status: 500 });
  }
}
