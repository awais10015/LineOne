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
      className="cursor-pointer w-8 h-8 gap-0 p-0 m-0 rounded-full flex items-center justify-center"
      variant="ghost"
      onClick={() => {
        sessionStorage.removeItem("reloaded");
        signOut({ callbackUrl: "/" });
      }}
    >
      <div className="w-7 h-7 flex items-center justify-center hover:scale-105 bg-[#ff6500] rounded-full">
        <Power />
      </div>
    </Button>
  );
};

export default SignOutButton;
