"use client";

import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import CurrentUserContext from "@/context/CurrentUserContext";
import { Input } from "@/components/ui/input";
import { Send, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Chat = () => {
  const { id } = useParams();
  const router = useRouter();
  const [chat, setChat] = useState(null);
  const [loader, setLoader] = useState(false);
  const [sendLoader, setSendLoader] = useState(false);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [replyOf, setReplyOf] = useState(null);
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const messagesEndRef = useRef(null);
  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll when chat loads or new messages arrive
  useEffect(() => {
    if (!chat) return;
    if (chat?.messages?.length) {
      scrollToBottom();
    }
  }, [chat?.messages]);

  // Also scroll after sending a message
  useEffect(() => {
    if (!sendLoader) {
      scrollToBottom();
    }
  }, [sendLoader]);
  const getChat = async () => {
    setLoader(true);
    try {
      const res = await fetch(`/api/chat/${id}`);
      const data = await res.json();
      setChat(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getChat();
  }, []);

  const leaveGroup = async () => {
    setLoader(true);
    try {
      const res = await fetch(`/api/chat/${id}/remove-member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberIds: currentLoggedInUser._id }),
      });

      if (res.ok) {
        setLoader(false);
        console.log(currentLoggedInUser._id, "left group");
        router.push("/chat");
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  // const adminRemoveMembers = async () => {
  //   setLoader(true);
  //   try {
  //     const res = await fetch(`/api/chat/${id}/remove-member`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ memberIds: ["id1", "id2", "id3"] }),
  //     });

  //     if (res.ok) {
  //       setLoader(false);
  //       console.log(currentLoggedInUser._id, "left group");
  //       router.push("/chat");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setLoader(false);
  //   }
  // };

  // const adminAddMembers = async () => {
  //   try {
  //     const res = await fetch(`/api/chat/${id}/add-member`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ memberIds: ["id4", "id5"] }),
  //     });

  //     if (res.ok) {
  //       console.log(currentLoggedInUser._id, "left group");
  //       router.push("/chat");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const userJoinsGroup = async () => {
  //   try {
  //     const res = await fetch(`/api/chat/${id}/add-member`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ memberIds: "id6" }),
  //     });

  //     if (res.ok) {
  //       console.log(currentLoggedInUser._id, "left group");
  //       router.push("/chat");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text) return;
    setSendLoader(true);
    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: id, // chat _id
          senderId: currentLoggedInUser._id, // current user _id
          sentTo: chat.participants, // array of user ids
          text: text,
          media: media, // or a URL / file reference
          replyOf: replyOf, // or messageId you're replying to
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      console.log("Message sent:", data);
      setText("");
      setSendLoader(false);
    } catch (err) {
      console.error(err);
      setSendLoader(false);
    }
  };

  useEffect(() => {
    console.log(chat);
    console.log("Group ha k nhi ", chat?.isGroup);
  }, [chat]);

  if (loader) return <Loader />;

  if (!chat) return null;

  //  other user if it's a one-to-one chat
  const otherUser =
    !chat?.isGroup &&
    chat?.participants?.find((p) => p._id !== currentLoggedInUser._id);

  return (
    <>
      {chat?.isGroup ? (
        <div className="w-full flex items-start justify-center">
          <div
            className="bg-white dark:bg-black rounded-2xl w-full max-w-4xl z-1000 absolute md:relative 
                  top-0 left-0 flex flex-col h-[100dvh] md:h-screen overflow-hidden scrollbar-hide"
          >
            {/* Header - 10% */}
            <div className="basis-[10%] md:basis-[5%] flex justify-start items-center gap-2 rounded-t-2xl p-2">
              <Link href={"/chat"}>
                <Button className="cursor-pointer bg-transparent hover:bg-transparent shadow-none border-none hover:scale-115 transition duration-150">
                  <FaArrowLeft />
                </Button>
              </Link>
              <div className="w-full flex justify-between items-center gap-5">
                <Dialog>
                  <DialogTrigger className="w-full">
                    <div className="flex items-center gap-2 cursor-pointer hover:scale-102 transition duration-80">
                      <div className="relative h-[45px] w-[45px] rounded-full overflow-hidden">
                        <Image
                          src={chat?.groupIcon}
                          alt="Group Icon"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-start ">
                        <h1 className="text-md text-start font-semibold text-gray-900 dark:text-gray-100">
                          {chat?.name}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {chat?.participants?.length} members
                        </p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="z-1000">
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="w-5">
                      <BsThreeDotsVertical
                        size={20}
                        className="cursor-pointer hover:scale-110 transition duration-150"
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="z-1000">
                    <DropdownMenuItem
                      onClick={leaveGroup}
                      className="cursor-pointer text-black dark:text-white"
                    >
                      {" "}
                      <LogOut
                        size={40}
                        className="text-black dark:text-white"
                      />{" "}
                      Leave
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {/* Chat Area - 80% */}
            <div className="basis-[80%] md:basis-[90%] overflow-y-auto scrollbar-hide py-2 px-2">
              <div className="flex flex-col gap-1">
                {chat?.messages?.map((msg, index) => {
                  const isOwnMessage =
                    msg.sentBy._id === currentLoggedInUser._id;
                  const prevMsg = chat?.messages[index - 1];
                  const isSameSender =
                    prevMsg && prevMsg.sentBy._id === msg.sentBy._id;

                  return (
                    <div
                      key={msg._id}
                      className={`flex items-start ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Left side: profile pic or spacer */}
                      {!isOwnMessage && (
                        <div className="w-8 mr-2 flex-shrink-0">
                          {!isSameSender ? (
                            <Link href={`/userprofile/${msg.sentBy?._id}`}>
                              <img
                                src={msg.sentBy?.profilePic || "/default.png"}
                                alt="dp"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            </Link>
                          ) : (
                            // spacer (same width as profile pic)
                            <div className="w-8 h-8" />
                          )}
                        </div>
                      )}

                      {/* Right side: message bubble */}
                      <div className="flex flex-col max-w-[70%]">
                        {/* Show name only if not same sender */}
                        {/* Show sender name only if first message in a group */}
                        {!isOwnMessage
                          ? !isSameSender && (
                              <span className="text-xs font-medium text-gray-500 mb-1">
                                {msg.sentBy?.name}
                              </span>
                            )
                          : !isSameSender && (
                              <span className="text-xs text-end font-medium text-gray-500 mb-1">
                                You
                              </span>
                            )}

                        <div
                          className={`px-4 py-2 rounded-2xl text-sm ${
                            isOwnMessage
                              ? "bg-[#ff6500] text-white rounded-tr-none self-end"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input - 10% */}
            <div className="basis-[10%] md:basis-[5%]">
              <div className="w-full px-2 py-2 bg-white dark:bg-black h-full flex items-end">
                <form
                  onSubmit={sendMessage}
                  className="flex gap-2 items-end w-full"
                >
                  <div className="flex-1 flex flex-col">
                    <Input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type your Message..."
                      className="flex-1 min-w-[150px] rounded-full bg-white dark:bg-gray-800 px-4 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 hover:scale-101 transition duration-150"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-full bg-[#ff6500] flex hover:scale-105 transition duration-150"
                  >
                    {sendLoader ? (
                      <Loader size={5} color="#FFFFFF" />
                    ) : (
                      <Send className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        otherUser && (
          <div className="w-full flex items-start justify-center">
            <div
              className="bg-white dark:bg-black rounded-2xl w-full max-w-4xl z-1000 absolute md:relative 
                  top-0 left-0 flex flex-col h-[100dvh] md:h-screen overflow-hidden scrollbar-hide"
            >
              {/* Header - 10% */}
              <div className="basis-[10%] md:basis-[5%] flex justify-start items-start gap-2 rounded-t-2xl p-2">
                <Link href={"/chat"}>
                  <Button className="cursor-pointer bg-transparent hover:bg-transparent shadow-none border-none hover:scale-115 transition duration-150">
                    <FaArrowLeft />
                  </Button>
                </Link>

                <Link href={`/userprofile/${otherUser?._id}`}>
                  <div className="flex items-center gap-2 hover:scale-102 transition duration-150 cursor-pointer">
                    <div className="relative h-[45px] w-[45px] rounded-full overflow-hidden">
                      <Image
                        src={otherUser?.profilePic}
                        alt="DP"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h1 className="text-md font-semibold text-gray-900 dark:text-gray-100">
                        {otherUser?.name}
                      </h1>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Chat Area - 80% */}
              <div className="basis-[80%] md:basis-[90%] overflow-y-auto scrollbar-hide py-2 px-2">
                {chat?.messages?.map((msg) => {
                  const isOwnMessage =
                    msg.sentBy._id === currentLoggedInUser._id;

                  return (
                    <div
                      key={msg._id}
                      className={`flex mb-1 ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                          isOwnMessage
                            ? "bg-[#ff6500] text-white rounded-tr-none"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input - 10% */}
              <div className="basis-[10%] md:basis-[5%]">
                <div className="w-full px-2 py-2 bg-white dark:bg-black h-full flex items-end">
                  <form
                    onSubmit={sendMessage}
                    className="flex gap-2 items-end w-full"
                  >
                    <div className="flex-1 flex flex-col">
                      <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your Message..."
                        className="flex-1 min-w-[150px] rounded-full bg-white dark:bg-gray-800 px-4 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 hover:scale-101 transition duration-150"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="icon"
                      className="rounded-full bg-[#ff6500] flex hover:scale-105 transition duration-150"
                    >
                      {sendLoader ? (
                        <Loader size={5} color="#FFFFFF" />
                      ) : (
                        <Send className="h-4 w-4 text-white" />
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Chat;
