const notificationSchema = require("../models/notificationSchema");

class NotificationSchema {
  create(data) {
    return notificationSchema.create(data);
  }

  getNotifications(userId) {
    return notificationSchema
      .find({
        userId,
      })
      .populate("senderId", "username profile lastSeen createdAt");
  }
  countUnreadNotifications(userId) {
    return notificationSchema.countDocuments({
      userId,
      isRead: false,
    });
  }
  async update(userId) {
    return await notificationSchema.findByIdAndUpdate(
      userId,
      { isRead: true },
      { new: true },
    );
  }
}
module.exports = new NotificationSchema();
