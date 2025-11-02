import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setAccessToken } from "@/store/slices/userSlice";
import { refreshToken } from "@/api/refreshToken.api";
const ProtectedRoute = () => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const refetchToken = async () => {
      if (!user.accessToken) {
        try {
          const data = await refreshToken();
          dispatch(setAccessToken(data.accessToken));
        } catch (err) {
          console.error("Failed to refresh token", err);
          navigate("/login");
        }
      }
    };
    refetchToken();
  }, [user.accessToken]);

  return <Outlet />;
};

export default ProtectedRoute;
