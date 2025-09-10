"use client";
import { useContext, useEffect, useState, useRef } from "react";
import CurrentUserContext from "@/context/CurrentUserContext";
import Image from "next/image";
import Loader from "../Loader";
import { CgAddR } from "react-icons/cg";
import { toast } from "sonner";

export default function StoryBar() {
  const [stories, setStories] = useState([]);
  const { currentLoggedInUser } = useContext(CurrentUserContext);

 
  const [loader, setLoader] = useState(false);

  const [file, setFile] = useState("");
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const [viewer, setViewer] = useState(null); 
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
          setViewer(null);
        }
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [viewer, currentIndex]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (
      !selectedFile.type.startsWith("image/") &&
      !selectedFile.type.startsWith("video/")
    ) {
      toast.error("Only images and videos are allowed for stories!");
     
      return;
    }
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

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
    toast.success("Story added!");
      setFile(null);
      setPreview(null);
      setDescription("");
      fetchStories();
    } else {
      toast.error("Failed to add story");
    }

    setLoading(false);
  };

  const fetchStories = async () => {
    setLoader(true);
    const res = await fetch(`/api/stories?userId=${currentLoggedInUser._id}`);
    const data = await res.json();

    const grouped = data.stories.reduce((acc, story) => {
      const userId = story.user._id;
      if (!acc[userId]) {
        acc[userId] = { user: story.user, stories: [] };
      }
      acc[userId].stories.push(story);

      return acc;
    }, {});

    setStories(Object.values(grouped));
    setLoader(false);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="flex w-full justify-center items-center">
      <div className="w-full mt-3 max-w-4xl rounded-2xl overflow-hidden flex p-2 gap-5">
      
        <div className="h-full w-full flex gap-3 overflow-x-auto scrollbar-hide">
          
          <div className="h-[200px] w-[120px] flex-shrink-0 bg-black/20 flex items-center justify-center gap-2 flex-col rounded-xl p-3">
            {!file ? (
              <>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex cursor-pointer flex-col justify-center items-center gap-2 px-2 py-2 bg-white/20 text-sm rounded-md whitespace-nowrap"
                >
                  <CgAddR size={25} />
                  Add Story
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

                <input
                  type="text"
                  value={description || ""}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description..."
                  className="px-2 py-1 rounded-lg w-full text-sm"
                />

                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="px-4 py-2 bg-white/20 text-white rounded-xl"
                >
                  {loading ? "Uploading..." : "Add Story"}
                </button>
              </>
            )}
          </div>

          {stories.length === 0 && loader ? (
            <div className="h-[200px] w-[120px] flex items-center justify-center">
              <Loader size={5} height="full"/>
            </div>
          ) : (
            stories.map((group, index) => {
             
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
                  <div className="flex flex-col items-center  cursor-pointer">
                    <div className="w-16 h-16 rounded-full border-2 border-[#ff6500] overflow-hidden">
                      <img
                        src={userData?.profilePic}
                        alt={userData?.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <p className="text-xs filter: blur(80px) bg-black/60 px-2 py-1 mb-1 text-white font-medium rounded-2xl">
                      {userData?.username}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {viewer && (
          <div
            onClick={() => {
              if (currentIndex < viewer.stories.length - 1) {
                setCurrentIndex((prev) => prev + 1);
              } else {
                setViewer(null);
              }
            }}
            className="fixed w-full inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <div className="w-[400px] h-[660px]  bg-black rounded-2xl flex items-center justify-center overflow-hidden relative">
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
                  className="w-full h-full object-contain"
                />
              )}
              {viewer.stories[currentIndex].user && (
                <div className="absolute top-0 flex items-center gap-4 w-full p-2 bg-black/40">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={
                        viewer.stories[currentIndex]?.user?.profilePic ||
                        "/default-avatar.png"
                      }
                      alt="user profile"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="text-white">
                    <h1 className="font-medium text-sm">
                      {viewer.stories[currentIndex]?.user?.name}
                    </h1>
                    <h2 className="text-sm font-light">
                      {viewer.stories[currentIndex]?.user?.username}
                    </h2>
                  </div>
                </div>
              )}

              {viewer.stories[currentIndex].description && (
                <p className="absolute h-[50px] bottom-0 w-full flex items-center justify-center filter: blur(80px) bg-black/40 text-white text-sm px-2">
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
