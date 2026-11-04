import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { Post } from "@/models/postModel";
import "@/models/commentModel";
import { decodeFeedCursor, encodeFeedCursor } from "@/lib/feedCursor";
import mongoose from "mongoose";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function toIdString(value) {
  if (!value) return null;
  return String(value._id ?? value);
}

async function getViewer(email) {
  return User.findOne({ email }).select(
    "following followers privateAccount savedPosts blockedUsers"
  );
}

function buildPostQuery(baseFilter, cursor) {
  const filter = { ...baseFilter };
  const decoded = decodeFeedCursor(cursor);
  if (decoded) {
    const cursorDate = new Date(decoded.createdAt);
    const cursorId = new mongoose.Types.ObjectId(decoded.id);
    filter.$or = [
      { createdAt: { $lt: cursorDate } },
      {
        createdAt: cursorDate,
        _id: { $lt: cursorId },
      },
    ];
  }
  return filter;
}

async function fetchPosts(filter, limit) {
  const posts = await Post.find(filter)
    .populate("postBy", "name username profilePic gender privateAccount")
    .populate("taggedUsers", "name username profilePic")
    .populate("comments")
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasMore = posts.length > limit;
  const slice = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor =
    hasMore && slice.length > 0 ? encodeFeedCursor(slice[slice.length - 1]) : null;

  return { posts: slice, nextCursor, hasMore };
}

export async function GET(req) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "following";
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10) ||
      DEFAULT_LIMIT,
    1),
    MAX_LIMIT
  );
  const cursor = searchParams.get("cursor");

  try {
    await connect();
    const viewer = await getViewer(email);
    if (!viewer) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const viewerId = viewer._id;
    const followingIds = (viewer.following || []).map(toIdString).filter(Boolean);
    const followingSet = new Set(followingIds);
    const blockedSet = new Set(
      (viewer.blockedUsers || []).map(toIdString).filter(Boolean)
    );

    const isBlockedAuthor = (post) => {
      const authorId = post?.postBy?._id ? String(post.postBy._id) : null;
      return authorId && blockedSet.has(authorId);
    };

    if (mode === "suggestedUsers") {
      const blockedObjectIds = [...blockedSet].map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      const excludeIds = [
        new mongoose.Types.ObjectId(String(viewerId)),
        ...followingIds.map((id) => new mongoose.Types.ObjectId(id)),
        ...blockedObjectIds,
      ];
      const candidates = await User.find({
        _id: { $nin: excludeIds },
      })
        .select("name username profilePic gender bio posts")
        .limit(50)
        .lean();

      const sorted = candidates
        .map((u) => ({
          ...u,
          postCount: Array.isArray(u.posts) ? u.posts.length : 0,
        }))
        .sort((a, b) => b.postCount - a.postCount)
        .slice(0, 20);

      return NextResponse.json({ users: sorted });
    }

    if (mode === "discover") {
      const blockedObjectIds = [...blockedSet].map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      const publicAuthors = await User.find({
        privateAccount: { $ne: true },
        _id: { $nin: [viewerId, ...blockedObjectIds] },
      })
        .select("_id")
        .lean();
      const authorIds = publicAuthors.map((u) => u._id);
      const filter = buildPostQuery({ postBy: { $in: authorIds } }, cursor);
      const result = await fetchPosts(filter, limit);
      const posts = result.posts.filter((post) => !isBlockedAuthor(post));
      return NextResponse.json({
        posts,
        nextCursor: result.nextCursor,
        hasMore: result.hasMore,
      });
    }

    if (mode === "following") {
      const authorIdSet = new Set([String(viewerId), ...followingIds]);
      const authorObjectIds = [...authorIdSet].map(
        (id) => new mongoose.Types.ObjectId(id)
      );

      const filter = buildPostQuery({ postBy: { $in: authorObjectIds } }, cursor);
      const result = await fetchPosts(filter, limit);
      const posts = result.posts.filter((post) => {
        if (isBlockedAuthor(post)) return false;
        const author = post.postBy;
        if (!author) return false;
        const authorId = String(author._id);
        if (authorId === String(viewerId)) return true;
        if (!followingSet.has(authorId)) return false;
        if (!author.privateAccount) return true;
        return followingSet.has(authorId);
      });
      return NextResponse.json({
        posts,
        nextCursor: result.nextCursor,
        hasMore: result.hasMore,
      });
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (error) {
    console.error("GET /api/feed:", error);
    return NextResponse.json(
      { error: "Failed to load feed" },
      { status: 500 }
    );
  }
}
