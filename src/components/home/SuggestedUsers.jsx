"use client";

import Link from "next/link";
import FollowUnfollowButton from "@/components/profile/FollowUnfollowButton";
import { formatDisplayUsername } from "@/lib/formatUsername";

export default function SuggestedUsers({
  users,
  currentLoggedInUser,
  onFollowChange,
  hideSeeAll = false,
  title = "Suggested for you",
}) {
  if (!users?.length || !currentLoggedInUser) return null;

  return (
    <div className="w-full px-2 py-4 mb-2 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        {!hideSeeAll && (
          <Link href="/users" className="text-sm text-[#ff6500] hover:underline">
            See all
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3 p-3 rounded-xl bg-black/20"
          >
            <Link href={`/userprofile/${user._id}`}>
              <img
                src={
                  user.profilePic ||
                  (user.gender === "male" ? "/Mdp.jpg" : "/Fdp.jpg")
                }
                alt=""
                className="h-12 w-12 rounded-full object-cover"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/userprofile/${user._id}`}>
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-sm text-gray-400 truncate">
                  {formatDisplayUsername(user.username)}
                </p>
              </Link>
            </div>
            <FollowUnfollowButton
              id={user._id}
              currentLoggedInUser={currentLoggedInUser}
              refresh={onFollowChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
