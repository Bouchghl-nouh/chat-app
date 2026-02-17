import { http } from "@/api/base";
import type {usersList} from "../types"

export const users = async (
  username: string,
  page: number,
): Promise<usersList> => {
  return http.get("/user/all", {
    page,
    limit: 5,
    username,
  },undefined,false);
};
