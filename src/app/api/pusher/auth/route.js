import { pusherServer } from "@/lib/pusher";
import { auth } from "@/auth";

export async function POST(req) {
  const session = await auth();

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
