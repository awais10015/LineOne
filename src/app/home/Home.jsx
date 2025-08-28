"use client";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import CurrentUserContext from "@/context/CurrentUserContext";
import StoryBar from "@/components/home/StoryBar";
import Loader from "@/components/Loader";
import LikeDislike from "@/components/post/LikeDislike";
import { IoChatbox } from "react-icons/io5";

const Home = () => {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const getPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/allposts");
      const data = await res.json();

      const filteredPosts = data?.posts.filter((post) => {
        const postUserId = post?.postBy?._id; 
        const followersIds = currentLoggedInUser?.followers.map(
          (f) => f._id || f
        );
        const followingIds = currentLoggedInUser?.following.map(
          (f) => f._id || f
        );

        return (
          followersIds.includes(postUserId) || followingIds.includes(postUserId)
        );
      });

      setPosts(filteredPosts);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    if (currentLoggedInUser) {
      getPosts();
    }
  }, [currentLoggedInUser]);

  return (
    <>
      <StoryBar />
      <div className="w-full flex items-center justify-center">
        <div className="w-full mt-3 max-w-4xl rounded-2xl overflow-hidden srollbar-hide">
          <div className="px-2 pb-3">
            <h2 className="text-xl font-bold">Posts</h2>
          </div>

          {posts.length === 0 && loading ? (
            <div className="w-full h-full flex items-start justify-start p-10">
              <Loader height="full"/>
            </div>
          ) : posts?.length > 0 ? (
            <div className="w-full px-2 flex flex-col items-center gap-2 max-w-4xl  rounded-2xl overflow-hidden srollbar-hide">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="w-full rounded-2xl p-3 transition-shadow  backdrop-blur-lg bg-white/10  shadow-md bordershadow-lg  dark:bg-white/5 dark:border-white/10 light:border-gray-500"
                >
                  <Link href={`/userprofile/${post?.postBy?._id}`}>
                    <div className="flex gap-3 w-full justify-start items-center">
                      <div className="">
                        <img
                          className="h-10 w-10 rounded-2xl object-cover object-top"
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
                  {/* Post Description */}
                  <p className="text-base mt-5">{post?.description}</p>

                  {/* tagged users */}

                  {post?.taggedUsers.length > 0 && (
                    <div className="flex gap-1 text-gray-400 flex-wrap">
                      tagged
                      {post?.taggedUsers?.map((taggedUser) => (
                        <Link
                          key={taggedUser?._id}
                          href={`/userprofile/${taggedUser?._id}`}
                        >
                          <div>
                            <p>{taggedUser?.username}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {/* Hashtags */}
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

                  {/* Media */}
                  {post?.media && (
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

                  {/* Actions */}
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
              <p className="text-gray-500">
                Follow Users to see what they post
              </p>
            </div>
          )}
          {}
        </div>
      </div>
    </>
  );
};

export default Home;
