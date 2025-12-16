import {useQuery, useQueryClient} from "@tanstack/react-query"
import {profile} from "@/features/chat/api/dashboard.api"

export function useProfile(){
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["profile"],
        queryFn: profile
    });
}