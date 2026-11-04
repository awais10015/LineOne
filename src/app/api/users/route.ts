import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { requireAuth } from "@/lib/requireAuth";

export const GET = async () => {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    await connect();

    const users = await User.find()
      .select("name username profilePic gender bio posts privateAccount")
      .lean();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
};
