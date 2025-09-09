"use client";
import React, { useContext, useEffect, useState } from "react";
import { Select, Space } from "antd";
import CurrentUserContext from "@/context/CurrentUserContext";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const [users, setusers] = useState([]);
  const [loader, setloader] = useState(false);
  const { currentLoggedInUser } = useContext(CurrentUserContext);

  
  const [uploading, setUploading] = useState(false);
  const [participants, setparticipants] = useState([currentLoggedInUser._id]);
  const [groupName, setgroupName] = useState("");
  const [groupIconUrl, setgroupIconUrl] = useState("")

  const router = useRouter()

  const getUsers = async () => {
    setloader(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      const filteredUsers = data.users.filter(
        (user) => user._id !== currentLoggedInUser._id
      );
      setusers([...filteredUsers]);
      setloader(false);
    } catch (error) {
      console.log(error);
      setloader(false);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  
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
    setgroupIconUrl(data.secure_url);
    setUploading(false);
  };

  const handleChange = (value) => {
    setparticipants([currentLoggedInUser._id, ...value]);
  };

  const options = users.map((user) => ({
    label: user.name,
    value: user._id,
    profilePic: user.profilePic,
    username: user.username,
  }));

  const createGroup = async (e) => {
   
    e.preventDefault();

    try {
      const res = await fetch("/api/chat/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName, 
          participants: participants,
          groupIcon: groupIconUrl, 
          admin: currentLoggedInUser._id, 
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Error creating group");
        
        return;
      }
      
      router.push(`/chat/${data._id}`)
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loader ? (
          <Loader />
        ) : (
          <div className="w-full p-6 md:p-10 flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
              Create a New Group
            </h2>

            <form
              onSubmit={createGroup}
              action=""
              className="flex flex-col justify-center items-center gap-6"
            >
          
              <div className="flex flex-col items-center">
                {groupIconUrl && (
                  <div className="h-[150px] w-[150px] mb-3 rounded-full overflow-hidden shadow-md border border-gray-300 dark:border-gray-700">
                    <img
                      src={groupIconUrl}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

            
              <Input
                onChange={(e) => setgroupName(e.target.value)}
                type="text"
                placeholder="Enter Group Name"
                required
                className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />

             
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select users to add in group"
                onChange={handleChange}
                options={options}
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option?.label.toLowerCase().includes(input.toLowerCase()) ||
                  option?.username?.toLowerCase().includes(input.toLowerCase())
                }
                optionRender={(option) => (
                  <Space>
                    <img
                      src={option.data.profilePic || "/default.png"}
                      alt={option.data.label}
                      className="w-6 h-6 rounded-full object-cover object-top"
                    />
                    <span>{option.data.label}</span>
                    <span className="text-gray-400 text-xs">
                      {option.data.username}
                    </span>
                  </Space>
                )}
              />

              
              <div className="flex gap-3 w-full">
                <label
                  htmlFor="media"
                  className="flex-1 text-center cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 transition font-medium"
                >
                  {uploading
                    ? "Uploading..."
                    : groupIconUrl
                    ? "Change Group Picture"
                    : "Upload Group Picture"}
                </label>
                <input
                  type="file"
                  id="media"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMediaChange}
                />

                <Button
                  type="submit"
                  variant="default"
                  className="flex-1 px-4 bg-gray-500 text-white py-5 font-medium text-md cursor-pointer hover:scale-105 transition rounded-lg"
                >
                  Create Group
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
