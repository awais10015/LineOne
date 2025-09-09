import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "@/models/userModel";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { connect } from "@/lib/db";
import GoogleSignInButton from "@/components/client/GoogleSignInButton";
import { Mail, User as UserIcon } from "lucide-react";
import PasswordInput from "@/components/client/PasswordInput";

export const metadata = {
  title: "LineOne-Signup",
  description: "Signup",
};

const Page = () => {
  const signUp = async (formData: FormData) => {
    "use server";
    const name = formData.get("name") as string | undefined;
    const email = formData.get("email") as string | undefined;
    const password = formData.get("password") as string | undefined;

    if (!name || !email || !password)
      throw new Error("Please provide all Fields");

    await connect();

    const user = await User.findOne({ email });
    if (user) throw new Error("User already exists");

    const hashedPassword = await hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });
    redirect("/login");
  };
  return (
    <div className="flex justify-center items-center h-dvh">
      <Card>
        <CardHeader className="flex flex-col items-center justify-center gap-3">
          <Image src="/logo.svg" alt="LineOne" width={50} height={50} />
          <CardTitle className="text-2xl font-light"> Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signUp} className="flex flex-col gap-4">
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Enter Your Name"
                id="name"
                name="name"
                className="pl-10"
              />
            </div>
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
            <Button
              type="submit"
              className="w-full bg-[#ff6500] hover:bg-[#ff5f00] cursor-pointer"
            >
              Sign up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <span className="text-sm text-gray-500">Or</span>
          <GoogleSignInButton />
          <Link
            href="/login"
            className="text-sm text-[#ff6500] hover:underline text-center"
          >
            Already have an Account? Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
