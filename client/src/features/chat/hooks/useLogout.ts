import { useMutation } from "@tanstack/react-query";
import { logout } from "@/features/chat/api/logout.api";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/redux";
import { clearCredentials } from "@/store/slices/userSlice";
export function useLogoutUser() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(clearCredentials());
      navigate("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      dispatch(clearCredentials());
      navigate("/login");
    },
  });
}
