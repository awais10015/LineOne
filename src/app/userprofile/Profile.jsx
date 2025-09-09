"use client";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrentUserContext from "@/context/CurrentUserContext";
import { useRouter } from "nextjs-toploader/app";
import { useContext, useEffect } from "react";

import FollowUnfollowButton from "@/components/profile/FollowUnfollowButton";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CreatePost from "@/components/profile/CreatePost";
import EditProfile from "@/components/profile/EditProfile";
import Post from "@/components/profile/Post";

const Profile = () => {
  const router = useRouter();
  const { currentLoggedInUser, setCurrentLoggedInUser } =
    useContext(CurrentUserContext);
  let userProfilePic =
    currentLoggedInUser?.profilePic ||
    (currentLoggedInUser?.gender === "male" ? "/Mdp.jpg" : "/Fdp.jpg");
  let userCoverPic = currentLoggedInUser?.coverPic || "/cover.jpg";

  const getUser = async () => {
    try {
      const res = await fetch("/api/currentUser");
      const data = await res.json();
      setCurrentLoggedInUser(data.user);
    } catch (err) {
      console.error("Failed to fetch user in context:", err);
    }
  };

  useEffect(() => {
    if (!currentLoggedInUser?.username) {
      router.push("/");
      return;
    }
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex flex-col w-full items-center ">
      <div className="min-h-screen max-w-4xl min-w-full flex flex-col items-center">
        <div className="w-full max-w-4xl  rounded-2xl shadow-lg overflow-hidden srollbar-hide">
          <div
            style={{ backgroundImage: `url(${userCoverPic})` }}
            className="w-full h-48 relative"
          >
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center text-xl font-bold">
                <img
                  className="w-32 h-32 rounded-full border-2 border-white bg-gray-300 object-cover object-top"
                  src={userProfilePic}
                  alt="dp"
                />
              </div>
            </div>
          </div>

          <div className="mt-20  pb-6 text-center">
            <h1 className="text-2xl font-bold ">{currentLoggedInUser?.name}</h1>
            <p className="">{currentLoggedInUser?.username}</p>
            <p className="mt-3">{currentLoggedInUser?.bio || "no bio added"}</p>

            <div className="mt-6 w-full h-12 flex justify-center items-center gap-5">
              <div>
                <p className="font-bold ">
                  {currentLoggedInUser?.posts?.length}
                </p>
                <p className="text-sm px-3"> Posts</p>
              </div>
              <Separator orientation="vertical" />

              <Dialog>
                <DialogTrigger asChild>
                  <div className=" h-12 flex justify-center items-center gap-5">
                    <div>
                      <p className="font-bold cursor-pointer">
                        {currentLoggedInUser?.followers?.length}
                      </p>
                      <p className=" text-sm">Followers</p>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <p className="font-bold cursor-pointer">
                        {currentLoggedInUser?.following?.length}
                      </p>
                      <p className=" text-sm">Following</p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle></DialogTitle>
                  </DialogHeader>
                  <Tabs
                    defaultValue="followers"
                    className="w-full flex items-center justify-center flex-col"
                  >
                    <TabsList>
                      <TabsTrigger value="followers">Followers</TabsTrigger>
                      <TabsTrigger value="following">Following</TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="followers"
                      className="w-full max-h-[350px] mt-1 space-y-3 overflow-scroll scrollbar-hide"
                    >
                      {currentLoggedInUser?.followers?.map((follower) => (
                        <div
                          key={follower._id}
                          className="flex items-center justify-between p-2 rounded-lg hover:text-black hover:bg-gray-100"
                        >
                          <Link href={`/userprofile/${follower._id}`}>
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  follower?.profilePic || "/default-avatar.png"
                                }
                                alt={follower?.name}
                                className="w-10 h-10 rounded-full object-cover object-top"
                              />

                              <div>
                                <p className="font-medium">{follower?.name}</p>
                                <p className="text-sm text-gray-500">
                                  {follower?.username}
                                </p>
                              </div>
                            </div>
                          </Link>

                          <FollowUnfollowButton
                            currentLoggedInUser={currentLoggedInUser}
                            id={follower?._id}
                            refresh={getUser}
                          />
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent
                      value="following"
                      className="w-full max-h-[350px] mt-1 space-y-3 overflow-scroll scrollbar-hide"
                    >
                      {currentLoggedInUser?.following?.map((following) => (
                        <div
                          key={following._id}
                          className="flex items-center justify-between p-2 rounded-lg hover:text-black hover:bg-gray-100"
                        >
                          <Link href={`/userprofile/${following._id}`}>
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  following?.profilePic || "/default-avatar.png"
                                }
                                alt={following?.name}
                                className="w-10 h-10 rounded-full object-cover object-top"
                              />
                              <div>
                                <p className="font-medium">{following?.name}</p>
                                <p className="text-sm text-gray-500">
                                  {following?.username}
                                </p>
                              </div>
                            </div>
                          </Link>

                          <FollowUnfollowButton
                            currentLoggedInUser={currentLoggedInUser}
                            id={following?._id}
                            refresh={getUser}
                          />
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>

                  <DialogFooter></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-5 flex gap-5 w-full justify-center items-center">
              <EditProfile />
              <CreatePost />
            </div>
          </div>
        </div>

        <Post />
      </div>
    </div>
  );
};

export default Profile;
