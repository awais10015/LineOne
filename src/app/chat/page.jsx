"use client";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrentUserContext from "@/context/CurrentUserContext";
import NewMessageContext from "@/context/NewMessageContext"; // ✅
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { FaUsersViewfinder } from "react-icons/fa6";
import { MdOutlineAddComment } from "react-icons/md";
import { RiUserSearchFill } from "react-icons/ri";

const page = () => {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const { newMessages, setNewMessages, resetChatMessages } =
    useContext(NewMessageContext); // ✅
  const [chats, setchats] = useState([]);
  const [groupChats, setgroupChats] = useState([]);
  const [loader, setloader] = useState(false);
  const router = useRouter();

  const fetchChatsBasic = async () => {
    setloader(true);
    try {
      const res = await fetch(`/api/chat/basic/${currentLoggedInUser?._id}`);
      const data = await res.json();
      const filterBasicChats = data.filter((chat) => chat.isGroup === false);
      const filterGroupChats = data.filter((chat) => chat.isGroup === true);
      setchats([...filterBasicChats]);
      setgroupChats([...filterGroupChats]);
    } catch (error) {
      console.log(error);
    } finally {
      setloader(false);
    }
  };

  useEffect(() => {
    if (!currentLoggedInUser) return;
    fetchChatsBasic();
  }, [currentLoggedInUser]);

  // ✅ reusable click handler
  const handleChatClick = async (chatId) => {
    // reset local state badge
    setchats((prev) =>
      prev.map((c) => (c._id === chatId ? { ...c, newMessageCount: 0 } : c))
    );
    setgroupChats((prev) =>
      prev.map((c) => (c._id === chatId ? { ...c, newMessageCount: 0 } : c))
    );

    // remove messages from context
    setNewMessages((prev) => prev.filter((msg) => msg.chatId !== chatId));

    // backend mark-as-read
    try {
      await fetch(
        `/api/users/${currentLoggedInUser._id}/chats/${chatId}/read`,
        { method: "PATCH" }
      );
      resetChatMessages(chatId);
    } catch (err) {
      console.error("Failed to mark chat as read:", err);
    }

    // navigate to chat
    router.push(`/chat/${chatId}`);
  };

  const renderChatItem = (chat, isGroup = false) => {
    const otherUser = isGroup
      ? null
      : chat.participants.find((p) => p._id !== currentLoggedInUser._id);

    // ✅ count unread from context
    const unreadCount = newMessages.filter(
      (msg) => msg.chatId === chat._id
    ).length;

    return (
      <div
        key={chat._id}
        onClick={() => handleChatClick(chat._id)}
        className="cursor-pointer w-full flex items-center justify-between gap-3 p-2 pl-4 border-b hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
      >
        <div className="flex items-start">
          <div className="w-13 h-13 rounded-full overflow-hidden">
            <Image
              src={
                isGroup
                  ? chat?.groupIcon || "/default.png"
                  : otherUser?.profilePic || "/default.png"
              }
              alt="dp"
              width={55}
              height={55}
              className="object-cover object-center h-full w-full"
            />
          </div>

          <div className="pl-2 flex flex-col justify-start items-start">
            <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
              {isGroup ? chat.name : otherUser?.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[220px]">
              {chat?.lastMessage?.text
                ? chat.lastMessage.text
                : "No Message Yet"}
            </p>
          </div>
        </div>

        {/* ✅ Badge */}
        {unreadCount > 0 && (
          <span className="bg-red-500 z-10 text-white text-xs font-bold rounded-full h-5 min-w-5 flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Floating menu */}
      <div className="absolute bottom-3 right-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="cursor-pointer flex items-center justify-center rounded-full w-12 h-12 bg-[#ff6500] hover:scale-105">
              <MdOutlineAddComment size={28} className="text-white" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="h-full w-full bg-transparent border-none shadow-none ">
            <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
              <Button
                onClick={() => router.push("/searchUser")}
                className="cursor-pointer w-full gap-2 flex items-start justify-start bg-transparent hover:bg-transparent text-[#ff6500] rounded-full p-3"
              >
                <RiUserSearchFill size={38} />
                <span className="text-black dark:text-white">Search User</span>
              </Button>
              <Button
                onClick={() => router.push("/groups")}
                className="cursor-pointer w-full gap-2 flex items-start justify-start bg-transparent hover:bg-transparent text-[#ff6500] rounded-full p-3"
              >
                <FaUsersViewfinder size={38} />
                <span className="text-black dark:text-white">Join Groups</span>
              </Button>
              <Button
                onClick={() => router.push("/creategroup")}
                className="cursor-pointer w-full gap-2 flex items-start justify-start  bg-transparent hover:bg-transparent text-[#ff6500] rounded-full p-3"
              >
                <FaUsers size={38} />
                <span className="text-black dark:text-white">Create Group</span>
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop placeholder */}
      <div className="hidden md:flex md:flex-col w-full h-screen items-center justify-center gap-10">
        <Image src={"/chatPage2.svg"} alt="chat" width={400} height={400} />
        <h1 className="text-lg font-bold text-gray-500">
          Select/Start a Chat or Group
        </h1>
      </div>

      {/* Mobile chat tabs */}
      <div className="w-full flex flex-col md:hidden items-center justify-between mt-2">
        {loader ? (
          <Loader />
        ) : (
          <Tabs
            defaultValue="chats"
            className="w-full flex flex-col items-center justify-center"
          >
            <TabsList>
              <TabsTrigger value="chats">Chats</TabsTrigger>
              <TabsTrigger value="groupchats">Groups</TabsTrigger>
            </TabsList>

            <TabsContent
              value="chats"
              className="w-full flex flex-col justify-start items-start"
            >
              {chats.length > 0 ? (
                chats.map((chat) => renderChatItem(chat, false))
              ) : (
                <div className="w-full flex flex-col h-[600px] items-center justify-center gap-10">
                  <Image
                    src={"/searchUser.svg"}
                    alt="chat"
                    width={150}
                    height={150}
                  />
                  <h1 className="mt-3 text-gray-400 font-medium">
                    Start chat with Someone
                  </h1>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="groupchats"
              className="w-full flex flex-col justify-start items-start"
            >
              {groupChats.length > 0 ? (
                groupChats.map((chat) => renderChatItem(chat, true))
              ) : (
                <div className="w-full flex flex-col h-[600px] items-center justify-center gap-10">
                  <Image
                    src={"/createGroup.svg"}
                    alt="chat"
                    width={150}
                    height={150}
                  />
                  <h1 className="mt-3 text-gray-400 font-medium">
                    Create/Join a Group
                  </h1>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default page;
