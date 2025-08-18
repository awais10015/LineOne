"use client";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { credentialsLogin } from "@/actions/login";
import { useRouter } from "nextjs-toploader/app";

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
      <Input
        type="email"
        placeholder="Enter Your Email"
        id="email"
        name="email"
      />
      <Input
        type="password"
        placeholder="Enter Your Password"
        id="password"
        name="password"
      />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;
