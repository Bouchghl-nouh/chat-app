import { http } from "@/api/base";
export interface myProfileData {
  firstName: string;
  username: string;
  lastName: string;
  avatar:string;
  email:string;
}

export const getMyProfile = async (): Promise<myProfileData> => {
  return http.get("/user/me");
};
