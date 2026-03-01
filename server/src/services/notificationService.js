const notificationRepo = require("../repositories/notificationRepository");
const NotificationFactory = require("../factories/notificationFactory");
const NotificationMapper = require("../mappers/notificationMapper");
const UserMapper = require("../mappers/userMapper");
class NotificationService {
  async notify(type, payload) {
    const notifData = NotificationFactory.build(type, payload);
    const notification = await notificationRepo.create(notifData);
    if (!notification) return null;
    return {
      type: "NOTIFICATION_CREATED",
      payload: NotificationMapper.createEvent(notifData.receiver),
    };
  }
  async getUnreadNotifs(filter, receiver) {
    const { page, limit } = filter;
    const data = await notificationRepo.getUnreadNotifications(receiver, {
      page,
      limit,
    });
    const dataWithImages = await Promise.all(
      data.notifs.map(async (element) => {
        const senderWithImage = await UserMapper.getUserWithImage(
          element?.sender,
        );
        return {
          ...element,
          sender: senderWithImage,
        };
      }),
    );
    const notifs = NotificationMapper.getNotifsDTO(dataWithImages);
    return {
      ...data,
      notifs,
    };
  }
  async readNotif(notifId) {
    const data = await notificationRepo.update(notifId);
    return {
      event: {
        type: "NOTIFICATION_CREATED",
        payload: {
          receiver: data.receiver.toString(),
          increment: -1,
        },
      },
    };
  }
}
module.exports = new NotificationService();
