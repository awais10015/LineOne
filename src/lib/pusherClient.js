import Pusher from "pusher-js";

// 🔹 Client-side Pusher (used in React)
export const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  forceTLS: true,
  authEndpoint: "/api/pusher/auth", // secure private channels
});
