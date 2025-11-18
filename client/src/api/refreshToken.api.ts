import {http} from "./base"

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  return await http.post<{ accessToken: string }>("/auth/refresh",undefined,undefined,false);
};
 
 // Single-flight logic to prevent multiple simultaneous refreshes
 let isRefreshing = false;
 let refreshPromise: Promise<{ accessToken: string }> | null = null;
 
 export function refreshTokenOnce(): Promise<{ accessToken: string }> {
   if (isRefreshing && refreshPromise) {
     return refreshPromise;
   }
   isRefreshing = true;
   refreshPromise = refreshToken()
     .finally(() => {
       isRefreshing = false;
       refreshPromise = null;
     });
   return refreshPromise;
 }
