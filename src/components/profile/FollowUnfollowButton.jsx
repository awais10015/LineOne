"use client";

import { useOptimistic, startTransition, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const FollowUnfollowButton = ({
  id,
  currentLoggedInUser,
  refresh,
  followLabel = "Follow Me",
  unfollowLabel = "Unfollow",
  followOnly = false,
  variant = "default",
  size = "default",
  className = "",
}) => {
  const followingFromContext = (currentLoggedInUser?.following ?? []).some(
    (user) => String(user?._id ?? user) === String(id)
  );

  const [initiallyFollowing, setinitiallyFollowing] = useState(
    followingFromContext
  );

  useEffect(() => {
    setinitiallyFollowing(followingFromContext);
  }, [followingFromContext]);

  let initialVal = initiallyFollowing;

  const [isFollowing, setIsFollowing] = useOptimistic(
    initiallyFollowing,
    (_, newState) => newState
  );

  if (followOnly && (isFollowing || followingFromContext)) {
    return null;
  }

  const toggleFollow = async () => {
    const newIsFollowing = !isFollowing;

    startTransition(() => {
      setIsFollowing(newIsFollowing);
      setinitiallyFollowing(!initialVal);
    });

    try {
      if (newIsFollowing) {
        await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            follow: id,
            followedBy: currentLoggedInUser._id,
          }),
        });
        toast.success("Followed User", {
          icon: <CheckCircle className="text-green-500" />,
        });
      } else {
        await fetch("/api/unfollow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unfollow: id,
            unfollowedBy: currentLoggedInUser._id,
          }),
        });
        toast.success("Unfollowed User", {
          icon: <XCircle className="text-red-500" />,
        });
      }

      refresh?.();
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);

      startTransition(() => {
        setIsFollowing(!newIsFollowing);
        setinitiallyFollowing(!initiallyFollowing);
      });

      toast.error("Something went wrong. Try again!");
    }
  };

  if (variant === "outline") {
    return (
      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={toggleFollow}
        className={cn(
          "border-[#ff6500]/40 text-[#ff6500] hover:bg-[#ff6500]/10 hover:text-[#ff6500]",
          isFollowing &&
            "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          className
        )}
      >
        {isFollowing ? unfollowLabel : followLabel}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size={size}
      onClick={toggleFollow}
      className={cn(
        isFollowing
          ? "cursor-pointer text-white bg-gray-600 hover:scale-105 hover:bg-gray-400"
          : "bg-[#ff6500] hover:bg-[#ff5f00] hover:scale-105 cursor-pointer",
        className
      )}
    >
      {isFollowing ? unfollowLabel : followLabel}
    </Button>
  );
};

export default FollowUnfollowButton;
