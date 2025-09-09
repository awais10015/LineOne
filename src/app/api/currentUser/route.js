import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { Post } from "@/models/postModel"; 
import { Message } from "@/models/messageModel"; 

export async function GET() {
  const session = await auth();
  const currentUser = session?.user;

  await connect();

  try {
    const user = await User.findOne({ email: currentUser?.email })
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "taggedUsers",
          select: "name username profilePic",
        },
      })
      .populate({
        path: "followers",
        select: "name username profilePic followers following posts",
      })
      .populate({
        path: "following",
        select: "name username profilePic followers following posts",
      })
      .populate("newMessages")
      
    return NextResponse.json({ user: user || null });
  } catch (error) {
    console.log(error);
    return;
  }
}
