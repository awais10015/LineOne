import { connect } from "@/lib/db";
import { Post } from "@/models/postModel";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await connect();
    const { id } = params;
    const { currentLoggedInUser, toDo } = await req.json();

    const post = await Post.findById(id).populate("postBy");
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const eventData = {
      eventBy: currentLoggedInUser,
      eventFor: post?.postBy?._id,
      event: toDo,
    };

    if (toDo === "like") {
      if (post.likedBy.includes(currentLoggedInUser)) {
        post.likedBy.pull(currentLoggedInUser);
      } else {
        post.likedBy.push(currentLoggedInUser);
        post.dislikedBy.pull(currentLoggedInUser);

        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notification`, {
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

    await post.save();
    return NextResponse.json({ success: true, post });
  } catch (err) {
    console.error("LikeDislike Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
