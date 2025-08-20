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
// import FollowButton from "@/components/profile/FollowButton";
// import UnfollowButton from "@/components/profile/UnfollowButton";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentLoggedInUser, setCurrentLoggedInUser } =
    useContext(CurrentUserContext);
  const { AnotherUser, setAnotherUser } = useContext(AnotherUserContext);
  const router = useRouter();
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchValue, setsearchValue] = useState(null);
  let timeout;
  function handleSearch(searchValue) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const searchData = users?.filter((user) =>
        user?.name?.toLowerCase().includes(searchValue?.toLowerCase())
      );
      setSearchedUser(searchData);
    }, 700);
  }

  useEffect(() => {
    handleSearch(searchValue);
  }, [users, searchValue]);

  const getUsers = async () => {
    try {
      const currentUserRes = await fetch("/api/currentUser");
      const currentUserData = await currentUserRes.json();
      setCurrentLoggedInUser(currentUserData.user);

      const usersRes = await fetch("/api/users");
      const usersData = await usersRes.json();
      const filteredUsers = usersData?.users?.filter(
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

  const setTheContext = (user) => {
    setAnotherUser(user);
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="w-full flex items-center justify-center">
        <div className="max-w-4xl  p-6 flex items-center justify-center flex-col bg-white dark:bg-neutral-900">
          <Dialog >
            <form className="w-full px-0 sm:px-30 md:px-40">
              <DialogTrigger asChild className="w-full">
                <Input
                  className="w-full block"
                  type="email"
                  placeholder="Search Users"
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Search User</DialogTitle>
                  <DialogDescription>{""}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Input
                      id="search"
                      name="search"
                      defaultValue=""
                      onChange={(e) => setsearchValue(e.target.value)}
                    />
                  </div>
                  {searchedUser && searchedUser.length > 0 ? (
                    <div>
                      {searchedUser?.map((userFound) => (
                        <div
                          key={userFound._id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
                        >
                          <Link href={`/userprofile/${userFound._id}`}>
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  userFound?.profilePic || "/default-avatar.png"
                                }
                                alt={userFound?.name}
                                className="w-10 h-10 rounded-full object-cover object-top"
                              />
                              <div>
                                <p className="font-medium">{userFound?.name}</p>
                                <p className="text-sm text-gray-500">
                                  {userFound?.username}
                                </p>
                              </div>
                            </div>
                          </Link>

                          {userFound?.followers?.includes(
                            currentLoggedInUser?._id
                          ) ? (
                            <UnfollowButton
                              id={userFound._id}
                              currentLoggedInUser={currentLoggedInUser._id}
                              refresh={getUsers}
                            />
                          ) : (
                            <FollowButton
                              id={userFound._id}
                              currentLoggedInUser={currentLoggedInUser._id}
                              refresh={getUsers}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>No user found</div>
                  )}
                  <div className="grid gap-3"></div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>

          <ul className="space-y-4 flex flex-wrap mt-5 justify-center">
            {users?.map((user) => (
              <li key={user._id} className="p-4 ">
                <div className=" rounded-3xl flex flex-col items-center overflow-hidden srollbar-hide shadow-2xl ">
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
                      variant={"ghost"}
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
