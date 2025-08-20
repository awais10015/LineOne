"use client";
import CurrentUserContext from "@/context/CurrentUserContext";
import React, { useContext } from "react";
import { motion } from "framer-motion";

const Post = () => {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  return (
    <>
      <div className="w-full mt-15 max-w-4xl rounded-2xl overflow-hidden srollbar-hide">
        <div className="px-2 pb-3">
          <h2 className="text-xl font-bold">Posts</h2>
        </div>

        {currentLoggedInUser?.posts?.length > 0 ? (
          <div className="w-full px-2 flex flex-col items-center gap-2 max-w-4xl  rounded-2xl overflow-hidden srollbar-hide">
            {currentLoggedInUser.posts.map((post) => (
              <div
                key={post._id}
                className="w-full rounded-xl p-5 transition-shadow  backdrop-blur-lg bg-white/10  shadow-md bordershadow-lg  dark:bg-white/5 dark:border-white/10 light:border-gray-500"
              >
                <div className="flex gap-3 w-full justify-start items-center">
                  <div className="">
                    <img
                      className="h-10 w-10 rounded-full object-cover object-top"
                      src={
                        currentLoggedInUser?.profilePic ||
                        (currentLoggedInUser?.gender === "male"
                          ? "/Mdp.jpg"
                          : "/Fdp.jpg")
                      }
                      alt=""
                    />
                  </div>
                  <div>
                    <h1 className="">{currentLoggedInUser?.name}</h1>
                    <p className="text-sm font-extralight">
                      {currentLoggedInUser?.username}
                    </p>
                  </div>
                </div>
                {/* Post Description */}
                <p className="text-base mt-5">{post.description}</p>

                {/* tagged users */}
                {post?.taggedUsers.length > 0 && (
                  <div className="flex gap-1 text-gray-400">
                    tagged
                    {post?.taggedUsers?.map((taggedUser) => (
                      <div key={taggedUser._id}>
                        <p>{taggedUser.username}</p>
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
