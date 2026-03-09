import {useQuery} from "@tanstack/react-query"
import {getFriendsList} from "@/features/chat/api/friendsList.api"

export function useFriendsList(){
    return useQuery({
        queryKey: ["friendsList"],
        queryFn: getFriendsList,
    });
}