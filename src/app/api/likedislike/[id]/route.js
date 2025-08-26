import { connect } from "@/lib/db";
import { Post } from "@/models/postModel";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await connect();

    const { id } = await params;
    const { currentLoggedInUser, toDo } = await req.json();

    const post = await Post.findById(id).populate("postBy");
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }
    const eventData = {
      eventBy: currentLoggedInUser,
      eventFor: post.postBy._id,
      event: "like",
    };
    if (toDo === "like") {
      if (post.likedBy.includes(currentLoggedInUser)) {
        post.likedBy.pull(currentLoggedInUser);
      } else {
        post.likedBy.push(currentLoggedInUser);
        post.dislikedBy.pull(currentLoggedInUser);

        await fetch("http://localhost:3000/api/notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
      }
    }

    if (toDo === "dislike") {
      if (post.dislikedBy.includes(currentLoggedInUser)) {
        post.dislikedBy.pull(currentLoggedInUser);
      } else {
        post.dislikedBy.push(currentLoggedInUser);
        post.likedBy.pull(currentLoggedInUser);
      }
    }

    // 3. Save changes
    await post.save();

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
