const Notification = require("../models/notificationSchema");

class NotificationSchema {
  create(data) {
    return Notification.create(data);
  }

  getNotifications(receiver) {
    return Notification.find({
      receiver,
    }).populate("sender", "username profile lastSeen createdAt");
  }
  countUnreadNotifications(receiver) {
    return Notification.countDocuments({
      receiver,
      isRead: false,
    });
  }
  async getUnreadNotifications(receiver, { page, limit }) {
    const skip = (page - 1) * limit;
    const [notifs, total] = await Promise.all([
      Notification.find({ receiver, isRead: false })
        .skip(skip)
        .limit(limit)
        .lean()
        .sort({createdAt:-1})
        .populate("sender", "username profile.avatar lastSeen"),
      Notification.countDocuments({ receiver, isRead: false }),
    ]);
    return {
      notifs,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
  async update(notifId) {
    return await Notification.findByIdAndUpdate(
      notifId,
      { isRead: true },
      { new: true },
    );
  }
}
module.exports = new NotificationSchema();
