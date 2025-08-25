"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
const Media = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);

  const getPost = async () => {
    const res = await fetch(`/api/post/${id}`);
    const data = await res.json();
    setPostData(data.post);
  };

  useEffect(() => {
    if (!id) return;
    getPost();
  }, [id]);

  if (!postData) {
    return (
      <Loader/>
    );
  }

  // helper to check if it's a video
  const isVideo = postData.media?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black z-50 flex items-center justify-center">
      {/* Media */}
      <div className="max-w-4xl flex items-center justify-center">
        {isVideo ? (
          <video
            src={postData.media}
            controls
            playsInline
            className=" rounded-lg bg-black"
          />
        ) : (
          <img
            src={postData.media}
            alt={postData.description || "media"}
            className="max-h-full max-w-full object-contain rounded-lg"
          />
        )}
      </div>

      {/* Optional caption / description */}
      {postData.description && (
        <div className="absolute bottom-5 text-center text-white text-lg bg-black/50 px-4 py-2 rounded-lg">
          {postData.description}
        </div>
      )}
    </div>
  );
};

export default Media;
