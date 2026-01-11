const userChatStatSchema = require("../entities/userChatStatSchema");

class UserChatStatRepository {
  async create(data) {
    return await userChatStatSchema.create(data);
  }

  async findById(id) {
    return await userChatStatSchema.findById(id);
  }

  async findByUserAndConversation(userId, conversationId) {
    return await userChatStatSchema.findOne({ userId, conversationId });
  }

  async updateLastRead(userId, conversationId, lastReadMessageId) {
    return await userChatStatSchema.findOneAndUpdate(
      { userId, conversationId },
      { lastReadMessageId, unreadCount: 0 },
      { new: true, upsert: true }
    );
  }

  async incrementUnreadCount(userId, conversationId, count = 1) {
    return await userChatStatSchema.findOneAndUpdate(
      { userId, conversationId },
      { $inc: { unreadCount: count } },
      { new: true, upsert: true }
    );
  }

  async getUnreadCount(userId, conversationId) {
    const stat = await userChatStatSchema.findOne({ userId, conversationId });
    return stat ? stat.unreadCount : 0;
  }

  async getTotalUnreadCount(userId) {
    const result = await userChatStatSchema.aggregate([
      { $match: { userId, deletedAt: null } },
      { $group: { _id: null, total: { $sum: '$unreadCount' } } }
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

}

module.exports = new UserChatStatRepository();