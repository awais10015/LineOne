"use client";
import React from "react";
import { Button } from "../ui/button";

const MessageButton = ({ id }) => {
  return (
    <>
      <Button
        variant={"ghost"}
        className="px-4 py-2 cursor-pointer hover:scale-105"
      >
        Message
      </Button>
    </>
  );
};

export default MessageButton;
