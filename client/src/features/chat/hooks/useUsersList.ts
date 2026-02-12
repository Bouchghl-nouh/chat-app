import { useInfiniteQuery } from "@tanstack/react-query";
import { users } from "@/features/chat/api/dashboard.api";

export function useUsersList(username:string) {
  return useInfiniteQuery({
    queryKey: ["users", username],
    queryFn: ({pageParam}) => users(username,pageParam),
    initialPageParam:1,
    getNextPageParam:(data)=>{
      if(data.page < data.pages){
        return data.page+1;
      }
      return undefined;
    }
  });
}
