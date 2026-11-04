"use client";

import { useContext, useMemo } from "react";
import Link from "next/link";
import LikeDislike from "@/components/post/LikeDislike";
import SavePostButton from "@/components/post/SavePostButton";
import FollowUnfollowButton from "@/components/profile/FollowUnfollowButton";
import CurrentUserContext from "@/context/CurrentUserContext";
import { formatDisplayUsername } from "@/lib/formatUsername";
import { withPostAuthor } from "@/lib/postAuthor";
import { IoChatbox } from "react-icons/io5";

const CARD_CLASS =
  "w-full rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5 shadow-sm";

const HASHTAG_CLASS =
  "text-xs font-medium text-[#ff6500] bg-[#ff6500]/10 border border-[#ff6500]/20 px-2.5 py-0.5 rounded-full";

function formatPostTime(createdAt) {
  if (!createdAt) return null;
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function PostCardMentions({ taggedUsers }) {
  if (!taggedUsers?.length) return null;
  return (
    <p className="text-sm text-muted-foreground mt-2 flex flex-wrap items-center gap-x-1 gap-y-0.5">
      <span className="shrink-0">With</span>
      {taggedUsers.map((taggedUser, i) => (
        <span key={taggedUser?._id ?? i} className="inline-flex items-center">
          {i > 0 && <span className="mr-1">,</span>}
          <Link
            href={`/userprofile/${taggedUser?._id}`}
            className="text-[#ff6500] hover:underline"
          >
            {formatDisplayUsername(taggedUser?.username) ||
              taggedUser?.name ||
              "user"}
          </Link>
        </span>
      ))}
    </p>
  );
}

function PostCardHashtags({ hashtags }) {
  if (!hashtags?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {hashtags.map((hashtag, i) => (
        <span key={i} className={HASHTAG_CLASS}>
          #{hashtag}
        </span>
      ))}
    </div>
  );
}

function PostCardActions({ postId, commentCount, showSave }) {
  return (
    <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-6">
      <LikeDislike postId={postId} />
      <Link href={`/post/${postId}`}>
        <button
          type="button"
          className="flex items-center justify-center gap-2 text-gray-400 hover:text-[#ff6500] transition-colors text-sm tabular-nums"
        >
          <IoChatbox size={22} />
          <span>{commentCount}</span>
        </button>
      </Link>
      {showSave && <SavePostButton postId={postId} />}
    </div>
  );
}

export default function PostCard({
  post,
  showSave = true,
  showAuthorFollow = false,
  onFollowChange,
  authorOverride,
  className = "",
}) {
  const { currentLoggedInUser } = useContext(CurrentUserContext);

  const normalizedPost = useMemo(
    () => withPostAuthor(post, authorOverride),
    [post, authorOverride]
  );

  const commentCount = normalizedPost?.comments?.length ?? 0;
  const taggedUsers = normalizedPost?.taggedUsers ?? [];
  const author = normalizedPost?.postBy;
  const authorId = author?._id;
  const timeLabel = formatPostTime(normalizedPost?.createdAt);

  const isSelf =
    authorId &&
    currentLoggedInUser?._id &&
    String(authorId) === String(currentLoggedInUser._id);
  const showFollow =
    showAuthorFollow &&
    authorId &&
    currentLoggedInUser &&
    !isSelf;

  const avatarSrc =
    author?.profilePic ||
    (author?.gender === "male" ? "/Mdp.jpg" : "/Fdp.jpg");

  return (
    <article className={`${CARD_CLASS} ${className}`.trim()}>
      <div className="flex gap-3 items-start w-full">
        <Link href={`/userprofile/${authorId}`} className="shrink-0">
          <img
            className="h-11 w-11 rounded-full ring-2 ring-border/50 object-cover object-top"
            src={avatarSrc}
            alt=""
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/userprofile/${authorId}`}
              className="font-semibold text-foreground leading-tight hover:underline truncate max-w-full"
            >
              {author?.name}
            </Link>
            {showFollow && (
              <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                <FollowUnfollowButton
                  id={authorId}
                  currentLoggedInUser={currentLoggedInUser}
                  refresh={onFollowChange}
                  followLabel="Follow"
                  followOnly
                  variant="outline"
                  size="sm"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <Link
              href={`/userprofile/${authorId}`}
              className="text-sm text-muted-foreground hover:underline truncate"
            >
              {formatDisplayUsername(author?.username) || author?.username}
            </Link>
            {timeLabel && (
              <>
                <span className="text-muted-foreground/60 text-xs">·</span>
                <span className="text-xs text-muted-foreground">{timeLabel}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="text-[15px] leading-relaxed mt-3 text-foreground/95 whitespace-pre-wrap break-words">
        {normalizedPost?.description}
      </p>

      <PostCardMentions taggedUsers={taggedUsers} />
      <PostCardHashtags hashtags={normalizedPost?.hashtags} />

      {normalizedPost?.media && (
        <Link
          href={`/media/${normalizedPost._id}`}
          className="block mt-3 overflow-hidden rounded-xl ring-1 ring-border/40"
        >
          {/\.(mp4|webm|ogg)$/i.test(normalizedPost.media) ? (
            <video
              src={normalizedPost.media}
              controls
              className="w-full max-h-[28rem] object-contain bg-black"
            />
          ) : (
            <img
              src={normalizedPost.media}
              alt="Post media"
              className="w-full max-h-[28rem] object-cover"
            />
          )}
        </Link>
      )}

      <PostCardActions
        postId={normalizedPost?._id}
        commentCount={commentCount}
        showSave={showSave}
      />
    </article>
  );
}
