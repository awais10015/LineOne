import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connect();

    const session = await auth();
    const currentUserEmail = session?.user?.email;
    if (!currentUserEmail)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { username, dateOfBirth, gender, planePassword } = await req.json();

    
    if (planePassword) {
      const hashedPassword = await hash(planePassword, 10);
      const updatedUser = await User.findOneAndUpdate(
        { email: currentUserEmail },
        {
          username,
          dateOfBirth,
          gender,
          password: hashedPassword,
        },
        { new: true }
      );
      return NextResponse.json({ user: updatedUser });
    } else {
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
    }

    
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
