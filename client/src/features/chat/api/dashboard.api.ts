import { http } from "@/api/base";

export interface usersList {
  users: Array<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
  }>;
  total: number;
  page: number;
  pages: number;
}

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
