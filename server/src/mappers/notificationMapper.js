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
  getNotifsDTO(notifsDB){
    const data = notifsDB.map((element) => {
          return {
            id:element?._id,
            senderId: element?.sender?._id,
            username: element?.sender?.username ,
            avatar: element?.sender?.avatarUrl || "",
            message:element?.message,
            createdAt:element?.createdAt

          };
        });
        return data;
  }
}

module.exports = new NotificationMapper();
