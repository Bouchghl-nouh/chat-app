class NotificationMapper {
  createFriendRequest(receiver, sender) {
    return {
      receiver,
      sender,
      message: "new Friendship Request",
    };
  }
  createAcceptRequest(receiver, sender) {
    return {
      receiver,
      sender,
      message: "You can Start conversation now",
    };
  }
  createBlockFriend(receiver, sender) {
    return {
      receiver,
      sender,
      message: "You are blocked",
    };
  }
  createUnblockFriend(receiver,sender){
    return{
      receiver,
      sender,
      message:"You are unblocked"
    }
  }
  createEvent(receiver) {
    return {
      receiver,
      increment: 1,
    };
  }
}

module.exports = new NotificationMapper();
