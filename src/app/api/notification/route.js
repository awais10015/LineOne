import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import { createNotification } from "@/lib/notifications";

export async function POST(req) {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;

    const body = await req.json();
    if (String(body.eventBy) !== String(authResult.user._id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const newNotification = await createNotification(body);
    return NextResponse.json(newNotification, { status: 201 });
  } catch (err) {
    console.error("Notification Error:", err.message);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
