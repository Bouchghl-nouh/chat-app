const mongoose = require("mongoose");
const softDelete = require("../plugins/softDelete");

const userChatStatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    lastReadMessageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userChatStatSchema.plugin(softDelete);

userChatStatSchema.index({userId:1,conversationId:1},{unique:true});

module.exports = mongoose.model("UserChatStat",userChatStatSchema);