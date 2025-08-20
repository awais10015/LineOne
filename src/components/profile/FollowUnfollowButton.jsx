"use client";

import { useOptimistic, startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

const FollowUnfollowButton = ({ id, currentLoggedInUser, refresh }) => {
  const [initiallyFollowing, setinitiallyFollowing] = useState(
    currentLoggedInUser.following.some((user) => user._id === id)
  );
  let initialVal = initiallyFollowing;

  // Optimistic state ONLY tracks following
  const [isFollowing, setIsFollowing] = useOptimistic(
    initiallyFollowing,
    (_, newState) => newState
  );

  const toggleFollow = async () => {
    const newIsFollowing = !isFollowing;

    // optimistic update
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

      // re-sync with backend
      refresh?.();
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);

      // rollback UI
      startTransition(() => {
        setIsFollowing(!newIsFollowing);
        setinitiallyFollowing(!initiallyFollowing);
      });

      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <Button
      onClick={toggleFollow}
      className={
        isFollowing
          ? "cursor-pointer text-white bg-gray-600 hover:bg-gray-400"
          : "bg-[#ff6500] hover:bg-[#ff5f00] cursor-pointer"
      }
    >
      {isFollowing ? "Unfollow" : "Follow Me"}
    </Button>
  );
};

export default FollowUnfollowButton;
