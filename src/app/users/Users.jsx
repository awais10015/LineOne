// components/UserList.tsx
"use client";

import { useContext, useEffect, useState } from "react";
import React from "react";
import Loader from "@/components/Loader";
import AnotherUserContext from "@/context/AnotherUserContext";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import FollowButton from "@/components/profile/FollowButton";
import UnfollowButton from "@/components/profile/UnfollowButton";
import CurrentUserContext from "@/context/CurrentUserContext";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentLoggedInUser, setCurrentLoggedInUser } =
    useContext(CurrentUserContext);
  const { AnotherUser, setAnotherUser } = useContext(AnotherUserContext);
  const router = useRouter();

  const getUsers = async () => {
  try {
    
    const currentUserRes = await fetch("/api/currentUser");
    const currentUserData = await currentUserRes.json();
    setCurrentLoggedInUser(currentUserData.user);

    
    const usersRes = await fetch("/api/users");
    const usersData = await usersRes.json();
    const filteredUsers = usersData.users.filter(
      (user) => user._id !== currentUserData.user?._id
    );

    setUsers(filteredUsers);
  } catch (err) {
    console.error("Failed to fetch users:", err);
  } finally {
    setLoading(false);
  }
};

 
  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    console.log(AnotherUser);
  }, [AnotherUser]);

  const setTheContext = (user) => {
    setAnotherUser(user);
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="w-full flex items-center justify-center">
        <div className="max-w-4xl mt-10 p-6 flex items-center justify-center flex-col bg-white dark:bg-neutral-900">
          <h1 className="text-3xl font-bold mb-6 text-center text-neutral-800 dark:text-white">
            All Users
          </h1>

          <ul className="space-y-4 flex flex-wrap justify-center">
            {users.map((user) => (
              <li key={user._id} className="p-4 ">
                <div className=" rounded-3xl flex flex-col items-center overflow-hidden srollbar-hide shadow-lg ">
                  {/* Cover Photo */}

                  <img
                    src={user?.coverPic}
                    alt="cover pic"
                    className="w-full h-32 bg-[#ff6500] flex justify-center items-center text-white font-bold rounded-t-3xl "
                  />

                  {/* Profile Picture */}
                  <div className="relative w-full">
                    <div className="w-24 h-24 absolute -top-12 left-1/2 -translate-x-1/2">
                      <img
                        src={
                          user.profilePic ||
                          (user?.gender === "male" ? "/Mdp.jpg" : "/Fdp.jpg")
                        }
                        alt="Profile Pic"
                        className="w-full h-full rounded-full flex items-center justify-center font-bold object-cover object-top"
                      />
                    </div>
                  </div>

                  {/* name and username */}
                  <div className="mt-14 flex flex-col justify-center items-center">
                    <p className="text-lg font-medium text-neutral-800 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {user.username}
                    </p>

                    {/* Bio */}
                    <div className=" px-4 text-center text-gray-600">
                      {user.bio}
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="mt-4 mb-4 flex gap-3 p-5">
                    {user?.followers?.includes(currentLoggedInUser?._id) ? (
                      <UnfollowButton
                        id={user._id}
                        currentLoggedInUser={currentLoggedInUser._id}
                        refresh={getUsers}
                      />
                    ) : (
                      <FollowButton
                        id={user._id}
                        currentLoggedInUser={currentLoggedInUser._id}
                        refresh={getUsers}
                      />
                    )}
                    <Button
                      className="px-4 py-2 cursor-pointer hover:scale-105"
                      onClick={() => {
                        setTheContext(user);
                        router.push(`/userprofile/${user._id}`);
                      }}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
