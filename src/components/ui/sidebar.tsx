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
  showLabels: boolean;
  setShowLabels: React.Dispatch<React.SetStateAction<boolean>>;
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

function isNavLinkActive(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(`${href}/`)) return true;
  return false;
}

export function getSidebarLinkClasses(isActive: boolean, expanded: boolean) {
  return cn(
    "group/sidebar relative flex items-center transition-all duration-200 outline-none",
    expanded
      ? cn(
          "min-h-[44px] w-full gap-3 rounded-xl border-l-2 py-2 pl-2.5 pr-3",
          isActive
            ? "border-l-[#ff6500] bg-neutral-100 dark:bg-neutral-800/95"
            : "border-l-transparent hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60"
        )
      : cn(
          "mx-auto h-11 w-11 shrink-0 justify-center rounded-xl",
          isActive
            ? "bg-neutral-100 dark:bg-neutral-800/95"
            : "hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60"
        )
  );
}

export function useSidebarExpanded() {
  const { animate, open, showLabels } = useSidebar();
  return !animate || (open && showLabels);
}

export const sidebarIconWrapClass =
  "flex h-6 w-6 shrink-0 items-center justify-center [&_svg]:h-6 [&_svg]:w-6";

function sidebarLabelClass(isActive: boolean) {
  return cn(
    "flex min-w-0 items-center self-center text-sm leading-none whitespace-nowrap",
    isActive
      ? "font-semibold text-[#ff6500]"
      : "font-normal text-neutral-700 dark:text-neutral-200"
  );
}

export function SidebarNavLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { animate, open, showLabels } = useSidebar();
  if (!animate) {
    return <span className={className}>{children}</span>;
  }
  if (!open || !showLabels) {
    return null;
  }
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12 }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

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
  const [showLabels, setShowLabels] = useState(!animate);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, animate, showLabels, setShowLabels }}
    >
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
  const { open, setOpen, animate, setShowLabels, showLabels } = useSidebar();
  const iconOnlyLayout = animate && (!open || !showLabels);

  const handleMouseEnter = () => {
    if (animate) {
      setShowLabels(false);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setShowLabels(false);
    setOpen(false);
  };

  return (
    <>
      <motion.div
        className={cn(
          "hidden h-full shrink-0 flex-col overflow-hidden py-4 md:flex",
          animate && iconOnlyLayout ? "items-center px-2" : "items-stretch px-3",
          className
        )}
        animate={{
          width: animate ? (open ? "220px" : "72px") : "220px",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onAnimationComplete={() => {
          if (open && animate) {
            setShowLabels(true);
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
            className={cn(
              "relative flex size-11 shrink-0 items-center justify-center rounded-xl transition-all",
              isNavLinkActive(pathname, "/chat")
                ? "bg-neutral-100 dark:bg-neutral-800/95"
                : "hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60"
            )}
            aria-current={
              isNavLinkActive(pathname, "/chat") ? "page" : undefined
            }
          >
            {/* Icon wrapper */}
            <div className="relative">
              <IconBrandLine
                className={cn(
                  "h-8 w-8 shrink-0",
                  isNavLinkActive(pathname, "/chat")
                    ? "text-[#ff6500]"
                    : "text-neutral-700 dark:text-neutral-200"
                )}
              />

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
          <Link
            href={"/userprofile"}
            className={cn(
              "rounded-full ring-2 ring-transparent transition-colors",
              isNavLinkActive(pathname, "/userprofile") &&
                "ring-[#ff6500]/60"
            )}
            aria-current={
              isNavLinkActive(pathname, "/userprofile") ? "page" : undefined
            }
          >
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
  const expanded = useSidebarExpanded();
  const pathname = usePathname();
  const isActive = isNavLinkActive(pathname, link.href);

  return (
    <Link
      href={link.href}
      className={cn(
        getSidebarLinkClasses(isActive, expanded),
        isActive && "[&_svg]:!text-[#ff6500]",
        !isActive && "[&_svg]:text-neutral-700 dark:[&_svg]:text-neutral-200",
        className
      )}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      <div className={sidebarIconWrapClass}>{link.icon}</div>

      <SidebarNavLabel className={sidebarLabelClass(isActive)}>
        {link.label}
      </SidebarNavLabel>
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
  const expanded = useSidebarExpanded();
  const pathname = usePathname();
  const isActive = isNavLinkActive(pathname, href);

  return (
    <Link
      href={href}
      className={cn(getSidebarLinkClasses(isActive, expanded), className)}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {/* Icon wrapper */}
      <div className={cn(sidebarIconWrapClass, "relative")}>
        <IconBrandLine
          className={cn(
            "h-6 w-6 shrink-0",
            isActive
              ? "text-[#ff6500]"
              : "text-neutral-700 dark:text-neutral-200"
          )}
        />

        {/* Badge */}
        {count && Number(count) > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white shadow-md">
            {count}
          </span>
        ) : (
          ""
        )}
      </div>

      <SidebarNavLabel className={sidebarLabelClass(isActive)}>
        {label}
      </SidebarNavLabel>
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
  const expanded = useSidebarExpanded();
  const pathname = usePathname();
  const isActive = isNavLinkActive(pathname, href);

  return (
    <Link
      href={href}
      className={cn(getSidebarLinkClasses(isActive, expanded), className)}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {/* Icon wrapper */}
      <div className={cn(sidebarIconWrapClass, "relative")}>
        <IconBellRinging
          className={cn(
            "h-6 w-6 shrink-0",
            isActive
              ? "text-[#ff6500]"
              : "text-neutral-700 dark:text-neutral-200"
          )}
        />

        {/* Badge with count */}
        {count && Number(count) > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white shadow-md">
            {count}
          </span>
        ) : (
          ""
        )}
      </div>

      <SidebarNavLabel className={sidebarLabelClass(isActive)}>
        {label}
      </SidebarNavLabel>
    </Link>
  );
};
