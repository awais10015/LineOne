"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const SignOutButton = () => {
  return (
    <Button
      variant="destructive"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Logout
    </Button>
  );
};

export default SignOutButton;
