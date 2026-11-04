"use client";

import { useContext, useEffect, useState } from "react";
import CurrentUserContext from "@/context/CurrentUserContext";
import Loader from "@/components/Loader";
import PostCard from "@/components/post/PostCard";
import { parseJsonResponse } from "@/lib/parseJsonResponse";

export default function Saved() {
  const { currentLoggedInUser, setCurrentLoggedInUser } =
    useContext(CurrentUserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/currentUser");
      const data = await parseJsonResponse(res, { user: null });
      if (data.user) {
        setCurrentLoggedInUser(data.user);
        setPosts(data.user.savedPosts ?? []);
      }
      setLoading(false);
    };
    load();
  }, [setCurrentLoggedInUser]);

  if (loading) return <Loader />;

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 px-2">
      <h1 className="text-2xl font-bold mb-4">Saved posts</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">
          Posts you save will appear here.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
