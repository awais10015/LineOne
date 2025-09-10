"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Sidebar,
  SidebarBody,
  ProfilesLink,
  SidebarLink,
} from "@/components/ui/sidebar2";

import { FaUser } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

import { cn } from "@/lib/utils";

import CurrentUserContext from "@/context/CurrentUserContext";
import Pusher from "pusher-js";
import NewMessageContext from "@/context/NewMessageContext";

export function ChatSidebar({ children }) {
  const {
    newMessages,
    setNewMessages,
    setnewMessagesCount,
    resetChatMessages,
  } = useContext(NewMessageContext);

  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [chats, setchats] = useState([]);
  const [groupChats, setgroupChats] = useState([]);
  const [loader, setloader] = useState(false);

  useEffect(() => {
    console.log(newMessages);
  }, []);

  const fetchChatsBasic = async () => {
  if (!currentLoggedInUser) return;
  setloader(true);

  try {
    const res = await fetch(`/api/chat/basic/${currentLoggedInUser._id}`);
    const data = await res.json();
    console.log(data);

    let sortedChats = [];

    if (Array.isArray(data)) {
      sortedChats = data.sort((a, b) => {
        const aTime = a.lastMessage
          ? new Date(a.lastMessage.createdAt).getTime()
          : 0;
        const bTime = b.lastMessage
          ? new Date(b.lastMessage.createdAt).getTime()
          : 0;
        return bTime - aTime;
      });
    }

    setchats(sortedChats.filter((c) => !c.isGroup));
    setgroupChats(sortedChats.filter((c) => c.isGroup));
    setloader(false);
  } catch (err) {
    console.error(err);
    setloader(false);
  }
};


  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetchChatsBasic();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe(`user-${currentLoggedInUser._id}`);

    channel.bind("new-message", (data) => {
      const { chatId, message } = data;

      setchats((prev) => {
        const chatIndex = prev.findIndex((c) => c._id === chatId);
        if (chatIndex !== -1) {
          const updatedChat = { ...prev[chatIndex], lastMessage: message };

          const newChats = [
            updatedChat,
            ...prev.filter((c) => c._id !== chatId),
          ];

          updatedChat.newMessageCount = (updatedChat.newMessageCount || 0) + 1;

          return newChats;
        }
        return prev;
      });

      setgroupChats((prev) => {
        const chatIndex = prev.findIndex((c) => c._id === chatId);
        if (chatIndex !== -1) {
          const updatedChat = { ...prev[chatIndex], lastMessage: message };
          const newChats = [
            updatedChat,
            ...prev.filter((c) => c._id !== chatId),
          ];
          updatedChat.newMessageCount = (updatedChat.newMessageCount || 0) + 1;
          return newChats;
        }
        return prev;
      });
    });

    return () => {
      pusher.unsubscribe(`user-${currentLoggedInUser._id}`);
    };
  }, [currentLoggedInUser]);

  const renderChatLink = (chat, isGroup = false) => {
    const otherUser = isGroup
      ? null
      : chat.participants.find((p) => p._id !== currentLoggedInUser._id);

    // ✅ Count how many newMessages belong to this chat
    const unreadCount = newMessages.filter(
      (msg) => msg.chatId === chat._id
    ).length;

    return (
      <ProfilesLink
        key={chat._id}
        id={chat._id}
        name={isGroup ? chat.name : otherUser?.name}
        lastMessage={chat?.lastMessage?.text}
        profilePic={
          isGroup
            ? chat.groupIcon || "/default-group.png"
            : otherUser?.profilePic
        }
        // ✅ use unreadCount here
        badge={unreadCount}
        onClick={async () => {
          // clear local badge
          setchats((prev) =>
            prev.map((c) =>
              c._id === chat._id ? { ...c, newMessageCount: 0 } : c
            )
          );
          setgroupChats((prev) =>
            prev.map((c) =>
              c._id === chat._id ? { ...c, newMessageCount: 0 } : c
            )
          );

          // clear from context
          setNewMessages((prev) =>
            prev.filter((msg) => msg.chatId !== chat._id)
          );

          // 🔥 call backend to remove from DB
          try {
            await fetch(
              `/api/users/${currentLoggedInUser._id}/chats/${chat._id}/read`,
              {
                method: "PATCH",
              }
            );
          } catch (err) {
            console.error("Failed to clear messages", err);
          }

          // optional: reset on server if you already have resetChatMessages
          resetChatMessages(chat._id);
        }}
      />
    );
  };

  return (
    <div className="h-screen w-screen bg-background border-r">
      <div
        className={cn(
          "flex flex-1 flex-col overflow-scroll scrollbar-hide md:flex-row",
          "h-screen"
        )}
      >
        <Sidebar
          open={open}
          setOpen={setOpen}
          className={cn(open ? "w-64" : "w-20", "transition-all duration-300")}
        >
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto scrollbar-hide">
              <SidebarLink
                className="pl-2"
                link={{
                  label: "Chats",
                  href: "#",
                  icon: (
                    <FaUser size={27} className="text-black dark:text-white" />
                  ),
                }}
              />
              {chats.map((chat) => renderChatLink(chat))}

              <SidebarLink
                className="pl-1"
                link={{
                  label: "Groups",
                  href: "#",
                  icon: (
                    <FaUsers size={35} className="text-black dark:text-white" />
                  ),
                }}
              />
              {groupChats.map((chat) => renderChatLink(chat, true))}
            </div>
          </SidebarBody>
        </Sidebar>
        <Dashboard open={open}>{children}</Dashboard>
      </div>
    </div>
  );
}

const Dashboard = ({ children }) => {
  return (
    <div className="flex-1 min-w-0 top-0">
      <div className="h-full w-full flex flex-col shadow-xl gap-2 rounded-tl-2xl rounded-tr-2xl bg-white dark:border-neutral-700 dark:bg-neutral-900 overflow-auto scrollbar-hide">
        <div className="flex flex-1 gap-2 flex-wrap">{children}</div>
      </div>
    </div>
  );
};
