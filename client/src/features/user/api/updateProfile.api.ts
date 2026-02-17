import { http } from "@/api/base";
import type { userProfile } from "@/features/user/types/userProfile";
export type uploadFile =  {
  uploadUrl :string;
}
export const updateProfile = async(data: userProfile):Promise<uploadFile> => {
  return http.patch("/user/me", data);
};
