"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import PostCard from "@/components/post/PostCard";

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
  infiniteScroll = true,
}) {
  const sentinelRef = useRef(null);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    if (!infiniteScroll || !hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          !entry?.isIntersecting ||
          loading ||
          loadingMoreRef.current ||
          !hasMore
        ) {
          return;
        }
        loadingMoreRef.current = true;
        Promise.resolve(onLoadMore(cursor, true)).finally(() => {
          loadingMoreRef.current = false;
        });
      },
      { root: null, rootMargin: "120px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [infiniteScroll, hasMore, loading, cursor, onLoadMore]);

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
    <div className="w-full px-2 flex flex-col items-center gap-3 max-w-4xl rounded-2xl overflow-hidden srollbar-hide">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          showAuthorFollow={showAuthorFollow}
          onFollowChange={onFollowChange}
        />
      ))}

      {infiniteScroll && hasMore && (
        <div
          ref={sentinelRef}
          className={`w-full flex justify-center py-4 ${loadMoreClassName}`}
          aria-hidden
        >
          {loading && (
            <div className="py-2">
              <Loader height="auto" size={10} />
            </div>
          )}
        </div>
      )}

      {!infiniteScroll && hasMore && (
        <button
          type="button"
          className={loadMoreClassName}
          disabled={loading}
          onClick={() => onLoadMore(cursor, true)}
        >
          {loading ? "Loading…" : "Load more"}
        </button>
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
