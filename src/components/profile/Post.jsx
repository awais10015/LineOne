"use client";
import CurrentUserContext from "@/context/CurrentUserContext";
import React, { useContext } from "react";
import { motion } from "framer-motion";
import PostCard from "@/components/post/PostCard";

const Post = () => {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  return (
    <>
      <div className="w-full mt-15 max-w-4xl rounded-2xl overflow-hidden srollbar-hide">
        <div className="px-2 pb-3">
          <h2 className="text-xl font-bold">Posts</h2>
        </div>

        {currentLoggedInUser?.posts?.length > 0 ? (
          <div className="w-full px-2 flex flex-col items-center gap-3 max-w-4xl rounded-2xl overflow-hidden srollbar-hide">
            {currentLoggedInUser.posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                authorOverride={currentLoggedInUser}
              />
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
    </>
  );
};

export default Post;
