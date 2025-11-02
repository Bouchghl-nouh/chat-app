import {http} from "./base"

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  return await http.post<{ accessToken: string }>("/auth/refresh",undefined,undefined,false);
};
