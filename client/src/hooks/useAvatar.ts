import { useQuery } from "@tanstack/react-query";
import { getAvatar } from "@/api/getAvatar.api";
import { useAppSelector } from "./redux";
import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";
export function useAvatar() {
  const { accessToken } = useAppSelector((state) => state.user);
  const user: { username: string; email: string; url: string } | null = useMemo(()=>{
    try{
        if(!accessToken) return null;
        return jwtDecode(accessToken);
    }catch(e){
        return null;
    }
  },[accessToken])
  const query = useQuery({
    queryKey: ["avatar",user?.url],
    queryFn: ()=> getAvatar(user?.url ?? ""),
    enabled: !!user?.url ,
    staleTime:1000*60*60,
    retry:1,
  });
  return {...query,user};
}
