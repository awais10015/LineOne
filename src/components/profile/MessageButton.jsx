"use client";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import CurrentUserContext from "@/context/CurrentUserContext";
import { useRouter } from "next/navigation";

const MessageButton = ({ id }) => {
  const {currentLoggedInUser} =useContext(CurrentUserContext)
  const userIds = [currentLoggedInUser._id , id]
  const router = useRouter()

  const createChat = async () => {
    console.log("userIds" , userIds)
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userIds: userIds,
      }),
    });

    const data = await res.json();
    console.log("Chat:", data);
    router.push(`/chat/${data._id}`)
  } catch (err) {
    console.error("Error creating chat:", err);
  }
};

  return (
    <>
      <Button
        onClick={createChat}
        variant={"ghost"}
        className="px-4 py-2 cursor-pointer hover:scale-105 bg-gray-300 dark:bg-accent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        Message
      </Button>
    </>
  );
};

export default MessageButton;
