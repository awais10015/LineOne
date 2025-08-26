"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner"; // or any toast lib

export default function SocketProvider({ userId, children }) {
  useEffect(() => {
    if (!userId) return;

    const socket = io("https://lineoneserver-production.up.railway.app");

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("register", userId);
    });

    socket.on("notification", (notif) => {
      console.log("Got notif:", notif);
      toast(`🔔 ${notif.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return children;
}
