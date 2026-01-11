const Conversation = require("../models/conversationSchema");

class ConversationRepository {
  async create(data){
    return await Conversation.create(data);
  }
  async updateById(id,updateData){
    return await Conversation.findByIdAndUpdate({_id:id},{$set:updateData},{new:true});
  }
  async getUserConversations(userId){
    return await Conversation.find({participants:userId})
      .populate("participants", "username profile lastSeen")
      .populate("lastMessage")
      .sort({updatedAt: -1});
  }
  async findByParticipants(participantIds){
    return await Conversation.findOne({type:"dm",participants:{$all:participantIds,$size:participantIds.length}});
  }
  async findById(id){
    return await Conversation.findById(id);
  }
}

module.exports = new ConversationRepository();