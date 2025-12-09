import { http } from "@/api/base";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const register = async (data: RegisterRequest) => {
  return http.post("/auth/register", data);
};
