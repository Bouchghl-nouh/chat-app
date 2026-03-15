import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../socket/socket"; // Your socket instance
import { userJoined, userLeft } from "../store/slices/onlineUsers";

export const usePresence = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("userJoined", (id: string) => {
      dispatch(userJoined(id));
    });

    socket.on("userLeft", ({userId,timestamp}) => {
      dispatch(userLeft({ userId, timestamp }));
    });

    return () => {
      socket.off("userJoined");
      socket.off("userLeft");
    };
  }, [dispatch]);
};
