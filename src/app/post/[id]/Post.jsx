"use client";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import LikeDislike from "@/components/post/LikeDislike";
import { IoChatbox } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import CurrentUserContext from "@/context/CurrentUserContext";
import CommentItem from "@/components/post/CommentItem";

const Post = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);
  const [commentText, setcommentText] = useState("");
  const { currentLoggedInUser } = useContext(CurrentUserContext);

  const [comments, setComments] = useState([]);
  const [baseComments, setbBaseComments] = useState([]);
  const [replies, setreplies] = useState([]);
  const [parentId, setparentId] = useState(null);
  const [parentName, setparentName] = useState("");

  const [showReplies, setshowReplies] = useState(false);

  const buildCommentTree = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach((c) => (map[c._id] = { ...c, replies: [] }));

    comments.forEach((c) => {
      if (c.parentId) {
        map[c.parentId]?.replies.push(map[c._id]);
      } else {
        roots.push(map[c._id]);
      }
    });

    return roots;
  };

  const getPost = async () => {
    const res = await fetch(`/api/post/${id}`);
    const data = await res.json();
    setPostData(data.post);
  };

  useEffect(() => {
    getPost();
    getComments();
  }, [id]);

  useEffect(() => {
    console.log(comments);
  }, [comments]);
  useEffect(() => {
    console.log(baseComments);
  }, [baseComments]);
  useEffect(() => {
    console.log(replies);
  }, [replies]);

  const getComments = async () => {
    const res = await fetch(`/api/comment/${id}`);
    const data = await res.json();
    setComments(data.comments);
    setbBaseComments(
      data.comments.filter((comment) => comment.parentId === null)
    );
    setreplies(data.comments.filter((comment) => comment.parentId !== null));
  };

  const postComment = async (e) => {
    e.preventDefault();
    console.log(commentText);
    const res = await fetch("/api/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: id,
        commentBy: currentLoggedInUser._id,
        text: commentText,
        parentId: parentId,
      }),
    });

    if (res.ok) {
      setcommentText("");
      setparentId(null);
      setparentName("");
      getComments(); // refresh list
    } else {
      alert("Failed to add comment");
    }
  };

  return (
    <>
      <div className="flex flex-col w-full items-center">
        <div className="relative min-h-screen w-full max-w-4xl flex flex-col items-center px-0.5">
          {postData ? (
            <>
              <div className="w-full rounded-xl pt-5 px-5 transition-shadow backdrop-blur-lg shadow-md border dark:border-white/10 light:border-gray-500 relative">
                {/* User Info */}
                <Link href={`/userprofile/${postData.postBy._id}`}>
                  <div className="flex gap-3 w-full justify-start items-center">
                    <img
                      className="h-10 w-10 rounded-full object-cover object-top"
                      src={
                        postData.postBy?.profilePic ||
                        (postData.postBy?.gender === "male"
                          ? "/Mdp.jpg"
                          : "/Fdp.jpg")
                      }
                      alt=""
                    />
                    <div>
                      <h1>{postData.postBy?.name}</h1>
                      <p className="text-sm font-extralight">
                        {postData.postBy?.username}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Post Description */}
                <p className="text-base mt-5">{postData.description}</p>

                {/* Tagged Users */}
                {postData?.taggedUsers?.length > 0 && (
                  <div className="flex gap-1 text-gray-400">
                    tagged
                    {postData?.taggedUsers?.map((taggedUser) => (
                      <Link
                        key={taggedUser?._id}
                        href={`/userprofile/${taggedUser._id}`}
                      >
                        <p>{taggedUser.username}</p>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Hashtags */}
                {postData.hashtags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {postData.hashtags.map((hashtag, i) => (
                      <span
                        key={i}
                        className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-md"
                      >
                        #{hashtag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-5">
                  {/* Media */}
                  {postData.media && (
                    <img
                      src={postData.media}
                      alt="Post media"
                      className="mt-4 rounded-2xl w-full object-contain max-h-96"
                    />
                  )}

                  {/* Actions */}
                  <div className="flex gap-5 mb-3">
                    <LikeDislike postId={postData._id} />
                    <button onClick={() => setIsCommentsOpen(!isCommentsOpen)}>
                      <IoChatbox
                        className={
                          isCommentsOpen
                            ? "text-[#ff6500] cursor-pointer"
                            : "text-gray-400 cursor-pointer"
                        }
                        size={22}
                      />
                    </button>
                  </div>

                  {/* Comments Section */}
                  {isCommentsOpen && (
                    <div className="mt-4">
                      <div className="pr-2 overflow-y-auto space-y-4">
                        {buildCommentTree(comments).map((comment) => (
                          <CommentItem
                            key={comment._id}
                            comment={comment}
                            replies={comment.replies}
                            onReply={(c) => {
                              setparentId(c._id);
                              setparentName(c.commentBy.username);
                            }}
                          />
                        ))}
                      </div>

                      {/* Input Bar */}
                      <div className="sticky bottom-0 left-0 w-full px-2 py-2">
                        <form
                          onSubmit={postComment}
                          className="flex bottom-0 left-0 w-full px-2 py-2 gap-2"
                        >
                          {parentId && (
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              replying to{" "}
                              <span className="font-medium">{parentName}</span>
                              <button
                                type="button"
                                className="text-red-500 hover:underline"
                                onClick={() => {
                                  setparentId(null);
                                  setparentName("");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          <Input
                            value={commentText}
                            onChange={(e) => setcommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 rounded-full bg-white dark:bg-gray-800 px-4 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                          <Button
                            type="submit"
                            size="icon"
                            className="rounded-full bg-[#ff6500]"
                          >
                            <Send className="h-4 w-4 text-white" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p>Loading</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Post;
