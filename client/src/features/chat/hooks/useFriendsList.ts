import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFriendsList } from "@/features/chat/api/friendsList.api";
import { setFriends } from "@/store/slices/onlineUsers";
import { useDispatch } from "react-redux";
export function useFriendsList() {
  const dispatch = useDispatch();
  const query = useQuery({
    queryKey: ["friendsList"],
    queryFn: getFriendsList,
  });
  useEffect(() => {
    if (query?.data?.conversations) {
      dispatch(setFriends(query.data.conversations));
    }
  }, [query.data, dispatch]);
  return query;
}
