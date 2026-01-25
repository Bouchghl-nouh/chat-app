import { useMutation } from "@tanstack/react-query";
import { logout } from "@/features/auth/api/logout.api";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import { clearCredentials } from "@/store/slices/userSlice";
import { useQueryClient } from "@tanstack/react-query";
export function useLogoutUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: logout,
    onSettled : () =>{
      dispatch(clearCredentials());
      queryClient.clear();
      navigate("/login",{replace:true});
    }
  });
}
