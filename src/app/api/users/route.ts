// app/api/users/route.ts
import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { User } from "@/models/userModel";

export const GET = async () => {
  try {
    await connect();

    const users = await User.find();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
};
