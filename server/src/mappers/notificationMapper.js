class NotificationMapper {
  createFriendRequest(userId, senderId) {
    return {
      userId,
      senderId,
      message: "new Friendship Request",
    };
  }
  createEvent(userId){
    return {
        userId,
        increment:1
    }
  }
}

module.exports = new NotificationMapper();