import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(req) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    await connect();
    await User.findByIdAndUpdate(authResult.user._id, {
      $addToSet: { blockedUsers: userId },
      $pull: { following: userId, followers: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Block user:", error);
    return NextResponse.json({ error: "Failed to block user" }, { status: 500 });
  }
}
