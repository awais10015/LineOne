"use client";
import React, { useContext, useState } from "react";
import {
  Sidebar,
  SidebarBody,
  ProfilesLink,
  SidebarLink,
} from "@/components/ui/sidebar2";
import {
  IconHome,
  IconSearch,
  IconBrandLine,
  IconBellRinging,
  IconUsers,
} from "@tabler/icons-react";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

import CurrentUserContext from "@/context/CurrentUserContext";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar2";

export function ChatSidebar({ children }) {
  const { currentLoggedInUser } = useContext(CurrentUserContext);

  // const links = [
  //   {
  //     label: "Home",
  //     href: "/home",
  //     icon: (
  //       <IconHome className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
  //     ),
  //   },
  //   {
  //     label: "Search",
  //     href: "/search",
  //     icon: (
  //       <IconSearch className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
  //     ),
  //   },

  // ];
  const [open, setOpen] = useState(false);
  const { animate } = useSidebar();
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
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto srollbar-hide">
              {open ? <Logo /> : <LogoIcon />}
              {/* <div className="mt-8 flex flex-col gap-2">
                {chats.map((chat, index) => (
                  <ProfilesLink
                    key={index}
                    id={chat._id}
                    name={chat.name}
                    profilePic={chat.profilePic}
                  />
                ))}
              </div> */}
            </div>
          </SidebarBody>
        </Sidebar>
        <Dashboard open={open}>{children}</Dashboard>
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/chat"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      {/* <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" /> */}
      <Image src="/chat.png" width={30} height={30} alt="logo" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Chat
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/chat"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      {/* <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" /> */}
      <Image src="/chat.png" width={30} height={30} alt="logo" />
    </Link>
  );
};

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
