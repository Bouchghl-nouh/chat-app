import { http } from "@/api/base";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  username: string;
  id: string;
}

export const login = async (data: LoginRequest): Promise<LoginData> => {
  return http.post("/auth/login", data);
};
