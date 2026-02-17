import { http } from "@/api/base";
export interface userProfileData {
  firstName?: string;
  username: string;
  lastName?: string;
  avatar?:string;
  description?:string;
  status?:string;
  canUnBlock?:boolean;
}

export const getUserProfile = async (id:string): Promise<userProfileData> => {
  return http.get(`/user/profile/${id}`);
};
