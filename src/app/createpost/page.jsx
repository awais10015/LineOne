"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "nextjs-toploader/app";
import CurrentUserContext from "@/context/CurrentUserContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

export default function CreatePostPage() {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [userQuery, setUserQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [taggedUsers, setTaggedUsers] = useState([]);

  const [hashtags, setHashtags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  const router = useRouter();

  // Search users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      if (userQuery.trim().length > 1) {
        const res = await fetch(`/api/users/search?q=${userQuery}`);
        const data = await res.json();
        setUserResults(data.users || []);
      } else {
        setUserResults([]);
      }
    };
    fetchUsers();
  }, [userQuery]);

  // Upload media to Cloudinary
  const handleMediaChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lineone_cloudinary_preset");
    formData.append("cloud_name", "dahgq0lpy");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dahgq0lpy/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    setMediaUrl(data.secure_url);
    setUploading(false);
  };

  // Add hashtag on space or comma
  const handleTagInput = (e) => {
    if (e.key === " " || e.key === ",") {
      e.preventDefault();
      let tag = currentTag.trim();

      if (tag.startsWith("#")) {
        tag = tag.slice(1);
      }

      if (tag && !hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
      }
      setCurrentTag("");
    }
  };

  // Remove hashtag
  const removeHashtag = (tag) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  // Add tagged user
  const tagUser = (user) => {
    if (!taggedUsers.find((u) => u._id === user._id)) {
      setTaggedUsers([...taggedUsers, user]);
    }
    setUserQuery("");
    setUserResults([]);
  };

  // Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      postBy: currentLoggedInUser._id,
      description,
      media: mediaUrl,
      taggedUsers: taggedUsers.map((u) => u._id),
      hashtags,
    };

    await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

     toast.success("Post Created Successfully", {
          icon: <CheckCircle className="text-green-500" />,
        });

    router.push("/userprofile");
  };

  return (
    <div className=" min-h-screen w-full flex flex-col items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="shadow-2xl border rounded-2xl p-6 w-full max-w-xl space-y-4"
      >
        <h2 className="text-2xl font-bold ">Create Post</h2>

        {/* Description */}
        <Textarea
          name="description"
          placeholder="Write your post description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-35 p-3 rounded-lg bg-white/10 backdrop-blur-sm "
          rows="4"
        />

        {/* Tag Users */}
        <div>
          <Input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Tag users..."
            className="w-full p-3 rounded-lg backdrop-blur-sm  focus:outline-none"
          />
          {userResults.length > 0 && (
            <ul className="bg-white text-black rounded-lg shadow mt-1 max-h-40 overflow-auto">
              {userResults.map((user) => (
                <li
                  key={user._id}
                  className="px-3 z-10 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => tagUser(user)}
                >
                  <div className="flex gap-3 w-full justify-start items-center">
                    <div className="">
                      <img
                        className="h-10 w-10 rounded-full object-cover object-top"
                        src={
                          user?.profilePic ||
                          (user?.gender === "male" ? "/Mdp.jpg" : "/Fdp.jpg")
                        }
                        alt=""
                      />
                    </div>
                    <div>
                      <h1 className="">{user?.name}</h1>
                      <p className="text-sm font-extralight">
                        {user?.username}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {taggedUsers.length > 0 && (
            <div className="flex flex-wrap mt-2 gap-2">
              {taggedUsers.map((user) => (
                <span
                  key={user._id}
                  className=" bg-orange-100 text-black px-5 py-3 rounded-full text-sm"
                >
                  <div className="flex gap-3 w-full justify-start items-center">
                    <div className="">
                      <img
                        className="h-10 w-10 rounded-full object-cover object-top"
                        src={
                          user?.profilePic ||
                          (user?.gender === "male" ? "/Mdp.jpg" : "/Fdp.jpg")
                        }
                        alt=""
                      />
                    </div>
                    <div>
                      <h1 className="">{user?.name}</h1>
                      <p className="text-sm font-extralight">
                        {user?.username}
                      </p>
                    </div>
                  </div>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hashtags */}
        <div>
          <Input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTagInput}
            placeholder="Type hashtags and press space/comma..."
            className="w-full p-3 backdrop-blur-sm  focus:outline-none"
          />
          <div className="flex flex-wrap mt-2 gap-2">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="bg-orange-100 text-black px-3 py-2 rounded-full text-sm flex items-center gap-2"
              >
                #{tag}
                <button type="button" onClick={() => removeHashtag(tag)}>
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Media Upload */}
        <div className="flex flex-col items-center">
          {mediaUrl && (
            <div className="mb-3 w-full">
              {mediaUrl.match(/video/) ? (
                <video controls className="w-full rounded-lg">
                  <source src={mediaUrl} />
                </video>
              ) : (
                <img
                  src={mediaUrl}
                  alt="preview"
                  className="w-full rounded-lg object-cover"
                />
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <label
            htmlFor="media"
            className="flex-1 text-center whitespace-nowrap cursor-pointer bg-[#ff6500] text-white px-4 py-2 rounded-lg shadow hover:bg-[#ff5f00] transition"
          >
            {uploading
              ? "Uploading..."
              : mediaUrl
              ? "Change Media"
              : "Upload Media"}
          </label>
          <input
            type="file"
            id="media"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleMediaChange}
          />
          {/* Submit */}
        <Button type="submit" className="flex-1 h-10 text-md font-light">
          Post
        </Button>
        </div>
        
      </form>
    </div>
  );
}
