"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

const socket = io("https://lineoneserver-production.up.railway.app");

export default function NotificationListener({ userId }) {
  useEffect(() => {
    if (userId) {
      socket.emit("register", userId);
    }

    socket.on("notification", (notif) => {
      toast.info(notif.message); // 🔔 toast
    });

    return () => {
      socket.off("notification");
    };
  }, [userId]);

  return null; // no UI
}
