"use client";
import { useState } from "react";
import Link from "next/link";

const CommentItem = ({ comment, replies, onReply }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex items-start gap-3 my-2">
      {/* Avatar */}
      <Link href={`/userprofile/${comment?.commentBy?._id}`}>
        <img
          src={
            comment?.commentBy?.profilePic ||
            (comment?.commentBy?.gender === "male" ? "/Mdp.jpg" : "/Fdp.jpg")
          }
          alt={comment?.commentBy?.name}
          className="h-8 w-8 rounded-full object-cover object-top"
        />
      </Link>

      <div className="flex flex-col">
        {/* User Info */}
        <div className="flex items-center gap-2">
          <Link className="flex gap-1" href={`/userprofile/${comment?.commentBy?._id}`}>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {comment?.commentBy?.name || "User"}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {comment?.commentBy?.username || "user"}
          </span>
          </Link>
          
          <span className="text-xs text-gray-400">
            {new Date(comment?.createdAt).toLocaleString()}
          </span>
        </div>

        {/* Comment Text */}
        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl mt-1">
          {comment?.text}
        </p>

        {/* Actions */}
        <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <button
            className="hover:text-[#ff6500] transition"
            onClick={() => onReply(comment)}
          >
            Reply
          </button>

          {replies?.length > 0 && (
            <button
              className="hover:text-[#ff6500] transition"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? "Hide replies" : `See replies (${replies.length})`}
            </button>
          )}
        </div>

        {/* Replies (conditionally rendered) */}
        {showReplies && (
          <div className="ml-8 mt-2 space-y-2">
            {replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                replies={reply.replies || []}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
