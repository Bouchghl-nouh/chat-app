import { http } from "@/api/base";
import type { myProfile } from "@/features/user/types/userProfile";
export type uploadFile =  {
  uploadUrl :string;
}
export const updateProfile = async(data: myProfile):Promise<uploadFile> => {
  return http.patch("/user/me", data);
};
