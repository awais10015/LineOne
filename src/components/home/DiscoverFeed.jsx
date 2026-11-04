"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import FeedPostList from "@/components/home/FeedPostList";
import { Button } from "@/components/ui/button";
import { formatDisplayUsername } from "@/lib/formatUsername";

export default function DiscoverFeed({
  posts,
  loading,
  hasMore,
  cursor,
  onLoadMore,
  onGoToFollowing,
  suggestedUsers = [],
  onFollowChange,
}) {
  const previewUsers = suggestedUsers.slice(0, 3);

  const emptyState = (
    <div className="rounded-2xl border border-dashed border-border/80 bg-card/30 p-8 text-center w-full">
      <Compass className="h-12 w-12 mx-auto text-[#ff6500]/80 mb-3" />
      <h3 className="text-lg font-semibold">No public posts yet</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
        When people share publicly, their posts show up here. Follow creators or
        check back soon.
      </p>
      <div className="flex flex-wrap gap-2 justify-center mt-5">
        <Button asChild className="bg-[#ff6500] hover:bg-[#ff5f00]">
          <Link href="/users">Find people to follow</Link>
        </Button>
        <Button type="button" variant="outline" onClick={onGoToFollowing}>
          Go to Following
        </Button>
      </div>

      {previewUsers.length > 0 && (
        <div className="mt-8 text-left">
          <p className="text-sm font-medium mb-3">People you might like</p>
          <div className="flex flex-col gap-2">
            {previewUsers.map((user) => (
              <Link
                key={user._id}
                href={`/userprofile/${user._id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <img
                  src={
                    user.profilePic ||
                    (user.gender === "male" ? "/Mdp.jpg" : "/Fdp.jpg")
                  }
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="min-w-0 text-left">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {formatDisplayUsername(user.username)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-4 max-w-4xl">
      <FeedPostList
        posts={posts}
        loading={loading}
        hasMore={hasMore}
        cursor={cursor}
        onLoadMore={onLoadMore}
        emptyState={emptyState}
        loadMoreClassName="my-2 self-center"
        showAuthorFollow
        onFollowChange={onFollowChange}
      />
    </div>
  );
}
