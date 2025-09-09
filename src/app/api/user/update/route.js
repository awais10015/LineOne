import { NextResponse } from "next/server";
import { connect } from "@/lib/db"; 
import { User } from "@/models/userModel"; 
import { auth } from "@/auth";

export async function PUT(req) {
  try {
    const session = await auth(); 
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connect();

    const { name, username, bio, profilePic, coverPic } = await req.json();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { name, username, bio, profilePic, coverPic },
      { new: true }
    );

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
