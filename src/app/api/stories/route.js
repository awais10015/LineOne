import { connect } from "@/lib/db";
import Story from "@/models/storyModel";
import { User } from "@/models/userModel";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    await connect();
    const { userId, mediaUrl, type, description } = await req.json();

    const story = await Story.create({
      user: userId,
      mediaUrl,
      description,
      type,
    });

    console.log("Incoming userId:", userId);

    await User.findByIdAndUpdate(userId, {
      $push: { stories: story._id },
    });

    const user = await User.findById(userId).populate("stories");
    console.log("User with stories:", user);

    return NextResponse.json({ success: true, story }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error.message);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "UserId required" }, { status: 400 });
    }

    const user = await User.findById(userId).populate("following");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const followingIds = user.following.map((f) => f._id);

    const stories = await Story.find({
      user: { $in: followingIds },
    }).populate("user");

    return NextResponse.json({ stories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching stories:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
