import {useQuery} from "@tanstack/react-query"
import {getUserProfile} from "@/features/user/api/displayProfile.api"
export function useUserProfile(id:string){
    return useQuery({
        queryKey: ["userProfile",id],
        queryFn: ()=>getUserProfile(id as string),
    });
}