import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { createUser } from "@/lib/actions/user.action";

interface ClerkUserCreatedEvent {
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    image_url: string;
    first_name: string;
    last_name: string;
    username: string;
    password_enabled: boolean;
  };
  type: "user.created" | string;
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing Clerk Webhook Secret");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const payload = await req.text();
  const headerPayload = await headers();

  const svix = new Webhook(WEBHOOK_SECRET);

  let evt: ClerkUserCreatedEvent;
  try {
    console.log("svix tk chal rha ha");
    evt = svix.verify(payload, {
      "svix-id": headerPayload.get("svix-id")!,
      "svix-timestamp": headerPayload.get("svix-timestamp")!,
      "svix-signature": headerPayload.get("svix-signature")!,
    }) as ClerkUserCreatedEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Invalid webhook", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    console.log("event a rha ha");
    const {
      id,
      email_addresses,
      image_url,
      first_name,
      last_name,
      username,
      password_enabled,
    } = evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0]?.email_address || "",
      username: username || "",
      firstName: first_name || "",
      lastName: last_name || "",
      name: `${first_name || username || ""} ${last_name || ""}`.trim(),
      photo: image_url || "",
      passwordEnabled: String(password_enabled),
    };
    console.log("user a rha ha");
    console.log("✅ New user data:", user);
    try {
      await createUser(user);
    } catch (error) {
      console.error("❌ Failed to create user from webhook:", error);
      return new Response("Error creating user", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
