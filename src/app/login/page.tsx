import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { auth } from "@/auth";
import LoginForm from "@/components/client/Form";
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

          <Link href="/signup">Don&apos;t have an Account? Signup</Link>

        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
