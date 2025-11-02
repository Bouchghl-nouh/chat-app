import {useQuery, useQueryClient} from "@tanstack/react-query"
import {profile} from "@/features/dashboard/api/dashboard.api"

export function useProfile(){
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["profile"],
        queryFn: profile
    });
}