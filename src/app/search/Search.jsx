"use client";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";
import PostCard from "@/components/post/PostCard";
import { parseJsonResponse } from "@/lib/parseJsonResponse";
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

const Search = () => {
  const { currentLoggedInUser, setCurrentLoggedInUser } =
    useContext(CurrentUserContext);
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
      const res = await fetch("/api/feed?mode=discover&limit=50");
      const data = await res.json();
      setPosts(data?.posts ?? []);
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

  const refreshCurrentUser = useCallback(async () => {
    const res = await fetch("/api/currentUser");
    const data = await parseJsonResponse(res, { user: null });
    if (data.user) setCurrentLoggedInUser(data.user);
  }, [setCurrentLoggedInUser]);

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
                          <PostCard
                            key={post._id}
                            post={post}
                            className="mb-6 break-inside-avoid"
                            showAuthorFollow
                            onFollowChange={refreshCurrentUser}
                          />
                        ))}
                      </div>
                    ) : (
                      searchedPosts?.map((post) => (
                        <PostCard
                          key={post._id}
                          post={post}
                          className="mb-3"
                          showAuthorFollow
                          onFollowChange={refreshCurrentUser}
                        />
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
                          <PostCard
                            key={post._id}
                            post={post}
                            className="mb-3"
                            showAuthorFollow
                            onFollowChange={refreshCurrentUser}
                          />
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
