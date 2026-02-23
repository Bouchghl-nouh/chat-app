const notificationSchema = require("../models/notificationSchema");

class NotificationSchema {
  create(data) {
    return notificationSchema.create(data);
  }

  getNotifications(receiver) {
    return notificationSchema
      .find({
        receiver,
      })
      .populate("sender", "username profile lastSeen createdAt");
  }
  countUnreadNotifications(receiver) {
    return notificationSchema.countDocuments({
      receiver,
      isRead: false,
    });
  }
  async update(receiver) {
    return await notificationSchema.findByIdAndUpdate(
      receiver,
      { isRead: true },
      { new: true },
    );
  }
}
module.exports = new NotificationSchema();
