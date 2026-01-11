const messageSchema = require("../entities/messageSchema");

class MessageRepository{
     async create(data) {
        return await messageSchema.create(data);
      }
      async findById(id) {
        return await messageSchema.findById(id);
      }
      async getMessages(conversationId, options = {}) {
        const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
        return await messageSchema
          .find({ conversationId })
          .sort(sort)
          .limit(limit)
          .skip(skip);
      }
}
module.exports = new MessageRepository();