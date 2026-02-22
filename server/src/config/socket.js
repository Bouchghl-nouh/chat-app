const { Server } = require("socket.io");
const socketAuth = require("../middleware/socketAuth");

let io;
const socket = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
      },
    });

    io.use(socketAuth);

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io is not initialized!");
    }
    return io;
  },
};
module.exports = socket;
