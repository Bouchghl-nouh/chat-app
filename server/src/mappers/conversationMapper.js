const UserMapper = require("./userMapper");
const userStore = require("../utils/userStore")

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
 async getConversationsDTO(conversations){
    const conversationsDTO = await Promise.all(conversations.map(async(conversation)=>({
        conversationId:conversation._id,
        lastSeen :conversation.participants[0].lastSeen,
        ...UserMapper.getUsersDTO(conversation.participants)[0],
        isOnline :await userStore.isOnline(conversation.participants[0]._id.toString()),
        lastMessage:conversation.lastMessage,
    })))
    return conversationsDTO;
  }
}


module.exports = new ConversationMapper();
