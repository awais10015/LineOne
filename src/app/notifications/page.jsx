"use client";
import CurrentUserContext from "@/context/CurrentUserContext";
import { useContext, useEffect, useState } from "react";

const page = () => {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [notifications, setnotifications] = useState(null);
  const getNotifications = async () => {
    const res = await fetch(`/api/notification/${currentLoggedInUser?._id}`);
    const data = await res.json();
    setnotifications(data.notifications);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="max-w-4xl  p-6 flex items-center justify-center flex-col bg-white dark:bg-neutral-900">
        <h1 className="text-2xl font-semibold mb-4">Your Notifications</h1>
<ul className="space-y-3">
  {notifications &&
    notifications.map((n) => (
      <li
        key={n._id}
        className="flex items-center gap-3 p-3  shadow rounded-xl hover:bg-gray-50 hover:text-black transition"
      >
        {/* Profile pic */}
        <img
          src={n.eventBy.profilePic || "/default-avatar.png"}
          alt={n.eventBy.username}
          className="w-10 h-10 rounded-full object-cover object-top border"
        />

        {/* Text */}
        <div className="text-sm">
          <span className="">You got a </span>
          <span className="font-medium">{n.event}</span>
          <span className=""> from </span>
          <strong className="">{n.eventBy.username}</strong>
        </div>
      </li>
    ))}
</ul>

      </div>
    </div>
  );
};
export default page;
