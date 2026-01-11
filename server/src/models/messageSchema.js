const mongoose = require("mongoose");
const softDelete = require("../plugins/softDelete");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payload: {
      type: {
        type: String,
        enum:["text", "image", "audio", "video", "file"],
        required: true,
      },
      text: String,
      media: {
        objectKey: String,
        bucket: String,
        size: Number,
        mimeType: String,
        originalName:String,
      },
    },
    delivery: {
      deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

messageSchema.plugin(softDelete);

messageSchema.index({ conversationId: 1, createdAt: -1 ,deletedAt:1});

module.exports = mongoose.model("Message", messageSchema);
