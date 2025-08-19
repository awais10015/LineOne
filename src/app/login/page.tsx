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
import Image from "next/image";

const Page = async () => {
  const session = await auth();
  if (session?.user) redirect("/");
  return (
    <div className="flex justify-center items-center h-dvh">
      <Card>
        <CardHeader className="flex flex-col items-center justify-center gap-3">
          <Image src="/logo.svg" alt="LineOne" width={50} height={50}/>
          <CardTitle className="text-2xl font-light">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <span className="text-sm text-gray-500">Or</span>
          <GoogleSignInButton />
          <Link
            href="/signup"
            className="text-sm text-[#ff6500] hover:underline text-center"
          >
            Don&apos;t have an Account? Signup
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
