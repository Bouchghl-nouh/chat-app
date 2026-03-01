import { useInfiniteQuery } from "@tanstack/react-query";
import { notifications } from "../api/notifications.api";

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({pageParam}) => notifications(pageParam),
    initialPageParam:1,
    getNextPageParam:(data)=>{
      if(data.page < data.pages){
        return data.page+1;
      }
      return undefined;
    }
  });
}
