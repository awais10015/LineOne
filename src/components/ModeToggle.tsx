"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  getSidebarLinkClasses,
  sidebarIconWrapClass,
  SidebarNavLabel,
  useSidebarExpanded,
} from "./ui/sidebar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function sidebarLabelClass() {
  return "flex min-w-0 items-center self-center text-sm font-normal leading-none text-neutral-700 dark:text-neutral-200 whitespace-nowrap";
}

export function ModeToggle() {
  const { setTheme } = useTheme();
  const expanded = useSidebarExpanded();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            getSidebarLinkClasses(false, expanded),
            "cursor-pointer border-0 bg-transparent text-left"
          )}
        >
          <div className={cn(sidebarIconWrapClass, "relative")}>
            <Sun className="h-[1.15rem] w-[1.15rem] rotate-0 scale-100 text-neutral-700 transition-all dark:scale-0 dark:-rotate-90 dark:text-neutral-200" />
            <Moon className="absolute h-[1.15rem] w-[1.15rem] rotate-90 scale-0 text-neutral-700 transition-all dark:rotate-0 dark:scale-100 dark:text-neutral-200" />
            <span className="sr-only">Toggle theme</span>
          </div>
          <SidebarNavLabel className={sidebarLabelClass()}>Mode</SidebarNavLabel>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
