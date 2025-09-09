"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import { motion } from "motion/react";
import { useSidebar } from "../ui/sidebar";
const SignOutButton = () => {
  const { open, animate } = useSidebar();
  return (
    <Button
      className="cursor-pointer w-full h-7 gap-0 p-0 m-0 rounded-full flex items-center justify-center"
      variant="ghost"
      onClick={() => {
        sessionStorage.removeItem("reloaded");
        signOut({ callbackUrl: "/login" });
      }}
    >
      <div className="w-7 h-7 flex items-center justify-center hover:scale-105 bg-[#ff6500] rounded-full">
        <Power />
      </div>

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="ml-3 text-gray-900 dark:text-neutral-200 text-sm font-light group-hover/sidebar:translate-x-1 transition duration-150"
      >
        Logout
      </motion.span>
    </Button>
  );
};

export default SignOutButton;
