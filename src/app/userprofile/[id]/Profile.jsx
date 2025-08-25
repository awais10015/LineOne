"use client";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AnotherUserContext from "@/context/AnotherUserContext";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CurrentUserContext from "@/context/CurrentUserContext";
import MessageButton from "@/components/profile/MessageButton";
import FollowUnfollowButton from "@/components/profile/FollowUnfollowButton";
import LikeDislike from "@/components/post/LikeDislike";
import { IoChatbox } from "react-icons/io5";

const Profile = () => {
  // const params = useParams();
  const { id } = useParams();
  const { AnotherUser, setAnotherUser } = useContext(AnotherUserContext);
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [posts, setPosts] = useState(null);

  let userProfilePic =
    AnotherUser?.profilePic ||
    (AnotherUser?.gender === "male" ? "/Mdp.jpg" : "/Fdp.jpg");
  let userCoverPic = AnotherUser?.coverPic || "/cover.jpg";

  const getUsers = async () => {
    try {
      const res = await fetch(`/api/user/${id}`);
      const data = await res.json();

      setAnotherUser(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (!id) return;
    const getPosts = async () => {
      try {
        const res = await fetch(`/api/posts/user/${id}`);
        const data = await res.json();
        setPosts(data.posts);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    getPosts();
  }, [id]);

  return (
    <>
      {/* original */}

      <div className="flex flex-col w-full items-center ">
        <div className="min-h-screen max-w-4xl min-w-full flex flex-col items-center">
          {/* Profile Header */}
          <div className="w-full max-w-4xl  rounded-2xl shadow-lg overflow-hidden srollbar-hide">
            {/* Cover Photo */}
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

            {/* User Info */}
            <div className="mt-20  pb-6 text-center">
              <h1 className="text-2xl font-bold ">{AnotherUser?.name}</h1>
              <p className="">{AnotherUser?.username}</p>
              <p className="mt-3">{AnotherUser?.bio || "no bio added"}</p>

              {/* Stats */}
              <div className="mt-6 w-full h-12 flex justify-center items-center gap-5">
                <div>
                  <p className="font-bold ">{AnotherUser?.posts?.length}</p>
                  <p className="text-sm px-3"> Posts</p>
                </div>
                <Separator orientation="vertical" />

                {/* FOLLOWERS WALA DIALOG */}

                <Dialog>
                  <DialogTrigger asChild>
                    <div className=" h-12 flex justify-center items-center gap-5">
                      <div>
                        <p className="font-bold cursor-pointer">
                          {AnotherUser?.followers?.length}
                        </p>
                        <p className=" text-sm">Followers</p>
                      </div>
                      <Separator orientation="vertical" />
                      <div>
                        <p className="font-bold cursor-pointer">
                          {AnotherUser?.following?.length}
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

                      {/* Followers List */}
                      <TabsContent
                        value="followers"
                        className="w-full mt-4 space-y-3"
                      >
                        {AnotherUser?.followers?.map((follower) => (
                          <div
                            key={follower._id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
                          >
                            {/* Left: Profile picture */}
                            <Link href={`/userprofile/${follower._id}`}>
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    follower?.profilePic ||
                                    "/default-avatar.png"
                                  }
                                  alt={follower?.name}
                                  className="w-10 h-10 rounded-full object-cover object-top"
                                />
                                {/* Middle: Name + Username */}
                                <div>
                                  <p className="font-medium">
                                    {follower?.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {follower?.username}
                                  </p>
                                </div>
                              </div>
                            </Link>

                            {/* Right: Action Button */}

                            <FollowUnfollowButton
                              currentLoggedInUser={currentLoggedInUser}
                              id={follower?._id}
                              refresh={getUsers}
                            />
                          </div>
                        ))}
                      </TabsContent>

                      {/* Following List */}
                      <TabsContent
                        value="following"
                        className="w-full mt-4 space-y-3"
                      >
                        {AnotherUser?.following?.map((following) => (
                          <div
                            key={following._id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
                          >
                            <Link href={`/userprofile/${following._id}`}>
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    following?.profilePic ||
                                    "/default-avatar.png"
                                  }
                                  alt={following?.name}
                                  className="w-10 h-10 rounded-full object-cover object-top"
                                />
                                <div>
                                  <p className="font-medium">
                                    {following?.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {following?.username}
                                  </p>
                                </div>
                              </div>
                            </Link>

                            <FollowUnfollowButton
                              currentLoggedInUser={currentLoggedInUser}
                              id={following?._id}
                              refresh={getUsers}
                            />
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>

                    <DialogFooter></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Message aur Follow/Unfollow Button */}
              <div className="mt-5 flex gap-5 w-full justify-center items-center">
                <FollowUnfollowButton
                  currentLoggedInUser={currentLoggedInUser}
                  id={AnotherUser?._id}
                  refresh={getUsers}
                />
                <MessageButton />
              </div>
            </div>
          </div>

          {/* User's Posts Section */}
          <div className="w-full mt-15 max-w-4xl rounded-2xl overflow-hidden srollbar-hide">
            <div className="px-2 pb-3">
              <h2 className="text-xl font-bold">Posts</h2>
            </div>

            {posts?.length > 0 ? (
              <div className="w-full px-2 flex flex-col items-center gap-2 max-w-4xl  rounded-2xl overflow-hidden srollbar-hide">
                {posts?.map((post) => (
                  <div
                    key={post._id}
                    className="w-full rounded-xl p-5 transition-shadow  backdrop-blur-lg bg-white/10  shadow-md bordershadow-lg  dark:bg-white/5 dark:border-white/10 light:border-gray-500"
                  >
                    <div className="flex gap-3 w-full justify-start items-center">
                      <div className="">
                        <img
                          className="h-10 w-10 rounded-full object-cover object-top"
                          src={
                            AnotherUser?.profilePic ||
                            (AnotherUser?.gender === "male"
                              ? "/Mdp.jpg"
                              : "/Fdp.jpg")
                          }
                          alt=""
                        />
                      </div>
                      <div>
                        <h1 className="">{AnotherUser?.name}</h1>
                        <p className="text-sm font-extralight">
                          {AnotherUser?.username}
                        </p>
                      </div>
                    </div>
                    {/* Post Description */}
                    <p className="text-base mt-5">{post.description}</p>

                    {/* tagged users */}
                    {post?.taggedUsers?.length > 0 && (
                      <div className="flex gap-1 text-gray-400">
                        tagged
                        {post?.taggedUsers?.map((taggedUser) => (
                          <Link
                            key={taggedUser?._id} // <-- key on the first element returned
                            href={`/userprofile/${taggedUser._id}`}
                          >
                            <p>{taggedUser.username}</p>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Hashtags */}
                    {post.hashtags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.hashtags.map((hashtag, i) => (
                          <span
                            key={i}
                            className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-md"
                          >
                            #{hashtag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Media */}
                    {post.media && (
                      <Link href={`/media/${post._id}`}>
                        {/\.(mp4|webm|ogg)$/i.test(post.media) ? (
                          <video
                            src={post.media}
                            className="mt-4 rounded-2xl w-full max-h-96 object-contain bg-black"
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={post.media}
                            alt="Post media"
                            className="mt-4 rounded-2xl w-full object-cover max-h-96"
                          />
                        )}
                      </Link>
                    )}

                    {/* Actions */}
                    <div className="flex gap-5 mt-5">
                      <LikeDislike postId={post._id} />
                      <Link href={`/post/${post._id}`}>
                        <button className="flex items-center justify-center gap-2">
                          <IoChatbox
                            className={"text-gray-400 cursor-pointer"}
                            size={22}
                          />{" "}
                          <span className="text-gray-400">
                            {post?.comments.length}
                          </span>
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="my-8 inline-flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-300"
                >
                  <span>🚀 That’s all for now!</span>
                </motion.div>
              </div>
            ) : (
              <div className="w-full flex h-[300px] justify-center items-center">
                <p className="text-gray-500">No posts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
