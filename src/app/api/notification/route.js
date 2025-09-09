
import { connect } from "@/lib/db";
import { Notification } from "@/models/notificationModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    await connect();
    let newNotification = await Notification.create(body);
    newNotification = await Notification.findById(newNotification._id)
      .populate("eventBy") 
      .populate("eventFor");
    await fetch("https://lineoneserver-production.up.railway.app/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: body.eventFor,
        notification: {
          type: body.event,
          message: `You have a new ${newNotification.event} from ${newNotification.eventBy.username}`, // customize text
        },
      }),
    });
    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error.message);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
