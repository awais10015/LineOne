"use client";

import { useContext, useMemo, useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import CurrentUserContext from "@/context/CurrentUserContext";

function isSaved(savedPosts, postId) {
  if (!savedPosts?.length || !postId) return false;
  return savedPosts.some((id) => String(id?._id ?? id) === String(postId));
}

export default function SavePostButton({ postId }) {
  const { currentLoggedInUser, setCurrentLoggedInUser } =
    useContext(CurrentUserContext);
  const [pending, setPending] = useState(false);

  const saved = useMemo(
    () => isSaved(currentLoggedInUser?.savedPosts, postId),
    [currentLoggedInUser?.savedPosts, postId]
  );

  if (!currentLoggedInUser?._id || !postId) return null;

  const toggleSave = async () => {
    setPending(true);
    try {
      const res = await fetch(`/api/posts/${postId}/save`, {
        method: saved ? "DELETE" : "POST",
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setCurrentLoggedInUser((prev) =>
        prev ? { ...prev, savedPosts: data.savedPosts ?? prev.savedPosts } : prev
      );
      toast.success(saved ? "Removed from saved" : "Post saved");
    } catch {
      toast.error("Could not update saved posts");
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleSave}
      disabled={pending}
      className="text-gray-400 hover:text-[#ff6500] disabled:opacity-50"
      aria-label={saved ? "Unsave post" : "Save post"}
    >
      <Bookmark
        size={22}
        className={saved ? "fill-[#ff6500] text-[#ff6500]" : ""}
      />
    </button>
  );
}
