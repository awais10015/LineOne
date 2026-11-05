"use client";

import React, { useContext } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { credentialsLogin } from "@/actions/login";
import { useRouter } from "nextjs-toploader/app";
import { useTopLoader } from "nextjs-toploader";
import { Mail } from "lucide-react";
import PasswordInput from "@/components/client/PasswordInput";
import { parseJsonResponse } from "@/lib/parseJsonResponse";
import CurrentUserContext from "@/context/CurrentUserContext";

const LoginForm = () => {
  const router = useRouter();
  const topLoader = useTopLoader();
  const { setCurrentLoggedInUser } = useContext(CurrentUserContext);

  return (
    <form
      action={async (formData) => {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        if (!email || !password) {
          toast.error("Please provide all fields.");
          return;
        }

        topLoader.start();
        const toastId = toast.loading("Logging in…");
        const error = await credentialsLogin(email, password);
        if (error) {
          toast.error(String(error), { id: toastId });
          topLoader.done();
          return;
        }

        toast.success("Login successful!", { id: toastId });
        const userRes = await fetch("/api/currentUser");
        const userData = await parseJsonResponse(userRes, { user: null });
        if (userData.user) setCurrentLoggedInUser(userData.user);
        const path = userData.user?.username ? "/home" : "/";
        router.push(path);
        router.refresh();
      }}
      className="flex flex-col gap-4"
    >
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="email"
          placeholder="Enter your email"
          id="email"
          name="email"
          className="pl-10"
          autoComplete="email"
        />
      </div>
      <PasswordInput />
      <Button
        type="submit"
        className="w-full bg-[#ff6500] hover:bg-[#ff5f00] text-white"
      >
        Log in
      </Button>
    </form>
  );
};

export default LoginForm;
