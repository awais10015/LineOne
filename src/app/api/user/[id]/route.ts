import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isFollowing } from "@/lib/requireAuth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    await connect();
    const { id } = await params;
    const viewer = authResult.user;

    const user = await User.findById(id)
      .select("-password -email")
      .populate("followers", "name username profilePic")
      .populate("following", "name username profilePic");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isSelf = String(user._id) === String(viewer._id);
    const viewerFollows = isFollowing(viewer, id);

    if (user.privateAccount && !isSelf && !viewerFollows) {
      return NextResponse.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        profilePic: user.profilePic,
        gender: user.gender,
        privateAccount: true,
        isLimitedProfile: true,
      });
    }

    const fullUser = await User.findById(id)
      .select("-password -email")
      .populate("posts")
      .populate("followers", "name username profilePic")
      .populate("following", "name username profilePic");

    return NextResponse.json(fullUser);
  } catch {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
