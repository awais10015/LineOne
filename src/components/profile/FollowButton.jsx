"use client";
import React from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

const FollowButton = ({ id, currentLoggedInUser, refresh }) => {
  const follow = async () => {
    console.log("followed");
    const followData = {
      follow: id,
      followedBy: currentLoggedInUser,
    };
    await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(followData),
    });

    toast.success("Followed User", {
      icon: <CheckCircle className="text-green-500" />,
    });
    refresh();
  };

  return (
    <>
      <Button
        onClick={follow}
        className="bg-[#ff6500] hover:bg-[#ff5f00] cursor-pointer"
      >
        Follow Me
      </Button>
    </>
  );
};

export default FollowButton;
