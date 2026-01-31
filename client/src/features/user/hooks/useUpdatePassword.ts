import {useMutation} from "@tanstack/react-query"
import {updatePassword} from "@/features/user/api/updatePassword.api"
export function useUpdatePassword(){
    return useMutation({
        mutationFn: updatePassword,
    });
}