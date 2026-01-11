const http = require("http");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./src/config/dbConn");
const app = require("./src/app");
const socket = require("./src/config/socket");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
    const server = http.createServer(app);
    const io = socket.init(server);
    io.on("connection", (socket) => {
      console.log("✅ User connected:", socket.user?.username, "ID:", socket.id);

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.user?.username);
      });
    });
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
