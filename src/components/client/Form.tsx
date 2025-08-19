"use client";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { credentialsLogin } from "@/actions/login";
import { useRouter } from "nextjs-toploader/app";
import { Mail, } from "lucide-react";
import PasswordInput from "@/components/client/PasswordInput";

const LoginForm = () => {
  const router = useRouter();
  return (
    <form
      action={async (formData) => {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        if (!email || !password) {
          toast.error("Please provide all fields.");
          return;
        }

        const toastId = toast.loading("Logging in");
        const error = await credentialsLogin(email, password);
        if (!error) {
          toast.success("Login Successfull!", { id: toastId });
          router.refresh();
        } else {
          toast.error(String(error), { id: toastId });
        }
      }}
      className="flex flex-col gap-4"
    >
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="email"
          placeholder="Enter Your Email"
          id="email"
          name="email"
          className="pl-10"
        />
      </div>
      <PasswordInput />
      <Button type="submit" className="w-full bg-[#ff6500] hover:bg-[#ff5f00]">
        Log In
      </Button>
    </form>
  );
};

export default LoginForm;
