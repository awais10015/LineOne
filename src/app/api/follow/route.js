import { connect } from "@/lib/db";
// import { Post } from "@/models/postModel";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    await connect();

  
    const followedUser = await User.findByIdAndUpdate(body.follow, 
      {$push: { followers: body.followedBy }},
      {new: true}
    )

    const followingUser = await User.findByIdAndUpdate(body.followedBy,
        {$push: {following: body.follow}},
        {new: true}
    )

     

    return NextResponse.json({followedUser , followingUser}, { status: 201 });
  } catch (error) {
    console.error("Error Following:", error.message);
    return NextResponse.json({ error: "Failed to Follow" }, { status: 500 });
  }
}
