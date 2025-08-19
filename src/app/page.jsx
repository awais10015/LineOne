"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import CurrentUserContext from "@/context/CurrentUserContext";
import { useTopLoader } from "nextjs-toploader";
import { User, Calendar, ChevronDown } from "lucide-react";

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
      return;
    } else if (currentLoggedInUser?.username) {
      router.push("/home");
      return;
    } else {
      setLoading(false); // Only show form if username is not set
    }
  }, [currentLoggedInUser, router]);

  useEffect(() => {
    console.log(currentLoggedInUser);
  }, [currentLoggedInUser]);
  const navigateToHome = () => {
    router.push("/home");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    loader.start();

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
      return;
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile.");
      setLoading(false); // Allow retry
    }
    loader.done();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
      <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md mx-auto p-6 rounded-2xl shadow-lg"
    >
      {/* Username */}
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm font-medium text-gray-700">
          Username
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="username"
            name="username"
            placeholder="Enter username"
            required
            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6500] focus:border-transparent"
          />
        </div>
      </div>

      {/* Date of Birth */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="dateOfBirth"
          className="text-sm font-medium text-gray-700"
        >
          Date of Birth
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            required
            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6500] focus:border-transparent"
          />
        </div>
      </div>

      {/* Gender */}
      <div className="flex flex-col gap-1">
        <label htmlFor="gender" className="text-sm font-medium text-gray-700">
          Gender
        </label>
        <div className="relative">
          <select
            id="gender"
            name="gender"
            required
            className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#ff6500] focus:border-transparent"
          >
            <option className="text-black" value="">
              Select Gender
            </option>
            <option className="text-black" value="male">
              Male
            </option>
            <option className="text-black" value="female">
              Female
            </option>
            <option className="text-black" value="other">
              Other
            </option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Save button */}
      <button
        type="submit"
        className="w-full bg-[#ff6500] text-white font-medium py-2 px-4 rounded-lg shadow-sm transition duration-200"
      >
        Save Profile
      </button>

      
    </form>
    </div>
  );
}
