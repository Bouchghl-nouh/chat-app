import { http } from "@/api/base";
import type { updatePasswordRequest } from "@/features/user/validation/updatePassword.schema";

export const updatePassword = async (data: updatePasswordRequest) => {
  return http.patch("/auth/newPassword", data);
};
