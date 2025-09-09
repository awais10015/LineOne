"use client";
import CurrentUserContext from "@/context/CurrentUserContext";
import { useContext, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NotificationContext from "@/context/NotificationContext";

const Notifications = () => {
  const {setnotificationCount} = useContext(NotificationContext)
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [notifications, setNotifications] = useState([]);
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const getNotifications = async () => {
    setLoader(true);
    try {
      const res = await fetch(`/api/notification/${currentLoggedInUser?._id}`);
      const data = await res.json();
      setNotifications(data?.notifications || []);

    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (currentLoggedInUser?._id) {
      getNotifications();
    }
  }, [currentLoggedInUser]);

  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`/api/notification/delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Notification Deleted");
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        setnotificationCount((prev)=>prev-1)
      } else {
        toast.error("Failed to delete notification");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleProfileRedirect = (id) => {
    if (id === currentLoggedInUser?._id) {
      router.push("/userprofile");
    } else {
      router.push(`/userprofile/${id}`);
    }
  };

  return (
    <div className="w-full flex items-start justify-center">
      <div className="max-w-4xl w-full p-6 flex flex-col items-center bg-white dark:bg-neutral-900 rounded-xl">
        <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
        {loader ? (
          <Loader />
        ) : notifications.length > 0 ? (
          <ul className="w-full space-y-3">
            {notifications.map((n) => (
              <li
                key={n._id}
                className="flex items-center gap-3 p-3 shadow-xl rounded-xl hover:bg-gray-50 hover:text-black transition"
              >
                <img
                  src={n.eventBy.profilePic || "/default-avatar.png"}
                  alt={n.eventBy.username}
                  className="w-10 h-10 rounded-full object-cover object-top border cursor-pointer"
                  onClick={() => handleProfileRedirect(n.eventBy._id)}
                />

                <div
                  className="flex-1 text-sm cursor-pointer"
                  onClick={() => handleProfileRedirect(n.eventBy._id)}
                >
                  <span>You got a </span>
                  <span className="font-medium">{n.event}</span>
                  <span> from </span>
                  <strong>{n.eventBy.username}</strong>
                </div>

                <button
                  onClick={() => deleteNotification(n._id)}
                  className="cursor-pointer text-red-500 hover:text-red-700 transition"
                >
                  <RiDeleteBin6Line size={20} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="w-full h-[90dvh] flex flex-col items-center justify-center gap-10">
            <Image
              src={"/notification.svg"}
              height={180}
              width={180}
              alt="No notification yet"
            />
            <h1 className="text-md font-bold text-gray-600">
              No notification yet
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
