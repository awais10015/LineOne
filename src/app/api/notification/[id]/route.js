import { connect } from "@/lib/db";
import { Notification } from "@/models/notificationModel";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
  try {
    await connect();
    const { id } = await params;

    const notifications = await Notification.find({ eventFor: id })
      .populate("eventBy")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
