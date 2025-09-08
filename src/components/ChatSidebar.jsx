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
// import Image from "next/image";

import CurrentUserContext from "@/context/CurrentUserContext";



export function ChatSidebar({ children }) {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [chats, setchats] = useState([]);
  const [groupChats, setgroupChats] = useState([]);
  const [loader, setloader] = useState(false);

  const fetchChatsBasic = async () => {
  setloader(true);
  try {
    const res = await fetch(`/api/chat/basic/${currentLoggedInUser?._id}`);
    const data = await res.json();

    // Sort all chats by lastMessage timestamp (descending)
    const sortedChats = data.sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return bTime - aTime; // newest first
    });

    const filterBasicChats = sortedChats.filter((chat) => chat.isGroup === false);
    const filterGroupChats = sortedChats.filter((chat) => chat.isGroup === true);

    setchats([...filterBasicChats]);
    setgroupChats([...filterGroupChats]);
    setloader(false);
  } catch (error) {
    console.log(error);
    setloader(false);
  }
};

  useEffect(() => {
    if (!currentLoggedInUser) return;
    fetchChatsBasic();
  }, []);

  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-background border-r">
      <div
        className={cn(
          " flex flex-1 flex-col overflow-scroll scrollbar-hide rounded-tl-md rounded-tr-2xl md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
          // for your use case, use `h-screen` instead of `h-[60vh]`
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
             
              <div className="flex flex-col gap-2 items-start">
                <div>
                  <SidebarLink
                  className="pl-2"
                    link={{
                      label: "Chats",
                      href: "#",
                      icon: <FaUser size={27} className="text-black dark:text-white" />,
                    }}
                  />
                </div>

                {chats.map((chat) => {
                  const otherUser = chat.participants.find(
                    (p) => p._id !== currentLoggedInUser._id
                  );

                  return (
                    <ProfilesLink
                      key={chat._id}
                      id={chat._id}
                      name={otherUser?.name}
                      lastMessage={chat?.lastMessage?.text}
                      profilePic={otherUser?.profilePic}
                    />
                  );
                })}

                <div>
                  <SidebarLink
                  className="pl-1"
                    link={{
                      label: "Groups",
                      href: "#",
                      icon: <FaUsers size={35} className="text-black dark:text-white" />,
                    }}
                  />
                </div>

                {groupChats.map((chat) => (
                  <ProfilesLink
                    key={chat._id}
                    id={chat._id}
                    name={chat.name}
                    lastMessage={chat?.lastMessage?.text}
                    profilePic={chat.groupIcon || "/default-group.png"}
                  />
                ))}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
        <Dashboard open={open}>{children}</Dashboard>
      </div>
    </div>
  );
}
// export const Logo = () => {
//   return (
//     <Link
//       href="/chat"
//       className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
//     >
//       {/* <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" /> */}
//       <Image src="/chat.png" width={30} height={30} alt="logo" />
//       <motion.span
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="font-medium whitespace-pre text-black dark:text-white"
//       >
//         Chat
//       </motion.span>
//     </Link>
//   );
// };
// export const LogoIcon = () => {
//   return (
//     <Link
//       href="/chat"
//       className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
//     >
//       {/* <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" /> */}
//       <Image src="/chat.png" width={30} height={30} alt="logo" />
//     </Link>
//   );
// };

// Dummy dashboard component with content
const Dashboard = ({ children }) => {
  return (
    <div className="flex-1 min-w-0 top-0">
      <div className="h-full w-full flex flex-col shadow-xl gap-2 rounded-tl-2xl rounded-tr-2xl bg-white dark:border-neutral-700 dark:bg-neutral-900 overflow-auto scrollbar-hide">
        <div className="flex flex-1 gap-2 flex-wrap">{children}</div>
      </div>
    </div>
  );
};
