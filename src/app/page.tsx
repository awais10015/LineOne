import React from "react";
import { auth } from "@/auth";
import SignOutButton from "@/components/client/SignOutButton";
const page = async () => {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="w-full h-screen flex justify-center items-center">
      {user ? (
        <>
          <div className="flex flex-col gap-5">
            <p>Hello! {user?.name}</p>
            <SignOutButton />
          </div>
        </>
      ) : (
        <p>no user</p>
      )}
    </div>
  );
};

export default page;
