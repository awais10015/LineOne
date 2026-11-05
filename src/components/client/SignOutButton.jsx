"use client";
import { signOut } from "next-auth/react";
import { Power } from "lucide-react";
import {
  getSidebarLinkClasses,
  sidebarIconWrapClass,
  SidebarNavLabel,
  useSidebarExpanded,
} from "../ui/sidebar";
import { cn } from "@/lib/utils";

const SignOutButton = () => {
  const expanded = useSidebarExpanded();

  return (
    <button
      type="button"
      className={cn(
        getSidebarLinkClasses(false, expanded),
        "group/logout cursor-pointer border-0 bg-transparent text-left hover:[&_svg]:text-red-500"
      )}
      onClick={() => {
        sessionStorage.removeItem("reloaded");
        signOut({ callbackUrl: "/" });
      }}
    >
      <div className={sidebarIconWrapClass}>
        <Power className="h-6 w-6 text-neutral-700 transition-colors dark:text-neutral-200" />
      </div>

      <SidebarNavLabel className="flex min-w-0 items-center self-center text-sm font-normal leading-none whitespace-nowrap text-neutral-700 dark:text-neutral-200">
        Logout
      </SidebarNavLabel>
    </button>
  );
};

export default SignOutButton;
