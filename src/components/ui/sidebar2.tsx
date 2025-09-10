"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { createContext, useContext, useState } from "react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden md:flex md:flex-col w-[250px]",
          className
        )}
        animate={{
          width: animate ? (open ? "250px" : "77px") : "250px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(true)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0">{link.icon}</div>
      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          x: animate ? (open ? 0 : -10) : 0,
          width: open ? "auto" : "0px",
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden text-black dark:text-white text-sm font-bold group-hover/sidebar:translate-x-1 transition duration-150 whitespace-nowrap inline-block"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

export const ProfilesLink = ({
  id,
  name,
  lastMessage,
  profilePic,
  badge, // 👈 add badge prop
  className,
  ...props
}: {
  id: string;
  name: string;
  lastMessage: string;
  profilePic: string;
  badge?: number; // 👈 optional
  className?: string;
}) => {
  const { open, animate } = useSidebar();

  return (
    <Link
      href={`/chat/${id}`}
      className={cn(
        "hover:bg-[#ff6500]/50 rounded-2xl w-full py-1 pl-1 pr-5 flex items-center justify-start gap-2 group/sidebar",
        className
      )}
      {...props}
    >
      <div className="relative h-10 w-10 rounded-full flex-shrink-0">
        <Image
          src={profilePic}
          alt={`${name}'s profile picture`}
          width={40}
          height={40}
          className="h-full w-full rounded-full object-cover"
        />
        {badge && badge > 0 ? (
          <span className="absolute -top-1 -right-1 bg-red-500 z-10 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {badge > 99 ? "99+" : badge}
          </span>
        ):("")}
      </div>

      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          x: animate ? (open ? 0 : -10) : 0,
          width: open ? "auto" : "0px",
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden text-neutral-700 dark:text-neutral-200 text-sm whitespace-nowrap inline-block group-hover/sidebar:translate-x-1 transition duration-150"
      >
        <div className="pl-2 flex flex-col justify-center">
          <h1 className="text-md font-light text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
            {name}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[220px]">
            {lastMessage ? lastMessage : "No Message Yet"}
          </p>
        </div>
      </motion.span>
    </Link>
  );
};

export const GroupLink = ({
  id,
  name,
  lastMessage,
  groupIcon,
  className,
  ...props
}: {
  id: string;
  name: string;
  lastMessage: string;
  groupIcon: string;
  className?: string;
}) => {
  const { open, animate } = useSidebar();

  return (
    <Link
      href={`/chat/${id}`}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
      {...props}
    >
      <div className="h-10 w-10 rounded-full flex-shrink-0 overflow-hidden">
        <Image
          src={groupIcon}
          alt={`${name}'s group icon`}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>

      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          x: animate ? (open ? 0 : -10) : 0,
          width: open ? "auto" : "0px",
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden text-neutral-700 dark:text-neutral-200 text-sm whitespace-nowrap inline-block group-hover/sidebar:translate-x-1 transition duration-150"
      >
        <div className="pl-2 flex flex-col justify-center">
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
            {name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[220px]">
            {lastMessage}
          </p>
        </div>
      </motion.span>
    </Link>
  );
};
