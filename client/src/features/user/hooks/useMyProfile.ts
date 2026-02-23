import {useQuery} from "@tanstack/react-query"
import {getMyProfile} from "@/features/user/api/myProfile.api"

export function useMyProfile(){
    return useQuery({
        queryKey: ["myProfile"],
        queryFn: getMyProfile,
    });
}