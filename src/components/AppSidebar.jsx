"use client";
import React, { useContext, useState, useEffect } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  ChatLink,
  NotificationLink,
  useSidebarExpanded,
} from "@/components/ui/sidebar";
import { IconHome, IconSearch, IconUsers, IconBookmark } from "@tabler/icons-react";

import SignOutButton from "./client/SignOutButton";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ModeToggle } from "./ModeToggle";
import CurrentUserContext from "@/context/CurrentUserContext";
import Link from "next/link";
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
    {
      label: "Saved",
      href: "/saved",
      icon: (
        <IconBookmark className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);

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
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-8">
            <div className="flex w-full flex-1 flex-col overflow-x-hidden overflow-y-auto scrollbar-hide">
              <SidebarBrand />
              <div className="mt-8 flex w-full flex-col gap-1">
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

            <div className="flex w-full flex-col gap-1">
              <ModeToggle />

              <SignOutButton />

              <SidebarLink
                link={{
                  label: name,
                  href: "/userprofile",
                  icon: (
                    <img
                      src={profilePic}
                      className="h-6 w-6 shrink-0 rounded-full object-cover object-top"
                      width={24}
                      height={24}
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
function SidebarBrand() {
  const expanded = useSidebarExpanded();
  return (
    <Link
      href="/home"
      className={cn(
        "relative z-20 flex min-h-[44px] shrink-0 items-center py-1 text-sm font-normal text-black",
        expanded
          ? "w-full gap-2"
          : "mx-auto h-11 w-11 justify-center rounded-xl"
      )}
    >
      <Image
        src="/logo.svg"
        width={30}
        height={30}
        alt="logo"
        className="shrink-0"
      />
      {expanded ? (
        <span className="font-medium whitespace-pre text-black dark:text-white">
          LINEONE
        </span>
      ) : null}
    </Link>
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
