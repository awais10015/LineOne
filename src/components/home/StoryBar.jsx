"use client";
import { useContext, useEffect, useState, useRef } from "react";
import CurrentUserContext from "@/context/CurrentUserContext";

export default function StoryBar() {
  const [stories, setStories] = useState([]);
  const { currentLoggedInUser } = useContext(CurrentUserContext);

  // add story state
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const [viewer, setViewer] = useState(null); // { user, stories }
  const [currentIndex, setCurrentIndex] = useState(0);

  const openStoryViewer = (group) => {
    setViewer(group);
    setCurrentIndex(0);
  };

  useEffect(() => {
    console.log(stories);
  }, [stories]);

  useEffect(() => {
    if (viewer) {
      const timer = setTimeout(() => {
        if (currentIndex < viewer.stories.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setViewer(null); // close after last story
        }
      }, 2000); // ⏱️ 5s per story

      return () => clearTimeout(timer);
    }
  }, [viewer, currentIndex]);

  // handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // upload story
  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    // 1. upload to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lineone_cloudinary_preset");

    const cloudRes = await fetch(
      "https://api.cloudinary.com/v1_1/dahgq0lpy/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const cloudData = await cloudRes.json();
    const mediaUrl = cloudData.secure_url;

    // 2. send to backend
    const res = await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mediaUrl,
        type: file.type.startsWith("video") ? "video" : "image",
        description,
        userId: currentLoggedInUser._id,
      }),
    });

    if (res.ok) {
      alert("Story added!");
      setFile(null);
      setPreview(null);
      setDescription("");
      fetchStories(); // refresh stories after upload
    } else {
      alert("Failed to add story");
    }

    setLoading(false);
  };

  // get stories
  const fetchStories = async () => {
    const res = await fetch(`/api/stories?userId=${currentLoggedInUser._id}`);
    const data = await res.json();

    // group by user
    const grouped = data.stories.reduce((acc, story) => {
      const userId = story.user._id;
      if (!acc[userId]) {
        acc[userId] = { user: story.user, stories: [] };
      }
      acc[userId].stories.push(story);
      return acc;
    }, {});

    setStories(Object.values(grouped)); // [{ user, stories: [] }]
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="flex w-full justify-center items-center">
      <div className="w-full mt-15 max-w-4xl rounded-2xl overflow-hidden flex p-2 gap-5">
        {/* Story List */}
        <div className="h-full w-full flex gap-3 overflow-x-auto scrollbar-hide">
          {/* Story Add Box */}
          <div className="h-[200px] w-[120px] flex-shrink-0 bg-[#ff6500] flex items-center justify-center gap-2 flex-col rounded-xl p-3">
            {!file ? (
              <>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-white text-blue-500 rounded-xl"
                >
                  Create Story
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </>
            ) : (
              <>
                {/* preview */}
                {preview &&
                  (file.type.startsWith("video") ? (
                    <video
                      src={preview}
                      className="w-20 h-20 rounded-lg object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={preview}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ))}

                {/* description */}
                <input
                  type="text"
                  value={description || ""}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description..."
                  className="px-2 py-1 rounded-lg w-full text-sm"
                />

                {/* upload button */}
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="px-4 py-2 bg-white text-blue-500 rounded-xl"
                >
                  {loading ? "Uploading..." : "Add Story"}
                </button>
              </>
            )}
          </div>

          {stories.map((group, index) => {
            // If it's grouped, pick first story, else use direct mediaUrl
            const previewUrl = group.stories
              ? group.stories[0]?.mediaUrl
              : null;

            const userData = group.user || group.stories?.[0]?.user;

            return (
              <div
                key={userData?._id || index}
                className="h-[200px] w-[120px] flex-shrink-0 rounded-2xl flex justify-center items-end bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${previewUrl})` }}
                onClick={() => openStoryViewer(group)}
              >
                <div className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={userData?.profilePic}
                      alt={userData?.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <p className="text-xs filter: blur(80px) bg-black/60 px-1 rounded-2xl">
                    {userData?.username}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {viewer && (
          <div
            onClick={() => {
              if (currentIndex < viewer.stories.length - 1) {
                setCurrentIndex((prev) => prev + 1);
              } else {
                setViewer(null); // close after last story
              }
            }}
            className="fixed w-full inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <div className="w-[400px] h-[600px] bg-black rounded-2xl flex items-center justify-center overflow-hidden relative">
              {viewer.stories[currentIndex].type === "video" ? (
                <video
                  src={viewer.stories[currentIndex].mediaUrl}
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={viewer.stories[currentIndex].mediaUrl}
                  alt="story"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Description overlay */}
              {viewer.stories[currentIndex].description && (
                <p className="absolute h-[50px] bottom-3 w-full flex items-center justify-center filter: blur(80px) bg-black/40 text-white text-sm px-2">
                  {viewer.stories[currentIndex].description}
                </p>
              )}
            </div>
            <button
              onClick={() => setViewer(null)}
              className="absolute top-4 right-4 text-white text-xl"
            >
              ✖
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
