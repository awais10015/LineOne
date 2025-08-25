"use client";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

import { AppWindowIcon, CodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrentUserContext from "@/context/CurrentUserContext";
import Link from "next/link";
import FollowUnfollowButton from "@/components/profile/FollowUnfollowButton";
import LikeDislike from "@/components/post/LikeDislike";
import { IoChatbox } from "react-icons/io5";

const Search = () => {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [hashtags, setHashtags] = useState([]);

  const [searchWord, setSearchWord] = useState(null);

  const [postsHavingSearchedHashtag, setPostsHavingSearchedHashtag] = useState(
    []
  );
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (!searchWord && activeTab==="hashtags") {
      setActiveTab("posts");
    }
  }, [searchWord]);

  useEffect(() => {
    console.log("searched hashtagged posts : ", postsHavingSearchedHashtag);
  }, [postsHavingSearchedHashtag]);

  const fetchPosts = async () => {
    const res = await fetch("/api/allposts");
    const data = await res.json();
    setPosts(data.posts);
  };
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data.users);
  };
  const getHashtags = () => {
    if (!searchWord) {
      setPostsHavingSearchedHashtag([]);
      return;
    }

    const postWithHashtagHavingSearchWord = posts.filter((post) =>
      post.hashtags?.some((h) => h.toLowerCase() === searchWord.toLowerCase())
    );

    setPostsHavingSearchedHashtag(postWithHashtagHavingSearchWord);
  };

  useEffect(() => {
    let timeout;
    clearTimeout(timeout);
    if (!posts) return;
    if (!Array.isArray(posts)) return;
    timeout = setTimeout(() => {
      getHashtags();
    }, 2000);
  }, [posts, searchWord]);

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);
  const wordToSearch = () => {
    if (!searchWord) {
      setSearchedUsers([...users]);
      setSearchedPosts([...posts]);

      return;
    }

    const matchedPosts = posts.filter((post) =>
      post.description?.toLowerCase().includes(searchWord.toLowerCase())
    );
    const matchedUsers = users.filter((user) =>
      user.name?.toLowerCase().includes(searchWord.toLowerCase())
    );

    setSearchedPosts(matchedPosts);
    setSearchedUsers(matchedUsers);
  };

  useEffect(() => {
    wordToSearch();
  }, [searchWord, users, posts, hashtags]);

  return (
    <>
      <div className="w-full flex items-start justify-center mt-5">
        <div className="w-full max-w-4xl px-3 pb-5 flex items-center justify-center flex-col gap-10 rounded-2xl overflow-hidden srollbar-hide">
          <Input type="text" onChange={(e) => setSearchWord(e.target.value)} />

          <div className="flex w-full flex-col gap-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="items-center w-full"
            >
              <TabsList>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                {searchWord && (
                  <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
                )}
              </TabsList>
              <TabsContent className="border-none bg-none w-full" value="posts">
                <Card className="p-0 pt-4 border-none gap-1 shadow-none">
                  <CardHeader className="p-0 pl-2">
                    <CardTitle>Posts</CardTitle>
                    <CardDescription>{}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-1 p-1">
                    {searchedPosts?.map((post) => (
                      <div
                        key={post._id}
                        className="w-full rounded-xl p-5 transition-shadow  backdrop-blur-lg bg-white/10  shadow-md bordershadow-lg  dark:bg-white/5 dark:border-white/10 light:border-gray-500"
                      >
                        <Link href={`/userprofile/${post?.postBy?._id}`}>
                          <div className="flex gap-3 w-full justify-start items-center">
                            <div className="">
                              <img
                                className="h-10 w-10 rounded-full object-cover object-top"
                                src={
                                  post.postBy?.profilePic ||
                                  (post.postBy?.gender === "male"
                                    ? "/Mdp.jpg"
                                    : "/Fdp.jpg")
                                }
                                alt=""
                              />
                            </div>
                            <div>
                              <h1 className="">{post.postBy?.name}</h1>
                              <p className="text-sm font-extralight">
                                {post.postBy?.username}
                              </p>
                            </div>
                          </div>
                        </Link>

                        {/* Post Description */}
                        <p className="text-base mt-5">{post.description}</p>

                        {/* tagged users */}
                        {post?.taggedUsers.length > 0 && (
                          <div className="flex gap-1 text-gray-400">
                            tagged
                            {post?.taggedUsers?.map((taggedUser) => (
                              <div key={taggedUser._id}>
                                <Link href={`/userprofile/${taggedUser._id}`}>
                                  <p>{taggedUser.username}</p>
                                </Link>
                              </div>
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
                          <img
                            src={post.media}
                            alt="Post media"
                            className="mt-4 rounded-2xl w-full object-cover max-h-96"
                          />
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
                  </CardContent>
                  {/* <CardFooter>This is the posts footer</CardFooter> */}
                </Card>
              </TabsContent>
              <TabsContent className="border-none bg-none w-full" value="users">
                <Card className="p-0 pt-4 border-none gap-1 shadow-none">
                  <CardHeader className="p-0 pl-2">
                    <CardTitle>Users</CardTitle>
                    <CardDescription>{}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-1 p-1">
                    {searchedUsers?.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-2 rounded-lg hover:text-black hover:bg-gray-100"
                      >
                        {/* Left: Profile picture */}
                        <Link href={`/userprofile/${user._id}`}>
                          <div className="flex items-center gap-3">
                            <img
                              src={user?.profilePic || "/default-avatar.png"}
                              alt={user?.name}
                              className="w-10 h-10 rounded-full object-cover object-top"
                            />
                            {/* Middle: Name + Username */}
                            <div>
                              <p className="font-medium">{user?.name}</p>
                              <p className="text-sm text-gray-500">
                                {user?.username}
                              </p>
                            </div>
                          </div>
                        </Link>

                        <FollowUnfollowButton
                          currentLoggedInUser={currentLoggedInUser}
                          id={user?._id}
                          refresh={fetchUsers}
                        />
                      </div>
                    ))}
                  </CardContent>
                  {/* <CardFooter>This is the posts footer</CardFooter> */}
                </Card>
              </TabsContent>
              {searchWord && (
                <TabsContent
                  className="border-none bg-none w-full"
                  value="hashtags"
                >
                  <Card className="p-0 pt-4 border-none gap-1 shadow-none">
                    <CardHeader className="p-0 pl-2">
                      <CardTitle>Hashtags</CardTitle>
                      <CardDescription>{}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-1 p-1">
                      <ul>
                        {searchWord && (
                          <li className="flex items-center justify-between p-2 rounded-lg hover:text-black hover:bg-gray-100">
                            <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-md">
                              #{searchWord}
                            </span>
                            <span>
                              {postsHavingSearchedHashtag.length} Posts
                            </span>
                          </li>
                        )}
                      </ul>
                      {postsHavingSearchedHashtag.length > 0 &&
                        postsHavingSearchedHashtag?.map((post) => (
                          <div
                            key={post._id}
                            className="w-full rounded-xl p-5 transition-shadow  backdrop-blur-lg bg-white/10  shadow-md bordershadow-lg  dark:bg-white/5 dark:border-white/10 light:border-gray-500"
                          >
                            <Link href={`/userprofile/${post?.postBy?._id}`}>
                              <div className="flex gap-3 w-full justify-start items-center">
                                <div className="">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover object-top"
                                    src={
                                      post.postBy?.profilePic ||
                                      (post.postBy?.gender === "male"
                                        ? "/Mdp.jpg"
                                        : "/Fdp.jpg")
                                    }
                                    alt=""
                                  />
                                </div>
                                <div>
                                  <h1 className="">{post.postBy?.name}</h1>
                                  <p className="text-sm font-extralight">
                                    {post.postBy?.username}
                                  </p>
                                </div>
                              </div>
                            </Link>

                            {/* Post Description */}
                            <p className="text-base mt-5">{post.description}</p>

                            {/* tagged users */}
                            {post?.taggedUsers.length > 0 && (
                              <div className="flex gap-1 text-gray-400">
                                tagged
                                {post?.taggedUsers?.map((taggedUser) => (
                                  <div key={taggedUser._id}>
                                    <Link
                                      href={`/userprofile/${taggedUser._id}`}
                                    >
                                      <p>{taggedUser.username}</p>
                                    </Link>
                                  </div>
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
                              <img
                                src={post.media}
                                alt="Post media"
                                className="mt-4 rounded-2xl w-full object-cover max-h-96"
                              />
                            )}
                          </div>
                        ))}
                    </CardContent>
                    {/* <CardFooter>This is the posts footer</CardFooter> */}
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
