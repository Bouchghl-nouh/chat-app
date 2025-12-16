import { http } from "@/api/base";


export interface dashboardData {
  username: string;
  id: string;
  email:string;
  iat:number,
  exp:number
}

export const profile = async (): Promise<dashboardData> => {
  return http.get("/profile");
};
