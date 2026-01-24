import {useQuery, useQueryClient} from "@tanstack/react-query"
import {getMyProfile} from "@/features/user/api/myProfile.api"

export function useMyProfile(){
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["myProfile"],
        queryFn: getMyProfile,
    });
}