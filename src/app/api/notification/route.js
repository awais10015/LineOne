import { connect } from "@/lib/db";
import { Notification } from "@/models/notificationModel";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req) {
  try {
    const body = await req.json();
    await connect();

    // Save in DB
    let newNotification = await Notification.create(body);
    newNotification = await Notification.findById(newNotification._id)
      .populate("eventBy")
      .populate("eventFor");

    // Send via Pusher
    await pusherServer.trigger(
      `private-user-${body.eventFor}`,
      "notification",
      {
        type: body.event,
        message: `You have a new ${newNotification.event} from ${newNotification.eventBy.username}`,
        notification: newNotification,
      }
    );

    return NextResponse.json(newNotification, { status: 201 });
  } catch (err) {
    console.error("Notification Error:", err.message);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
