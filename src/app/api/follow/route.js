import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createNotification } from "@/lib/notifications";

export async function POST(req) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const body = await req.json();
    const viewerId = String(authResult.user._id);

    if (String(body.followedBy) !== viewerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connect();

    const eventData = {
      eventBy: body.followedBy,
      eventFor: body.follow,
      event: "follow",
    };

    const followedUser = await User.findByIdAndUpdate(
      body.follow,
      { $push: { followers: body.followedBy } },
      { new: true }
    );

    await createNotification(eventData);

    const followingUser = await User.findByIdAndUpdate(
      body.followedBy,
      { $push: { following: body.follow } },
      { new: true }
    );

    return NextResponse.json({ followedUser, followingUser }, { status: 201 });
  } catch (error) {
    console.error("Error Following:", error.message);
    return NextResponse.json({ error: "Failed to Follow" }, { status: 500 });
  }
}
