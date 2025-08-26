"use client";
import React, {
  useContext,
  useEffect,
  useState,
  useOptimistic,
  startTransition,
} from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CurrentUserContext from "@/context/CurrentUserContext";
import { FaThumbsDown } from "react-icons/fa6";
import { FaThumbsUp } from "react-icons/fa6";

const LikeDislike = ({ postId, refresh }) => {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [post, setPost] = useState();
  const [isLiked, setisLiked] = useState(false);
  const [isDisliked, setisDisliked] = useState(false);
  const [likeCount, setlikeCount] = useState(0);
  const [dislikeCount, setdislikeCount] = useState(0);
  const [initialLikeValue, setInitialLikeValue] = useState();
  const [initialDislikeValue, setInitialDislikeValue] = useState();

  // optimistic hook start
  const [isLiking, setIsLiking] = useOptimistic(
    isLiked,
    (_, newState) => newState
  );

  const [isDisliking, setIsDisliking] = useOptimistic(
    isDisliked,
    (_, newState) => newState
  );
  // optimistic hook end

  const getPost = async () => {
    const res = await fetch(`/api/post/${postId}`);
    const data = await res.json();
    setPost(data.post);
  };
  useEffect(() => {
    getPost();
  }, [postId]);

  // useEffect(() => {
  //   setPost(post.Data);
  // }, []);
  useEffect(() => {
    if (!post) return;
    setisLiked(post?.likedBy.includes(currentLoggedInUser?._id));
    setInitialLikeValue(post?.likedBy.includes(currentLoggedInUser?._id));
    setlikeCount(post?.likedBy.length);
    setisDisliked(post?.dislikedBy.includes(currentLoggedInUser?._id));
    setInitialDislikeValue(post?.dislikedBy.includes(currentLoggedInUser?._id));
    setdislikeCount(post?.dislikedBy.length);
  }, [post]);

  useEffect(() => {
    console.log(post);
  }, [post]);

  // useEffect(() => {
  //   console.log("isLiked", isLiked);
  //   console.log("isDisliked", isDisliked);
  // }, [isLiked, isDisliked]);

  const likePost = async () => {
    const newIsLiking = !isLiking;

    // optimistic update
    startTransition(() => {
      setIsLiking(newIsLiking);
      setisLiked(newIsLiking);
      setlikeCount((prev) => prev + (newIsLiking ? 1 : -1));
    });

    try {
      await fetch(`/api/likedislike/${post?._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentLoggedInUser: currentLoggedInUser?._id,
          toDo: "like",
        }),
      });
      getPost();
    } catch (error) {
      console.log("error in like post: ", error);
      startTransition(() => {
        setIsLiking(!newIsLiking);
        setisLiked(!newIsLiking);
        setlikeCount((prev) => prev + (!newIsLiking ? 1 : -1));
      });
      toast.error("Something went wrong. Try again!");
    }
  };
  const dislikePost = async () => {
    const newIsDisliking = !isDisliking;

    // optimistic update
    startTransition(() => {
      setIsDisliking(newIsDisliking);
      setisDisliked(newIsDisliking);
      setdislikeCount((prev) => prev + (newIsDisliking ? 1 : -1));
    });

    try {
      await fetch(`/api/likedislike/${post?._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentLoggedInUser: currentLoggedInUser?._id,
          toDo: "dislike",
        }),
      });
      getPost();
    } catch (error) {
      console.log("error in dislike post: ", error);
      startTransition(() => {
        setIsDisliking(!newIsDisliking);
        setisDisliked(!newIsDisliking);
        setdislikeCount((prev) => prev + (!newIsDisliking ? 1 : -1));
      });
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <>
      <div className="gap-5 flex">
        <button
          onClick={likePost}
          className={
            isLiked
              ? "text-[#ff6500] hover:scale-105 cursor-pointer bg-none flex items-center justify-center gap-2"
              : "cursor-pointer text-gray-400 hover:scale-105 bg-none flex items-center justify-center gap-2"
          }
        >
          <FaThumbsUp size={22} /> {likeCount}
        </button>
        <button
          onClick={dislikePost}
          className={
            isDisliked
              ? "text-[#ff6500] hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              : "cursor-pointer text-gray-400 hover:scale-105 flex items-center justify-center gap-2"
          }
        >
          <FaThumbsDown size={22} /> {dislikeCount}
        </button>
      </div>
    </>
  );
};

export default LikeDislike;
