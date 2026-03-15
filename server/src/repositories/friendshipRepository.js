const friendshipSchema = require("../models/friendshipSchema");

class FriendshipRepository {
  async create(data) {
    return await friendshipSchema.create(data);
  }
  async findById(id) {
    return await friendshipSchema.findById(id);
  }
  checkFriendship(userA, userB) {
    return friendshipSchema.findOne({
      $or: [
        { requester: userA, recipient: userB },
        { requester: userB, recipient: userA },
      ],
    });
  }
  async getFriends(userId) {
    const query = {
      $or: [
        { requester: userId, status: "accepted" },
        { recipient: userId, status: "accepted" },
      ],
    };
    const data = await friendshipSchema
      .find(query)
      .populate("requester", "username")
      .populate("recipient", "username")
      .lean();
    const friends = data.map((friend) => {
      const isRequester =
        friend.requester._id.toString() === userId
          ? friend.recipient._id.toString()
          : friend.requester._id.toString();
      return isRequester;
    });
    return friends;
  }
  async getPendingRequests(userId) {
    return await friendshipSchema
      .find({
        recipient: userId,
        status: "pending",
      })
      .populate("requester", "username profile lastSeen")
      .lean();
  }
  async getPendingRequest(recipient, requester) {
    return await friendshipSchema
      .findOne({
        recipient,
        requester,
        status: "pending",
      })
      .populate("requester");
  }
  async getSentRequests(userId) {
    return await friendshipSchema
      .find({
        requester: userId,
        status: "pending",
      })
      .populate("recipient", "username profile lastSeen");
  }
  async updateStatus(id, status, changedBy) {
    return await friendshipSchema
      .findByIdAndUpdate(
        id,
        { status: status, statusChangedBy: changedBy },
        { new: true },
      )
      .populate("requester", "username profile lastSeen")
      .populate("recipient", "username profile lastSeen");
  }
}
module.exports = new FriendshipRepository();
