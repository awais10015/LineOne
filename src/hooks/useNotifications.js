import { useEffect } from "react";
import { pusherClient } from "@/lib/pusherClient";

export function useNotifications(userId, onReceive) {
  useEffect(() => {
    if (!userId) return;

    const channel = pusherClient.subscribe(`private-user-${userId}`);

    channel.bind("notification", (data) => {
      console.log("📩 Notification:", data);
      onReceive?.(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId, onReceive]);
}
