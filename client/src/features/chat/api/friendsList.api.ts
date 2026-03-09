import { http } from "@/api/base";
import type {ChatList} from "../types"

export const getFriendsList = async (): Promise<ChatList> => {
  return http.get("/user/me/friends",undefined,undefined,false);
};
