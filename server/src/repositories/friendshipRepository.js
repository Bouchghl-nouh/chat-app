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
  async getFriends(userId, { page, limit }) {
    const skip = (page - 1) * limit;
    const query = {
      $or: [
        { requester: userId, status: "accepted" },
        { recipient: userId, status: "accepted" },
      ],
    };
    let [friends, total] = await Promise.all([
      friendshipSchema
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate("requester", "username profile lastSeen")
        .populate("recipient", "username profile lastSeen")
        .lean(),
      friendshipSchema.countDocuments(query),
    ]);
    friends = friends.map((friend) => {
      const isRequester =
        friend.requester._id.toString() === userId
          ? friend.recipient
          : friend.requester;
      return isRequester;
    });
    return {
      friends,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
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
