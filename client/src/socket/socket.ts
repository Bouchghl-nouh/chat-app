import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  autoConnect: false,
});

export const connectSocket = (token: string) => {
  socket.disconnect(); // Disconnect any existing connection
  socket.io.opts.extraHeaders = {
    authorization: `Bearer ${token}`,
  };
  socket.connect();
};