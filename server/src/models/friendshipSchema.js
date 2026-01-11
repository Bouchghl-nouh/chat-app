const mongoose = require("mongoose");
const softDelete = require("../plugins/softDelete");

const friendshipSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "blocked"],
      default: "pending",
    },
    statusChangedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
  },
  { timestamps: true }
);
friendshipSchema.plugin(softDelete);

friendshipSchema.index({requester:1,recipient:1},{unique:true});

module.exports = mongoose.model("Friendship",friendshipSchema);
