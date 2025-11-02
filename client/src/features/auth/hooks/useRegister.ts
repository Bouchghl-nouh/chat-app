import {useMutation, useQueryClient} from "@tanstack/react-query"
import {register} from "@/features/auth/api/register.api"

export function useRegisterUser(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: register
    });
}