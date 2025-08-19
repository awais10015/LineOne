"use client";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

const GoogleSignInButton = () => {
  return (
    <Button
      variant="outline"
      onClick={() => {
        signIn("google", {
          callbackUrl: "/", // or your dashboard like "/home"
        });
      }}
    >
      <FcGoogle />
      Continue with Google
    </Button>
  );
};

export default GoogleSignInButton;
