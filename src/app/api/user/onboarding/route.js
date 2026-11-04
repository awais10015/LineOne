import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { User } from "@/models/userModel";

const MIN_FOLLOWS = 5;

export async function GET() {
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;

  const user = await User.findById(authResult.user._id).select(
    "followOnboardingCompleted following"
  );

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    followOnboardingCompleted: !!user.followOnboardingCompleted,
    followingCount: user.following?.length ?? 0,
  });
}

export async function POST() {
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;

  const user = await User.findById(authResult.user._id).select("following");

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const followingCount = user.following?.length ?? 0;

  if (followingCount < MIN_FOLLOWS) {
    return NextResponse.json(
      {
        error: `Follow at least ${MIN_FOLLOWS} people to continue`,
        followingCount,
        required: MIN_FOLLOWS,
      },
      { status: 400 }
    );
  }

  const updated = await User.findByIdAndUpdate(
    authResult.user._id,
    { followOnboardingCompleted: true },
    { new: true }
  ).select("followOnboardingCompleted following");

  return NextResponse.json({
    followOnboardingCompleted: true,
    followingCount: updated?.following?.length ?? followingCount,
  });
}
