import { connect } from "@/lib/db";
import { Notification } from "@/models/notificationModel";
import { pusherServer } from "@/lib/pusher";

export async function createNotification(body) {
  await connect();

  let newNotification = await Notification.create(body);
  newNotification = await Notification.findById(newNotification._id)
    .populate("eventBy")
    .populate("eventFor");

  if (newNotification?.eventFor && newNotification?.eventBy) {
    await pusherServer.trigger(
      `private-user-${body.eventFor}`,
      "notification",
      {
        type: body.event,
        message: `You have a new ${newNotification.event} from ${newNotification.eventBy.username}`,
        notification: newNotification,
      }
    );
  }

  return newNotification;
}
