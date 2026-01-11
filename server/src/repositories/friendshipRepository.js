const friendshipSchema = require("../models/friendshipSchema");

class FriendshipRepository {
  async create(data) {
    return await friendshipSchema.create(data);
  }
  async findById(id) {
    return await friendshipSchema.findById(id);
  }
  async checkFriendship(userA, userB) {
    return await friendshipSchema.findOne({
      $or: [
        { requester: userA, recipient: userB },
        { requester: userB, recipient: userA },
      ],
    });
  }
  async getFriends(userId) {
    return await friendshipSchema
      .find({
        $or: [
          { requester: userId, status: "accepted" },
          { recipient: userId, status: "accepted" },
        ],
      })
      .populate("requester", "username profile lastSeen")
      .populate("recipient", "username profile lastSeen");
  }
  async getPendingRequests(userId) {
    return await friendshipSchema
      .find({
        recipient: userId,
        status: "pending",
      })
      .populate("requester", "username profile lastSeen");
  }
  async getPendingRequest(recipient, requester) {
    return await friendshipSchema.findOne({
      recipient,
      requester,
      status: "pending",
    }).populate("requester");
  }
  async getSentRequests(userId) {
    return await friendshipSchema
      .find({
        requester: userId,
        status: "pending",
      })
      .populate("recipient", "username profile lastSeen");
  }
  async updateStatus(id, status,changedBy) {
    return await friendshipSchema
      .findByIdAndUpdate(id, { status: status,statusChangedBy:changedBy }, { new: true })
      .populate("requester", "username profile lastSeen")
      .populate("recipient", "username profile lastSeen");
  }
}
module.exports = new FriendshipRepository();
