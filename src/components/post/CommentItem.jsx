"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const CommentItem = ({ comment, replies, onReply }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex items-start gap-3 my-2">
 
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
     
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            className="flex gap-1"
            href={`/userprofile/${comment?.commentBy?._id}`}
          >
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

        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl mt-1">
          {comment?.text}
        </p>

        <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <button
            className="hover:text-[#ff6500] transition"
            onClick={() => onReply(comment)}
          >
            Reply
          </button>

          {replies?.length > 0 && (
            <button
              className="flex items-center gap-1 hover:text-[#ff6500] transition"
              onClick={() => setShowReplies(!showReplies)}
            >
              <span>
                {showReplies
                  ? "Hide replies"
                  : `See replies (${replies.length})`}
              </span>
              <ChevronDown
                className={`h-4 w-4 transform transition-transform duration-300 ${
                  showReplies ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          )}
        </div>

        {showReplies && (
          <div className="mt-2">
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
