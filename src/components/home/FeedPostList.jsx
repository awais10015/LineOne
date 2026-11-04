"use client";

import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import PostCard from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";

export default function FeedPostList({
  posts,
  loading,
  hasMore,
  cursor,
  onLoadMore,
  emptyState,
  loadMoreClassName = "my-4",
  showAuthorFollow = false,
  onFollowChange,
}) {
  if (loading && posts.length === 0) {
    return (
      <div className="w-full p-10">
        <Loader height="full" />
      </div>
    );
  }

  if (posts.length === 0) {
    return emptyState ?? null;
  }

  return (
    <div className="w-full px-2 flex flex-col items-center gap-2 max-w-4xl rounded-2xl overflow-hidden srollbar-hide">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          showAuthorFollow={showAuthorFollow}
          onFollowChange={onFollowChange}
        />
      ))}
      {hasMore && (
        <Button
          variant="outline"
          className={loadMoreClassName}
          disabled={loading}
          onClick={() => onLoadMore(cursor, true)}
        >
          {loading ? "Loading…" : "Load more"}
        </Button>
      )}
      {!hasMore && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="my-8 inline-flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-300"
        >
          <span>That&apos;s all for now!</span>
        </motion.div>
      )}
    </div>
  );
}
