import { http } from "@/api/base";
import type { LoginFormSchema } from "@/features/auth/validation/login.schema";
export interface LoginData {
  accessToken: string;
  username: string;
  id: string;
}

export const login = async (data: LoginFormSchema): Promise<LoginData> => {
  return http.post("/auth/login", data);
};
