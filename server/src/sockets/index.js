const testSocket = require("./notification.socket");
const userStore = require("../utils/userStore");
const UserRepo = require("../repositories/userRepository");
const FriendshipRepo = require("../repositories/friendshipRepository");
const registerSockets = (io) => {
  io.on("connection", async(socket) => {
    console.log("✅ User connected:", socket.user?.username, "ID:", socket.id);
    const userId = socket?.user?.id;
    await userStore.set(userId);
    const friends = await FriendshipRepo.getFriends(userId);
    socket.join(userId);
    socket.join(`group_${userId}`);
   friends.forEach((friendId)=>{
    socket.join(`group_${friendId}`);
   })
    socket.to(`group_${userId}`).emit("userJoined",userId);
    testSocket(socket);
    socket.on("disconnect", async() => {
      const timestamp = new Date();
      await UserRepo.update(userId,{lastSeen:timestamp});
      await userStore.delete(userId);
      socket.to(`group_${userId}`).emit("userLeft", {
        userId,
        timestamp:timestamp.toISOString()
      });
      console.log("❌ User disconnected:", socket.user?.username);
    });
  });
};
module.exports = registerSockets;
