const testSocket = require("./notification.socket");
const registerSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.user?.username, "ID:", socket.id);
    const userId = socket?.user?.id;
    socket.join(userId);
    testSocket(socket);
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.user?.username);
    });
  });
};
module.exports = registerSockets;
