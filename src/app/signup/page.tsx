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
import { User } from "@/models/userModel";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { connect } from "@/lib/db";
import { toast } from "sonner"
import GoogleSignInButton from "@/components/client/GoogleSignInButton";

const Page = () => {
  const signUp = async (formData: FormData) => {
    "use server";
    const name = formData.get("name") as string | undefined;
    const email = formData.get("email") as string | undefined;
    const password = formData.get("password") as string | undefined;

    if (!name || !email || !password)
      throw new Error("Please provide all Fields");

    //DB se connect krna ha
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
        <CardHeader>
          <CardTitle> Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signUp} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Enter Your Name"
              id="name"
              name="name"
            />
            <Input
              type="email"
              placeholder="Enter Your Email"
              id="email"
              name="email"
            />
            <Input
              type="password"
              placeholder="Enter Your Password"
              name="password"
              id="password"
            />
            <Button type="submit">Sign up</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <span>Or</span>
          
            <GoogleSignInButton />
          

          <Link href="/login">Already have an Account? Login</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
