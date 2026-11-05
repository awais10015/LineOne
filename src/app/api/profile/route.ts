import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { hash } from "bcryptjs";
import { normalizeUsername } from "@/lib/formatUsername";

export async function POST(req: Request) {
  try {
    await connect();

    const session = await auth();
    const currentUserEmail = session?.user?.email;
    if (!currentUserEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, dateOfBirth, gender, planePassword } = await req.json();
    const normalizedUsername = normalizeUsername(username);

    const update: Record<string, unknown> = {
      username: normalizedUsername,
    };

    if (dateOfBirth) {
      update.dateOfBirth = dateOfBirth;
    }
    if (gender) {
      update.gender = gender;
    }
    if (planePassword) {
      update.password = await hash(planePassword, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: currentUserEmail },
      update,
      { new: true }
    );

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
