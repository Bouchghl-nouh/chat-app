const Conversation = require("../models/conversationSchema");

class ConversationRepository {
  async create(data) {
    return await Conversation.create(data);
  }
  async updateById(id, updateData) {
    return await Conversation.findByIdAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true },
    );
  }
  async getUserConversations(userId, { page, limit }) {
    const skip = (page - 1) * limit;
    const query = { participants: userId,isBlocked:false };
    let [conversations,total] = await Promise.all([
      Conversation.find(query)
        .skip(skip)
        .limit(limit)
        .populate({
          path:"participants",
          select:"username profile lastSeen",
          match:{_id:{$ne:userId}}
        })
        .populate("lastMessage")
        .sort({ updatedAt: -1 })
        .lean(),
      Conversation.countDocuments(query),
    ]);
    return {
      conversations,
      total,
      page,
      pages:Math.ceil(total/limit),
    };
  }
  async findByParticipants(participantIds) {
    return await Conversation.findOne({
      type: "dm",
      participants: { $all: participantIds, $size: participantIds.length },
    });
  }
  async findById(id) {
    return await Conversation.findById(id);
  }
}

module.exports = new ConversationRepository();
