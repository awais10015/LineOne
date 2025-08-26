import { connect } from "@/lib/db";
import { Post } from "@/models/postModel";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await connect();

    const { id } = params; // ✅ no await
    const { currentLoggedInUser, toDo } = await req.json();

    const post = await Post.findById(id).populate("postBy");
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // prepare event data
    const eventData = {
      eventBy: currentLoggedInUser,
      eventFor: post?.postBy?._id,
      event: toDo, // ✅ dynamic
    };

    if (toDo === "like") {
      if (post.likedBy.includes(currentLoggedInUser)) {
        post.likedBy.pull(currentLoggedInUser);
      } else {
        post.likedBy.push(currentLoggedInUser);
        post.dislikedBy.pull(currentLoggedInUser);

        // ✅ don’t let notification failure break like/dislike
        try {
          await fetch(`${process.env.APP_URL}/api/notification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData),
          });
        } catch (err) {
          console.error("Notification failed:", err.message);
        }
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

    await post.save();

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("LikeDislike API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
