"use client";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [loader, setloader] = useState(false);

  useEffect(() => {
    if (!searchWord && activeTab === "hashtags") {
      setActiveTab("posts");
    }
  }, [searchWord]);

  const fetchPosts = async () => {
    setloader(true);
    try {
      const res = await fetch("/api/allposts");
      const data = await res.json();
      setPosts(data?.posts);
      setloader(false);
    } catch (error) {
      console.log(error);
      setloader(false);
    }
  };
  const fetchUsers = async () => {
    setloader(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      const filteredData = data.users.filter(
        (user) => user._id !== currentLoggedInUser._id
      );
      setUsers(filteredData);
      setloader(false);
    } catch (error) {
      console.log(error);
      setloader(false);
    }
  };
  const getHashtags = () => {
    if (!searchWord) {
      setPostsHavingSearchedHashtag([]);
      return;
    }

    const postWithHashtagHavingSearchWord = posts.filter((post) =>
      post?.hashtags?.some((h) => h.toLowerCase() === searchWord.toLowerCase())
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
      post?.description?.toLowerCase().includes(searchWord.toLowerCase())
    );
    const matchedUsers = users.filter((user) =>
      user?.name?.toLowerCase().includes(searchWord.toLowerCase())
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
          <div className="relative w-full max-w-sm">
            <Input
              className="pl-10 focus:outline-none focus:ring-none"
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchWord(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                />
              </svg>
            </span>
          </div>

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
                    {loader ? (
                      <Loader />
                    ) : !searchWord ? (
                      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                        {posts?.map((post) => (
                          <div
                            key={post._id}
                            className="mb-6 break-inside-avoid rounded-xl p-5 transition-shadow backdrop-blur-lg bg-white/10 shadow-md dark:bg-white/5 dark:border-white/10 border border-gray-300"
                          >
                            <Link href={`/userprofile/${post?.postBy?._id}`}>
                              <div className="flex gap-3 w-full items-center">
                                <img
                                  className="h-10 w-10 rounded-full object-cover object-top"
                                  src={
                                    post?.postBy?.profilePic ||
                                    (post?.postBy?.gender === "male"
                                      ? "/Mdp.jpg"
                                      : "/Fdp.jpg")
                                  }
                                  alt="profile"
                                />
                                <div>
                                  <h1>{post?.postBy?.name}</h1>
                                  <p className="text-sm font-extralight">
                                    {post?.postBy?.username}
                                  </p>
                                </div>
                              </div>
                            </Link>

                            <Link href={`/post/${post?._id}`}>
                              <p className="text-base mt-5">
                                {post?.description}
                              </p>
                            </Link>

                            {post.media && (
                              <Link href={`/post/${post?._id}`}>
                                {/\.(mp4|webm|ogg)$/i.test(post?.media) ? (
                                  <video
                                    src={post?.media}
                                    controls
                                    className="mt-4 rounded-2xl w-full max-h-72 object-contain bg-black"
                                  />
                                ) : (
                                  <img
                                    src={post?.media}
                                    alt="Post media"
                                    className="mt-4 rounded-2xl w-full object-cover max-h-72"
                                  />
                                )}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      searchedPosts?.map((post) => (
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
                                    post?.postBy?.profilePic ||
                                    (post?.postBy?.gender === "male"
                                      ? "/Mdp.jpg"
                                      : "/Fdp.jpg")
                                  }
                                  alt=""
                                />
                              </div>
                              <div>
                                <h1 className="">{post?.postBy?.name}</h1>
                                <p className="text-sm font-extralight">
                                  {post?.postBy?.username}
                                </p>
                              </div>
                            </div>
                          </Link>

                          <p className="text-base mt-5">{post?.description}</p>

                          {post?.taggedUsers.length > 0 && (
                            <div className="flex gap-1 text-gray-400 flex-wrap">
                              tagged
                              {post?.taggedUsers?.map((taggedUser) => (
                                <div key={taggedUser?._id}>
                                  <Link
                                    href={`/userprofile/${taggedUser?._id}`}
                                  >
                                    <p>{taggedUser?.username}</p>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          )}

                          {post?.hashtags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {post?.hashtags.map((hashtag, i) => (
                                <span
                                  key={i}
                                  className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-md"
                                >
                                  #{hashtag}
                                </span>
                              ))}
                            </div>
                          )}

                          {post.media && (
                            <>
                              <Link href={`/media/${post?._id}`}>
                                {/\.(mp4|webm|ogg)$/i.test(post?.media) ? (
                                  <video
                                    src={post?.media}
                                    controls
                                    className="mt-4 rounded-2xl w-full max-h-96 object-contain bg-black"
                                  />
                                ) : (
                                  <img
                                    src={post?.media}
                                    alt="Post media"
                                    className="mt-4 rounded-2xl w-full object-cover max-h-96"
                                  />
                                )}
                              </Link>
                            </>
                          )}

                          <div className="flex gap-5 mt-5">
                            <LikeDislike postId={post?._id} />
                            <Link href={`/post/${post?._id}`}>
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
                      ))
                    )}
                    {}
                  </CardContent>
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
                        key={user?._id}
                        className="flex items-center justify-between p-2 rounded-lg hover:text-black hover:bg-gray-100"
                      >
                        <Link href={`/userprofile/${user?._id}`}>
                          <div className="flex items-center gap-3">
                            <img
                              src={user?.profilePic || "/default-avatar.png"}
                              alt={user?.name}
                              className="w-10 h-10 rounded-full object-cover object-top"
                            />

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

                            <p className="text-base mt-5">{post.description}</p>

                            {post?.taggedUsers.length > 0 && (
                              <div className="flex gap-1 text-gray-400 flex-wrap">
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

                            {post.media && (
                              <>
                                <Link href={`/media/${post._id}`}>
                                  {/\.(mp4|webm|ogg)$/i.test(post.media) ? (
                                    <video
                                      src={post.media}
                                      controls
                                      className="mt-4 rounded-2xl w-full max-h-96 object-contain bg-black"
                                    />
                                  ) : (
                                    <img
                                      src={post.media}
                                      alt="Post media"
                                      className="mt-4 rounded-2xl w-full object-cover max-h-96"
                                    />
                                  )}
                                </Link>
                              </>
                            )}

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
