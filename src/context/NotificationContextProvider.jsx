"use client";
import React, { useContext, useState, useEffect } from "react";
import NotificationContext from "./NotificationContext";
import CurrentUserContext from "@/context/CurrentUserContext";

const NotificationContextProvider = ({ children }) => {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [notificationCount, setnotificationCount] = useState();

  const getNotifications = async () => {
    try {
      const res = await fetch(`/api/notification/${currentLoggedInUser?._id}`);
      const data = await res.json();
      setnotificationCount(data?.notifications.length || 0);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  useEffect(() => {
    if (currentLoggedInUser?._id) {
      getNotifications();
    }
  }, [currentLoggedInUser]);

  return (
    <NotificationContext.Provider
      value={{ notificationCount, setnotificationCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;
