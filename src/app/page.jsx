"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import CurrentUserContext from "@/context/CurrentUserContext";
import SignOutButton from "@/components/client/SignOutButton";
import { useTopLoader } from 'nextjs-toploader';


export default function ProfileForm() {
  const loader = useTopLoader();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { currentLoggedInUser } = useContext(CurrentUserContext);

  // Handle user redirect logic
  useEffect(() => {
    if (currentLoggedInUser === null) {
      if (!sessionStorage.getItem("reloaded")) {
        sessionStorage.setItem("reloaded", "true");
        window.location.reload(); // Hard reload
      }
      return
    } else if (currentLoggedInUser?.username) {
      router.push("/home");
      return
    } else {
      setLoading(false); // Only show form if username is not set
    }
  }, [currentLoggedInUser, router]);

useEffect(()=>{
  console.log(currentLoggedInUser)
},[currentLoggedInUser])
  const navigateToHome = () => {
    router.push("/home");
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    loader.start()

    const formData = new FormData(e.currentTarget);
    let username = formData.get("username")?.toString().toLowerCase() || "";
    const dateOfBirth = formData.get("dateOfBirth");
    const gender = formData.get("gender");

    if (!username.startsWith("@")) {
      username = "@" + username;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        body: JSON.stringify({ username, dateOfBirth, gender }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Credentials added successfully");
      navigateToHome(); // Go to landing or auth route
      return
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile.");
      setLoading(false); // Allow retry
    }
    loader.done()
  };


  if (loading) {
    return <Loader />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto"
    >
      <input
        name="username"
        placeholder="Enter username"
        required
        className="border p-2"
      />
      <input name="dateOfBirth" type="date" required className="border p-2" />
      <select name="gender" required className="border p-2">
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Save Profile
      </button>
      <SignOutButton/>
    </form>
  );
}
