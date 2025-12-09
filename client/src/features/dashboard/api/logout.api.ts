import { http } from "@/api/base";

export const logout = async () => {
  return http.post("/auth/logout");
};
