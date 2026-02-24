const NOTIFICATION_TYPES = require("../constants/notificationsTypes");
const NotificationMapper = require("../mappers/notificationMapper");

class NotificationFactory {
  static builders = {
    [NOTIFICATION_TYPES.FRIEND_REQUEST_SENT]: ({ requesterId, recipientId }) =>
      NotificationMapper.createFriendRequest(recipientId, requesterId),
    [NOTIFICATION_TYPES.FRIEND_REQUEST_ACCEPTED]: ({
      requesterId,
      recipientId,
    }) => NotificationMapper.createAcceptRequest(recipientId, requesterId),
    [NOTIFICATION_TYPES.FRIEND_BLOCKED]: ({ requesterId, recipientId }) =>
      NotificationMapper.createBlockFriend(recipientId, requesterId),
    [NOTIFICATION_TYPES.FRIEND_UNBLOCK]: ({ requesterId, recipientId }) =>
      NotificationMapper.createUnblockFriend(recipientId, requesterId),
  };
  static build(type, payload) {
    const builder = this.builders[type];
    if (!builder) {
      console.warn(`Unknown notification type ${type}`);
      return;
    }
    return builder(payload);
  }
}

module.exports = NotificationFactory;
