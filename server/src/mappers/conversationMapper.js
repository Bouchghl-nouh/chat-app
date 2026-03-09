const UserMapper = require("./userMapper");
class ConversationMapper {
  async getConversationWithParticipantsImages(conversations) {
    return await Promise.all(
        conversations.map(async (conversation)=>({
            ...conversation,
            participants:await Promise.all(
                conversation.participants.map((participant)=>
                UserMapper.getUserWithImage(participant)
                )
            )
        }))
    )
  }
  getConversationsDTO(conversations){
    const conversationsDTO = conversations.map((conversation)=>({
        conversationId:conversation._id,
        ...UserMapper.getUsersDTO(conversation.participants)[0],
        lastMessage:conversation.lastMessage,
    }))
    return conversationsDTO;
  }
}

module.exports = new ConversationMapper();
