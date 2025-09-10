"use client";
import CurrentUserContext from "@/context/CurrentUserContext";
import NewMessageContext from "@/context/NewMessageContext";
import NotificationContext from "@/context/NotificationContext";
import { cn } from "@/lib/utils";
import {
  IconBellRinging,
  IconBrandLine,
  IconHome,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ModeToggle } from "../ModeToggle";

import SignOutButton from "@/components/client/SimpleSignOutButton";

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
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
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
          "h-full px-4 py-4 hidden md:flex md:flex-col w-[180px] shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "180px" : "60px") : "180px",
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

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { notificationCount } = useContext(NotificationContext);
  const { newMessages } = useContext(NewMessageContext);
  const { currentLoggedInUser } = useContext(CurrentUserContext);

  const profilePic =
    currentLoggedInUser?.profilePic ||
    (currentLoggedInUser?.gender === "male" ? "/Mdp.jpg" : "/Fdp.jpg");

  const links = [
    {
      label: "Home",
      href: "/home",
      icon: (
        <IconHome className="h-8 w-8 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Search",
      href: "/search",
      icon: (
        <IconSearch className="h-8 w-8 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Users",
      href: "/users",
      icon: (
        <IconUsers className="h-8 w-8 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-6 flex flex-row md:hidden items-center justify-between",
          className
        )}
        {...props}
      >
        <div className="flex justify-between items-center z-20 w-full">
          <div className="flex justify-center items-center gap-2">
            <Image src="/logo.svg" alt="logo" width={30} height={30} />
            <h1 className="font-medium text-lg">LineOne</h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <NotificationLink
              label={"Notifications"}
              href={"/notifications"}
              count={notificationCount}
            />
            <ModeToggle />
            <SignOutButton />
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 z-100 md:hidden w-full px-5">
        <div className="h-15 w-full rounded-2xl border shadow-lg inset-1 bg-white dark:bg-black flex justify-evenly items-center">
          {links.map((link, idx) => (
            <SidebarLink key={idx} link={link} />
          ))}
          <Link
            href={"/chat"}
            
          >
            {/* Icon wrapper */}
            <div className="relative">
              <IconBrandLine className="h-8 w-8 shrink-0 text-neutral-700 dark:text-neutral-200" />

              {/* Badge */}
              {newMessages && Number(newMessages?.length) > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white shadow-md">
                  {newMessages?.length}
                </span>
              ) : (
                ""
              )}
            </div>
          </Link>
          <Link href={"/userprofile"}>
          <Image
            src={profilePic}
            className="h-8 w-8 shrink-0 rounded-full object-cover object-top"
            width={80}
            height={80}
            alt="Avatar"
          />
          </Link>
          
        </div>
      </div>
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
        "flex items-center justify-start gap-2  group/sidebar py-2",
        className
      )}
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

export const ChatLink = ({
  label,
  href,
  count,
  className,
  ...props
}: {
  label: string;
  href: string;
  count?: number;
  className?: string;
}) => {
  const { open, animate } = useSidebar();

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
      {...props}
    >
      {/* Icon wrapper */}
      <div className="relative">
        <IconBrandLine className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />

        {/* Badge */}
        {count && Number(count) > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white shadow-md">
            {count}
          </span>
        ) : (
          ""
        )}
      </div>

      {/* Label */}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {label}
      </motion.span>
    </Link>
  );
};

export const NotificationLink = ({
  label,
  href,
  count,
  className,
  ...props
}: {
  label: string;
  href: string;
  count?: number | string;
  className?: string;
}) => {
  const { open, animate } = useSidebar();

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
      {...props}
    >
      {/* Icon wrapper */}
      <div className="relative">
        <IconBellRinging className="h-6 w-6 shrink-0 text-neutral-700 dark:text-neutral-200" />

        {/* Badge with count */}
        {count && Number(count) > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white shadow-md">
            {count}
          </span>
        ) : (
          ""
        )}
      </div>

      {/* Label */}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {label}
      </motion.span>
    </Link>
  );
};
