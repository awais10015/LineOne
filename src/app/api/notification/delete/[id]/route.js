import { connect } from "@/lib/db";
import { Notification } from "@/models/notificationModel";
import { NextResponse } from "next/server";


export async function DELETE(req, { params }) {
  try {
    await connect();
    const { id } = params; 

    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
