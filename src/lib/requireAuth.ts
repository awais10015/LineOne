import { auth } from "@/auth";
import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import type { Document } from "mongoose";

type ViewerDoc = Document & {
  following?: Array<{ _id?: unknown } | unknown>;
};

export async function requireAuth() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  await connect();
  const user = await User.findOne({ email }).select("-password");
  if (!user) {
    return {
      error: NextResponse.json({ error: "User not found" }, { status: 404 }),
    };
  }

  return { session, user, email };
}

export function isFollowing(viewer: ViewerDoc, targetUserId: string) {
  const id = String(targetUserId);
  return (viewer.following || []).some(
    (entry) => String((entry as { _id?: unknown })?._id ?? entry) === id
  );
}
