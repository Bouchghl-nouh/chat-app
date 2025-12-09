import {useMutation} from "@tanstack/react-query"
import {register} from "@/features/auth/api/register.api"
import { useNavigate } from "react-router-dom";
export function useRegisterUser(){
    const navigate = useNavigate();
    return useMutation({
        mutationFn: register,
        onSuccess:()=>{
            navigate("/login");
        }
    });
}