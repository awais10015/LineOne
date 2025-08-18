import { NextResponse } from "next/server";
import { auth } from "@/auth"; // your custom auth logic
import { connect } from "@/lib/db"; // your DB connection logic
import {User} from "@/models/userModel"; // your Mongoose User model

export async function POST(req: Request) {
  try {
    await connect();

    const session = await auth();
    const currentUserEmail = session?.user?.email;
    if (!currentUserEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { username, dateOfBirth, gender } = await req.json();

    const updatedUser = await User.findOneAndUpdate(
      { email: currentUserEmail },
      {
        username,
        dateOfBirth,
        gender,
      },
      { new: true }
    );

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
