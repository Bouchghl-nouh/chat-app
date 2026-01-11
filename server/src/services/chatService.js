const conversationRepo = require("../repositories/conversationRepository");
const messageRepo = require("../repositories/MessageRepository");
class ChatService {
    async createConversation(type="dm",participants){
        return await conversationRepo.create({type,participants});
    }
    async getConversations(userId){
        return await conversationRepo.getUserConversations(userId);
    }
    async getMessages(conversationId){
        return await messageRepo.getMessages(conversationId);
    }
    async sendMessage(){
     
    }
    
    

}

module.exports = new ChatService();