import {useMutation} from "@tanstack/react-query"
import {login} from "@/features/auth/api/login.api"
import type{LoginData} from "@/features/auth/api/login.api"
import type { LoginFormSchema } from "../validation/login.schema"
import {useAppDispatch} from "@/hooks/redux"
import { setCredentials } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";


export function useLoginUser(){
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    return useMutation<LoginData, Error, LoginFormSchema>({
        mutationFn: login,
        onSuccess:(data:LoginData)=>{
            dispatch(setCredentials({
                accessToken:data.accessToken,
                username:data.username
            }))
            navigate("/");
        },

    });
}