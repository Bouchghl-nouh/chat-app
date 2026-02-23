const mongoose = require("mongoose");
const softDelete = require("../plugins/softDelete");

const notificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: String,
    isRead: {type:Boolean,default:false},
  },
  { timestamps: true },
);
notificationSchema.plugin(softDelete);

notificationSchema.index({ userId:true }, { unique: true });

module.exports = mongoose.model("Notification", notificationSchema);
