const testSocket = require("./notification.socket");
const userStore = require("../utils/userStore");
const UserRepo = require("../repositories/userRepository");
const registerSockets = (io) => {
  io.on("connection", async(socket) => {
    console.log("✅ User connected:", socket.user?.username, "ID:", socket.id);
    const userId = socket?.user?.id;
    await userStore.set(userId);
    socket.join(userId);
    testSocket(socket);
    socket.on("disconnect", async() => {
      await UserRepo.update(userId,{lastSeen:new Date()});
      await userStore.delete(userId);
      console.log("❌ User disconnected:", socket.user?.username);
    });
  });
};
module.exports = registerSockets;
