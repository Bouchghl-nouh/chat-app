import { http } from "@/api/base";
import type { RegisterRequest } from "@/features/auth/validation/register.schema";

export const register = async (data: RegisterRequest) => {
  return http.post("/auth/register", data);
};
