import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth, signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";
import { toast } from "sonner";
import LoginForm from "@/components/client/form";
import { redirect } from "next/navigation";
import GoogleSignInButton from "@/components/client/GoogleSignInButton";

const Page = async () => {
  const session = await auth();
  if (session?.user) redirect("/");
  return (
    <div className="flex justify-center items-center h-dvh">
      <Card>
        <CardHeader>
          <CardTitle>Login to LineOne</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <span>Or</span>
          <GoogleSignInButton />

          <Link href="/signup">Don't have an Account? Signup</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
