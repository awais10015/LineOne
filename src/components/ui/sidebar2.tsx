"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React, {
  useState,
  createContext,
  useContext,
} from "react";
import { motion } from "motion/react";
// import { IconMenu2, IconX } from "@tabler/icons-react";
// import { ModeToggle } from "../ModeToggle";
import Link from "next/link";

// import React, { useRef, useEffect } from "react";
// import { useSidebar } from "./sidebar";
// import { AnimatePresence, motion } from "motion/react";
// import { cn } from "@/lib/utils";
// import { IconMenu2, IconX } from "@tabler/icons-react";
// import { ModeToggle } from "../ModeToggle";
// import Image from "next/image";
// import { usePathname } from "next/navigation";

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
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

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
      {/* <MobileSidebar {...(props as React.ComponentProps<"div">)} /> */}
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
          width: animate ? (open ? "250px" : "73px") : "250px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
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
      {/* Icon always stable */}
      <div className="flex-shrink-0">{link.icon}</div>

      {/* Label with smooth width+opacity */}
      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          x: animate ? (open ? 0 : -10) : 0,
          width: open ? "auto" : "0px",
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-nowrap inline-block"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};


// ✅ User Profile Link
export const ProfilesLink = ({
  id,
  name,
  profilePic,
  className,
  ...props
}: {
  id: string;
  name: string;
  profilePic: string;
  className?: string;
}) => {
  const { open, animate } = useSidebar();

  return (
    <Link
      href={`/chat/${id}`}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar",
        className
      )}
      {...props}
    >
      {/* Profile Pic (never shrink) */}
      <div className="h-10 w-10 rounded-full flex-shrink-0 overflow-hidden">
        {/* <img
          src={profilePic}
          alt={`${name}'s profile picture`}
          className="h-full w-full object-cover"
        /> */}
        <Image
          src={profilePic}
          alt={`${name}'s profile picture`}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Name */}
      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          x: animate ? (open ? 0 : -10) : 0,
          width: open ? "auto" : "0px",
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden text-neutral-700 dark:text-neutral-200 text-sm whitespace-nowrap inline-block group-hover/sidebar:translate-x-1 transition duration-150"
      >
        {name}
      </motion.span>
    </Link>
  );
};

// ✅ Group Link
export const GroupLink = ({
  id,
  name,
  groupIcon,
  className,
  ...props
}: {
  id: string;
  name: string;
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
      {/* Group Icon (never shrink) */}
      <div className="h-10 w-10 rounded-full flex-shrink-0 overflow-hidden">
        <Image
          src={groupIcon}
          alt={`${name}'s group icon`}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Group Name */}
      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
          x: animate ? (open ? 0 : -10) : 0,
          width: open ? "auto" : "0px",
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden text-neutral-700 dark:text-neutral-200 text-sm whitespace-nowrap inline-block group-hover/sidebar:translate-x-1 transition duration-150"
      >
        {name}
      </motion.span>
    </Link>
  );
};
