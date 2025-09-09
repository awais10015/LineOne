"use client";
import { SquarePen } from "lucide-react";
import { useContext, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {UserPen} from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CurrentUserContext from "@/context/CurrentUserContext";

const EditProfile = () => {

    const {currentLoggedInUser} = useContext(CurrentUserContext)

  let userProfilePic =
    currentLoggedInUser?.profilePic ||
    (currentLoggedInUser?.gender === "male" ? "/Mdp.jpg" : "/Fdp.jpg");
  let userCoverPic = currentLoggedInUser?.coverPic || "/cover.jpg";

  const [profilePic, setProfilePic] = useState(userProfilePic || "");
  const [coverPic, setCoverPic] = useState(userCoverPic || "");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === "profile") {
        setProfilePic(previewUrl);
      } else {
        setCoverPic(previewUrl);
      }
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lineone_cloudinary_preset");
    formData.append("cloud_name", "dahgq0lpy");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dahgq0lpy/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let profilePicUrl = profilePic;
    let coverPicUrl = coverPic;

    let username =
      e.target.changeusername.value?.toString().toLowerCase() || currentLoggedInUser?.username;

    username = username.replace(/\s+/g, "");

    if (!username.startsWith("@")) {
      username = "@" + username;
    }


    if (profilePic.startsWith("blob:")) {
      profilePicUrl = await uploadImage(
        document.getElementById("profileUpload").files[0]
      );
    }
    if (coverPic.startsWith("blob:")) {
      coverPicUrl = await uploadImage(
        document.getElementById("coverUpload").files[0]
      );
    }

 
    await fetch("/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: e.target.changename.value || currentLoggedInUser?.name,
        username: username || currentLoggedInUser?.username,
        bio: e.target.changebio.value || currentLoggedInUser?.bio,
        profilePic: profilePicUrl,
        coverPic: coverPicUrl,
      }),
    });

    setLoading(false);
    window.location.reload();
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-[#ff6500] hover:bg-[#ff5f00] text-white px-6 py-2 rounded-lg hover:scale-105 cursor-pointer">
            <UserPen/>  Edit Profile
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>

            <div
              style={{ backgroundImage: `url(${coverPic})` }}
              className="w-full h-48 relative bg-cover bg-center"
            >
              <input
                type="file"
                id="coverUpload"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, "cover")}
              />
              <label
                htmlFor="coverUpload"
                className="absolute top-2 right-2 bg-white/60 backdrop-blur-md  rounded cursor-pointer shadow"
              >
                <SquarePen className="text-black" />
              </label>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
                  <img
                    className="w-32 h-32 object-cover object-top"
                    src={profilePic}
                    alt="dp"
                  />
                </div>
                <input
                  type="file"
                  id="profileUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "profile")}
                />
                <label
                  htmlFor="profileUpload"
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/60 backdrop-blur-md rounded cursor-pointer shadow"
                >
                  <SquarePen className="text-black" />
                </label>
              </div>
            </div>

            <div className="grid gap-4 mt-7">
              <div className="grid gap-3">
                <Label>Name</Label>
                <Input
                  id="changename"
                  name="changename"
                  placeholder={currentLoggedInUser?.name}
                  defaultValue={currentLoggedInUser?.name}
                />
              </div>
              <div className="grid gap-3">
                <Label>Username</Label>
                <Input
                  id="changeusername"
                  name="changeusername"
                  placeholder={currentLoggedInUser?.username}
                  defaultValue={currentLoggedInUser?.username}
                />
              </div>
              <div className="grid gap-3">
                <Label>Bio</Label>
                <Input
                  id="changebio"
                  name="changebio"
                  placeholder={currentLoggedInUser?.bio}
                  defaultValue={currentLoggedInUser?.bio}
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={loading} className="bg-[#ff6500] text-white" >
                {loading ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfile;
