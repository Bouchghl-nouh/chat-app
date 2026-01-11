const mongoose = require("mongoose");
const softDelete = require("../plugins/softDelete");

const conversationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["dm", "group"],default:"dm", required: true },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    groupMeta: {
      name: String,
      avatar: {
        url: String,
        bucket: String,
        updatedAt: Date,
      },
      adminIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

conversationSchema.plugin(softDelete);

conversationSchema.index({ participants: 1,deletedAt:1 });

module.exports = mongoose.model("Conversation", conversationSchema);

