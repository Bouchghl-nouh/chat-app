const mongoose = require("mongoose");
const softDelete = require("../plugins/softDelete");

const userSchema = new mongoose.Schema(
  {
    username: { type: String,required: true,index:true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
      firstName: String,
      lastName: String,
      avatar: {
        url: String,
        bucket: String,
        updatedAt: Date,
      },
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(softDelete);

module.exports = mongoose.model("User", userSchema);
