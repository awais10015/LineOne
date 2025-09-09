import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // your NextAuth config

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const socket_id = formData.get("socket_id");
  const channel_name = formData.get("channel_name");

  // Only allow the logged in user to subscribe to their own channel
  if (channel_name !== `private-user-${session.user.id}`) {
    return new Response("Forbidden", { status: 403 });
  }

  const authResponse = pusherServer.authorizeChannel(socket_id, channel_name);
  return Response.json(authResponse);
}
