"use client";
import React, { useContext, useState, useEffect } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  ChatLink,
  NotificationLink,
} from "@/components/ui/sidebar";
import { IconHome, IconSearch, IconUsers } from "@tabler/icons-react";

import SignOutButton from "./client/SignOutButton";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ModeToggle } from "./ModeToggle";
import CurrentUserContext from "@/context/CurrentUserContext";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";
import NotificationContext from "@/context/NotificationContext";
import NewMessageContext from "@/context/NewMessageContext";

export function AppSidebar({ children }) {
  
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  
  const {notificationCount, setnotificationCount} = useContext(NotificationContext)
  const {newMessages, setNewMessages , newMessagesCount, setnewMessagesCount} = useContext(NewMessageContext)

  let name = currentLoggedInUser?.name;
  let profilePic =
    currentLoggedInUser?.profilePic ||
    (currentLoggedInUser?.gender === "male" ? "/Mdp.jpg" : "/Fdp.jpg");
  const links = [
    {
      label: "Home",
      href: "/home",
      icon: (
        <IconHome className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Search",
      href: "/search",
      icon: (
        <IconSearch className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Users",
      href: "/users",
      icon: (
        <IconUsers className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const { animate } = useSidebar();

  const getNotifications = async () => {
    try {
      const res = await fetch(`/api/notification/${currentLoggedInUser?._id}`);
      const data = await res.json();
      setnotificationCount(data?.notifications.length || 0);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  useEffect(() => {
    if (currentLoggedInUser?._id) {
      getNotifications();
    }
  }, [currentLoggedInUser]);

  return (
    <div className="h-screen w-screen bg-background border-r">
      <div
        className={cn(
          " flex flex-1 flex-col overflow-scroll scrollbar-hide rounded-tl-md rounded-tr-2xl md:flex-row dark:border-neutral-700 dark:bg-neutral-800",

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
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
                <ChatLink label={"Chat"} href={"/chat"} count={newMessages?.length} />
                <NotificationLink
                  label={"Notifications"}
                  href={"/notifications"}
                  count={notificationCount}
                />
              </div>
            </div>

            <div className=" flex flex-col items-start justify-center">
              <ModeToggle />

              <div className="mt-2">
                <SignOutButton />
              </div>

              <SidebarLink
                link={{
                  label: name,
                  href: "/userprofile",
                  icon: (
                    <img
                      src={profilePic}
                      className="h-7 w-7 shrink-0 rounded-full object-cover object-top"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
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
      href="/home"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image src="/logo.svg" width={30} height={30} alt="logo" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        LINEONE
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/home"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image src="/logo.svg" width={30} height={30} alt="logo" />
    </Link>
  );
};

const Dashboard = ({ children }) => {
  return (
    <div className="flex-1 min-w-0 top-0">
      <div className="h-full w-full flex flex-col shadow-xl gap-2 rounded-tl-2xl rounded-tr-2xl bg-white dark:border-neutral-700 dark:bg-neutral-900 overflow-auto scrollbar-hide">
        <div className="flex flex-1 gap-2 flex-wrap">{children}</div>
      </div>
    </div>
  );
};
